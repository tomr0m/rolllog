"""The AI Coach.

A wise BJJ coach reading the student's training journal. Two surfaces:
  - generate_inline_note: a short note right after a session is logged.
  - generate_dashboard_insights: three synthesized cards for the /coach page.

Every Anthropic call is wrapped so that an AI failure can NEVER break the app.
The session must always save; the dashboard always returns something.
"""

import json
import logging
from datetime import datetime, timezone

from anthropic import Anthropic
from sqlalchemy.orm import Session

from app.config import settings
from app.crud.session import get_session_stats
from app.crud.technique import (
    MASTERY_THRESHOLD,
    compute_initial_status,
    get_all_techniques,
    get_user_techniques_map,
)
from app.models.session import TrainingSession
from app.models.technique import Technique, TechniqueStatus
from app.models.user import User

logger = logging.getLogger(__name__)

# Fast + cheap — perfect for coaching suggestions.
MODEL = "claude-haiku-4-5-20251001"
INLINE_MAX_TOKENS = 500
DASHBOARD_MAX_TOKENS = 1500

# Module-level client singleton (created lazily once a key is configured).
_client: Anthropic | None = None


def ai_enabled() -> bool:
    """True if an Anthropic API key is configured."""
    return bool(settings.ANTHROPIC_API_KEY)


def get_anthropic_client() -> Anthropic | None:
    """Return a shared Anthropic client, or None if no key is configured."""
    global _client
    if not settings.ANTHROPIC_API_KEY:
        return None
    if _client is None:
        _client = Anthropic(api_key=settings.ANTHROPIC_API_KEY)
    return _client


# Fallback used when the AI is unavailable for the dashboard.
DASHBOARD_FALLBACK: dict = {
    "focus": {
        "title": "Keep Training",
        "technique_name": "Fundamentals",
        "body": "Continue logging sessions and the coach will have more to work with. "
        "Show up, drill the basics, and the patterns will reveal themselves.",
    },
    "close_to": {
        "title": "Stay Consistent",
        "technique_name": "Mat Time",
        "body": "Mastery comes from reps. Keep putting in rounds and you'll be "
        "closing in on your next milestone before long.",
    },
    "pattern": {
        "title": "Build The Habit",
        "body": "The most important pattern is simply training regularly. "
        "Once you've logged a few more sessions, deeper insights will emerge.",
    },
}


class AICoach:
    def __init__(self, client: Anthropic):
        self.client = client

    # ------------------------------------------------------------------
    # Context
    # ------------------------------------------------------------------
    def build_user_context(self, user: User, db: Session) -> str:
        """Builds a markdown summary of the user's training history for the AI."""
        stats = get_session_stats(db, user.id)
        all_techs = get_all_techniques(db)
        tech_by_id = {t.id: t for t in all_techs}
        ut_map = get_user_techniques_map(db, user.id)

        # Status counts (use computed status when no row exists).
        counts = {
            TechniqueStatus.LOCKED: 0,
            TechniqueStatus.UNLOCKED: 0,
            TechniqueStatus.ATTEMPTED: 0,
            TechniqueStatus.MASTERED: 0,
        }
        for t in all_techs:
            ut = ut_map.get(t.id)
            st = ut.status if ut else compute_initial_status(user, t, ut_map)
            counts[st] += 1

        # Mastered + attempted (in-progress) technique lists.
        mastered = [
            (tech_by_id[ut.technique_id].name, ut)
            for ut in ut_map.values()
            if ut.status == TechniqueStatus.MASTERED and ut.technique_id in tech_by_id
        ]
        mastered.sort(key=lambda x: x[1].times_practiced or 0, reverse=True)

        attempted = [
            (tech_by_id[ut.technique_id].name, ut)
            for ut in ut_map.values()
            if ut.status == TechniqueStatus.ATTEMPTED and ut.technique_id in tech_by_id
        ]
        attempted.sort(key=lambda x: x[1].times_practiced or 0, reverse=True)

        # Last 10 sessions.
        recent = (
            db.query(TrainingSession)
            .filter(TrainingSession.user_id == user.id)
            .order_by(TrainingSession.date.desc(), TrainingSession.created_at.desc())
            .limit(10)
            .all()
        )

        days_since_last = "N/A"
        if recent:
            last_date = recent[0].date
            days_since_last = (datetime.now(timezone.utc).date() - last_date).days

        # ---- Render markdown ----
        lines: list[str] = []
        lines.append(f"# Student Profile: {user.name}")
        lines.append("")
        lines.append("## Belt Rank")
        if user.practices_gi:
            belt = user.gi_belt.value.title() if user.gi_belt else "White"
            lines.append(f"- Gi: {belt} belt, {user.gi_stripes} stripe(s)")
        if user.practices_no_gi:
            belt = user.no_gi_belt.value.title() if user.no_gi_belt else "White"
            lines.append(f"- No-Gi: {belt} belt, {user.no_gi_stripes} stripe(s)")
        if not user.practices_gi and not user.practices_no_gi:
            lines.append("- (No discipline set yet)")
        lines.append("")

        lines.append("## Training Summary")
        lines.append(f"- Total sessions: {stats.total_sessions}")
        lines.append(f"- Total hours on the mat: {stats.total_hours}")
        lines.append(f"- This month: {stats.sessions_this_month} sessions, {stats.hours_this_month} hours")
        lines.append(f"- Current training streak: {stats.current_streak_days} day(s)")
        lines.append(f"- Gi sessions: {stats.gi_sessions} | No-Gi sessions: {stats.no_gi_sessions}")
        lines.append(f"- Days since last session: {days_since_last}")
        lines.append("")

        lines.append("## Technique Progress")
        lines.append(
            f"- Locked: {counts[TechniqueStatus.LOCKED]} | "
            f"Unlocked (available): {counts[TechniqueStatus.UNLOCKED]} | "
            f"Attempted (in progress): {counts[TechniqueStatus.ATTEMPTED]} | "
            f"Mastered: {counts[TechniqueStatus.MASTERED]}"
        )
        lines.append(f"- Mastery requires {MASTERY_THRESHOLD} logged reps of a technique.")
        lines.append("")

        if mastered:
            lines.append("### Top Mastered Techniques")
            for name, ut in mastered[:5]:
                lines.append(f"- {name} ({ut.times_practiced} reps)")
            lines.append("")

        if attempted:
            lines.append("### In Progress (closest to mastery)")
            for name, ut in attempted[:5]:
                lines.append(
                    f"- {name} ({ut.times_practiced}/{MASTERY_THRESHOLD} reps)"
                )
            lines.append("")

        if stats.top_partners:
            lines.append("## Top Training Partners")
            lines.append(", ".join(stats.top_partners[:5]))
            lines.append("")

        if recent:
            lines.append("## Last 10 Sessions")
            for s in recent:
                techs = self._session_technique_names(s, tech_by_id)
                tech_str = ", ".join(techs) if techs else "(none recorded)"
                partner_str = ", ".join(s.partners) if s.partners else "(solo / none)"
                note_str = (s.notes or "").strip().replace("\n", " ")
                if len(note_str) > 200:
                    note_str = note_str[:200] + "…"
                lines.append(
                    f"- {s.date} · {s.discipline.value} · {s.duration_minutes} min · "
                    f"Techniques: {tech_str} · Partners: {partner_str}"
                    + (f" · Notes: \"{note_str}\"" if note_str else "")
                )
            lines.append("")

        return "\n".join(lines)

    @staticmethod
    def _session_technique_names(
        session: TrainingSession, tech_by_id: dict[int, Technique]
    ) -> list[str]:
        """Combined recognized + raw custom technique names for a session."""
        names: list[str] = []
        for tid in session.technique_ids or []:
            t = tech_by_id.get(tid)
            if t:
                names.append(t.name)
        names.extend(session.techniques or [])
        return names

    # ------------------------------------------------------------------
    # Inline note
    # ------------------------------------------------------------------
    def generate_inline_note(
        self, user: User, latest_session: TrainingSession, db: Session
    ) -> str | None:
        """A short coaching note (2-3 sentences) right after a session is logged."""
        try:
            context = self.build_user_context(user, db)
            all_techs = get_all_techniques(db)
            tech_by_id = {t.id: t for t in all_techs}
            techniques = self._session_technique_names(latest_session, tech_by_id)

            prompt = f"""You are an experienced BJJ coach reviewing a student's training journal.

{context}

The student just logged this session:
- Date: {latest_session.date}
- Discipline: {latest_session.discipline.value}
- Duration: {latest_session.duration_minutes} minutes
- Techniques worked: {", ".join(techniques) if techniques else "(none recorded)"}
- Partners: {", ".join(latest_session.partners) if latest_session.partners else "(none)"}
- Notes: {latest_session.notes or "(none)"}

Write a brief, encouraging coaching note (2-3 sentences max) about THIS session specifically.
Reference patterns you notice (e.g., "I see you've been working triangles a lot — your grip game must be improving").
Sound like a real coach, not a chatbot. Speak directly to them.
Do NOT use phrases like "Based on your data" or "Here is my analysis".
Just speak naturally. Use occasional BJJ slang naturally.
NO markdown, NO bullet points. Pure prose only."""

            response = self.client.messages.create(
                model=MODEL,
                max_tokens=INLINE_MAX_TOKENS,
                messages=[{"role": "user", "content": prompt}],
            )
            text = next(
                (b.text for b in response.content if b.type == "text"), ""
            ).strip()
            return text or None
        except Exception as e:  # noqa: BLE001 — AI must never break session save
            logger.warning("AI inline coach note failed: %s", e)
            return None

    # ------------------------------------------------------------------
    # Dashboard insights
    # ------------------------------------------------------------------
    def generate_dashboard_insights(self, user: User, db: Session) -> dict:
        """Three structured coaching cards for the /coach page."""
        try:
            context = self.build_user_context(user, db)

            prompt = f"""You are an experienced BJJ coach analyzing a student's training journal to provide weekly guidance.

{context}

Based on their training history, generate 3 coaching insights. Return ONLY a JSON object with this exact shape:

{{
  "focus": {{
    "title": "<short title, 3-5 words>",
    "technique_name": "<specific technique name>",
    "body": "<2-3 sentences explaining why this should be their focus this week>"
  }},
  "close_to": {{
    "title": "<short title>",
    "technique_name": "<technique that's close to mastery, attempted but not yet mastered>",
    "body": "<2-3 sentences about what they're close to achieving>"
  }},
  "pattern": {{
    "title": "<short title about a pattern>",
    "body": "<2-3 sentences about an interesting pattern from their history — could be about training rhythm, partner choices, technique categories they favor, etc>"
  }}
}}

Be specific. Reference actual data. Sound like a real coach, not a chatbot.
Return ONLY the JSON object, no markdown wrapper, no explanation."""

            response = self.client.messages.create(
                model=MODEL,
                max_tokens=DASHBOARD_MAX_TOKENS,
                messages=[{"role": "user", "content": prompt}],
            )
            text = next((b.text for b in response.content if b.type == "text"), "")
            return self._parse_insights(text)
        except Exception as e:  # noqa: BLE001 — graceful degradation
            logger.warning("AI dashboard insights failed: %s", e)
            return dict(DASHBOARD_FALLBACK)

    @staticmethod
    def _parse_insights(text: str) -> dict:
        """Parse the model's JSON response, tolerating markdown fences."""
        try:
            cleaned = text.strip()
            # Strip ```json ... ``` fences if present.
            if cleaned.startswith("```"):
                cleaned = cleaned.split("```", 2)[1]
                if cleaned.startswith("json"):
                    cleaned = cleaned[4:]
                cleaned = cleaned.strip()
            # Fall back to slicing the outermost braces.
            if not cleaned.startswith("{"):
                start = cleaned.find("{")
                end = cleaned.rfind("}")
                if start != -1 and end != -1:
                    cleaned = cleaned[start : end + 1]

            data = json.loads(cleaned)

            # Validate shape; fill any missing sections from the fallback.
            result: dict = {}
            for key in ("focus", "close_to", "pattern"):
                section = data.get(key)
                if isinstance(section, dict) and section.get("body"):
                    result[key] = section
                else:
                    result[key] = DASHBOARD_FALLBACK[key]
            return result
        except Exception as e:  # noqa: BLE001
            logger.warning("Failed to parse AI insights JSON: %s", e)
            return dict(DASHBOARD_FALLBACK)
