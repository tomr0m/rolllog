"""Seed the techniques catalog.

Idempotent: skips slugs that already exist. Resolves prerequisite slugs to IDs
after inserting the first pass.

Run with:
    cd backend && source .venv/bin/activate && python -m scripts.seed_techniques
"""

import sys
from pathlib import Path

# Allow running as a script: python scripts/seed_techniques.py
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.database import SessionLocal
from app.models.technique import Technique, TechniqueCategory, TechniqueDiscipline
from app.models.user import Belt


# ---------------------------------------------------------------------------
# Catalog
# ---------------------------------------------------------------------------
# Each entry: slug, name, category, discipline, belt, stripes_required,
# description, aliases, prerequisite_slugs (resolved after first pass).

CATALOG: list[dict] = [
    # ==========================================================
    # WHITE BELT — FUNDAMENTALS (no prereqs)
    # ==========================================================
    dict(
        slug="hip-escape",
        name="Hip Escape / Shrimp",
        category=TechniqueCategory.FUNDAMENTAL,
        belt=Belt.WHITE,
        description="The foundational movement of jiu-jitsu — creating space and angle by shrimping your hips away from the opponent.",
        aliases=["shrimp", "shrimping", "hip escape", "elbow escape movement"],
        prereqs=[],
    ),
    dict(
        slug="bridge-and-roll",
        name="Bridge & Roll (Upa)",
        category=TechniqueCategory.FUNDAMENTAL,
        belt=Belt.WHITE,
        description="The hip-bridge motion that powers escapes from inferior positions, most notably the Upa to escape mount.",
        aliases=["bridge", "upa", "upa bridge", "bridge and roll", "hip bridge"],
        prereqs=[],
    ),
    dict(
        slug="technical-standup",
        name="Technical Stand-up",
        category=TechniqueCategory.FUNDAMENTAL,
        belt=Belt.WHITE,
        description="A safe way to return to your feet from the ground while keeping a strong base and posting on a hand.",
        aliases=["tech stand-up", "technical standup", "stand up in base"],
        prereqs=[],
    ),
    dict(
        slug="closed-guard",
        name="Closed Guard",
        category=TechniqueCategory.GUARD,
        belt=Belt.WHITE,
        description="The position with your legs locked around the opponent's waist — the classroom of jiu-jitsu.",
        aliases=["closed guard", "full guard", "guard"],
        prereqs=[],
    ),
    dict(
        slug="mount-position",
        name="Mount Position",
        category=TechniqueCategory.FUNDAMENTAL,
        belt=Belt.WHITE,
        description="The dominant position on top, sitting astride the opponent with hips heavy and posture upright.",
        aliases=["mount", "full mount", "high mount"],
        prereqs=[],
    ),
    dict(
        slug="side-control",
        name="Side Control",
        category=TechniqueCategory.FUNDAMENTAL,
        belt=Belt.WHITE,
        description="A dominant pin perpendicular to the opponent, controlling with chest pressure and hip alignment.",
        aliases=["side control", "side mount", "cross body", "100 kilos"],
        prereqs=[],
    ),
    dict(
        slug="back-control",
        name="Back Control",
        category=TechniqueCategory.FUNDAMENTAL,
        belt=Belt.WHITE,
        description="The highest-value control position — hooks in, seatbelt grip, both opponents facing away from you.",
        aliases=["back mount", "back control", "rear mount", "back take"],
        prereqs=[],
    ),
    dict(
        slug="knee-on-belly",
        name="Knee on Belly",
        category=TechniqueCategory.FUNDAMENTAL,
        belt=Belt.WHITE,
        description="A transitional top position with one knee pressing into the opponent's belly — high mobility, high pressure.",
        aliases=["knee on belly", "knee mount", "knee ride", "kob"],
        prereqs=[],
    ),
    # ==========================================================
    # WHITE BELT — GUARD WORK (prereq: closed-guard)
    # ==========================================================
    dict(
        slug="scissor-sweep",
        name="Scissor Sweep",
        category=TechniqueCategory.SWEEP,
        belt=Belt.WHITE,
        description="A classic closed-guard sweep using a scissor motion of the legs and a strong collar/sleeve grip combination.",
        aliases=["scissor sweep", "tesoura"],
        prereqs=["closed-guard"],
    ),
    dict(
        slug="pendulum-sweep",
        name="Pendulum Sweep",
        category=TechniqueCategory.SWEEP,
        belt=Belt.WHITE,
        description="A momentum-driven sweep from closed guard, swinging the legs like a pendulum to topple the opponent.",
        aliases=["pendulum sweep", "flower sweep", "balanco"],
        prereqs=["closed-guard"],
    ),
    dict(
        slug="hip-bump-sweep",
        name="Hip Bump Sweep",
        category=TechniqueCategory.SWEEP,
        belt=Belt.WHITE,
        description="Sitting up from closed guard and bumping with the hips to roll the opponent over the far shoulder.",
        aliases=["hip bump", "hip bump sweep", "sit-up sweep"],
        prereqs=["closed-guard"],
    ),
    dict(
        slug="triangle-choke",
        name="Triangle Choke",
        category=TechniqueCategory.SUBMISSION,
        belt=Belt.WHITE,
        stripes_required=2,
        description="A choke using the legs in a figure-four to trap the opponent's neck and one of their arms.",
        aliases=["triangle", "triangle choke", "sankaku jime", "triangle from guard"],
        prereqs=["closed-guard"],
    ),
    dict(
        slug="cross-collar-choke",
        name="Cross Collar Choke",
        category=TechniqueCategory.SUBMISSION,
        discipline=TechniqueDiscipline.GI_ONLY,
        belt=Belt.WHITE,
        stripes_required=1,
        description="A gi choke from closed guard using deep cross-grips on the opponent's collar.",
        aliases=["cross choke", "cross collar choke", "x choke", "cross collar from guard"],
        prereqs=["closed-guard"],
    ),
    dict(
        slug="armbar-from-guard",
        name="Armbar from Guard",
        category=TechniqueCategory.SUBMISSION,
        belt=Belt.WHITE,
        stripes_required=1,
        description="The foundational arm-attack from closed guard — isolate the arm, climb the legs high, and extend.",
        aliases=["armbar", "armbar from guard", "juji gatame", "arm bar"],
        prereqs=["closed-guard"],
    ),
    dict(
        slug="kimura-from-guard",
        name="Kimura from Guard",
        category=TechniqueCategory.SUBMISSION,
        belt=Belt.WHITE,
        stripes_required=1,
        description="A shoulder lock from closed guard using a figure-four grip on the opponent's wrist.",
        aliases=["kimura", "kimura from guard", "double wristlock", "ude garami"],
        prereqs=["closed-guard"],
    ),
    # ==========================================================
    # WHITE BELT — ESCAPES
    # ==========================================================
    dict(
        slug="mount-escape",
        name="Mount Escape (Upa & Elbow Escape)",
        category=TechniqueCategory.ESCAPE,
        belt=Belt.WHITE,
        description="The two foundational escapes from mount — the bridge (Upa) and the elbow escape (shrimp out).",
        aliases=["mount escape", "upa escape", "elbow escape from mount"],
        prereqs=["mount-position", "bridge-and-roll", "hip-escape"],
    ),
    dict(
        slug="side-control-escape",
        name="Side Control Escape",
        category=TechniqueCategory.ESCAPE,
        belt=Belt.WHITE,
        description="Recovering guard or knees from underneath side control using framing and hip movement.",
        aliases=["side control escape", "shrimp to guard", "frame and escape"],
        prereqs=["side-control", "hip-escape"],
    ),
    dict(
        slug="back-escape",
        name="Back Escape",
        category=TechniqueCategory.ESCAPE,
        belt=Belt.WHITE,
        stripes_required=2,
        description="Sliding off the back to the mat side — protecting the neck and breaking the seatbelt grip.",
        aliases=["back escape", "back mount escape", "escape from back control"],
        prereqs=["back-control"],
    ),
    # ==========================================================
    # WHITE BELT — PASSES
    # ==========================================================
    dict(
        slug="knee-slice-pass",
        name="Knee Slice Pass",
        category=TechniqueCategory.PASS,
        belt=Belt.WHITE,
        stripes_required=1,
        description="A passing technique where the lead knee slices across the opponent's thigh to take side control.",
        aliases=["knee slice", "knee cut", "knee slide", "knee cut pass"],
        prereqs=["closed-guard"],
    ),
    dict(
        slug="toreando-pass",
        name="Toreando Pass",
        category=TechniqueCategory.PASS,
        belt=Belt.WHITE,
        stripes_required=1,
        description="A standing pass that throws the opponent's legs aside, like a bullfighter (toreador).",
        aliases=["toreando", "torreando", "bullfighter pass", "toreador pass"],
        prereqs=["closed-guard"],
    ),
    dict(
        slug="stack-pass",
        name="Stack Pass",
        category=TechniqueCategory.PASS,
        belt=Belt.WHITE,
        stripes_required=1,
        description="Folding the opponent in half by stacking their legs over their head and walking around.",
        aliases=["stack pass", "stacking pass"],
        prereqs=["closed-guard"],
    ),
    # ==========================================================
    # WHITE BELT — SUBMISSIONS FROM MOUNT
    # ==========================================================
    dict(
        slug="americana-from-mount",
        name="Americana from Mount",
        category=TechniqueCategory.SUBMISSION,
        belt=Belt.WHITE,
        stripes_required=1,
        description="A bent-arm lock from mount — paint the floor with the opponent's hand in a figure-four.",
        aliases=["americana", "keylock", "ude garami top", "americana from mount"],
        prereqs=["mount-position"],
    ),
    dict(
        slug="armbar-from-mount",
        name="Armbar from Mount",
        category=TechniqueCategory.SUBMISSION,
        belt=Belt.WHITE,
        stripes_required=2,
        description="Isolating the arm from the top mount and stepping over the head to finish.",
        aliases=["armbar from mount", "juji gatame from mount", "mount armbar"],
        prereqs=["mount-position"],
    ),
    dict(
        slug="cross-collar-from-mount",
        name="Cross Collar from Mount",
        category=TechniqueCategory.SUBMISSION,
        discipline=TechniqueDiscipline.GI_ONLY,
        belt=Belt.WHITE,
        stripes_required=2,
        description="Deep cross-grips from mount delivering a powerful collar choke.",
        aliases=["cross collar from mount", "cross choke from mount", "mount collar choke"],
        prereqs=["mount-position"],
    ),
    # ==========================================================
    # BLUE BELT — GUARDS
    # ==========================================================
    dict(
        slug="spider-guard",
        name="Spider Guard",
        category=TechniqueCategory.GUARD,
        discipline=TechniqueDiscipline.GI_ONLY,
        belt=Belt.BLUE,
        description="An open guard using sleeve grips and feet on the biceps to control distance and create sweeps.",
        aliases=["spider guard", "aranha"],
        prereqs=["closed-guard"],
    ),
    dict(
        slug="de-la-riva-guard",
        name="De La Riva Guard",
        category=TechniqueCategory.GUARD,
        belt=Belt.BLUE,
        description="An open guard hooking one leg around the outside of the opponent's leg, opening many sweep and back-take options.",
        aliases=["de la riva", "dlr", "de la riva guard"],
        prereqs=["closed-guard"],
    ),
    dict(
        slug="butterfly-guard",
        name="Butterfly Guard",
        category=TechniqueCategory.GUARD,
        belt=Belt.BLUE,
        description="A seated open guard with both feet hooked inside the opponent's thighs — a sweep engine.",
        aliases=["butterfly guard", "butterfly", "hooks guard"],
        prereqs=["closed-guard"],
    ),
    dict(
        slug="half-guard",
        name="Half Guard",
        category=TechniqueCategory.GUARD,
        belt=Belt.BLUE,
        description="Trapping one of the opponent's legs between your own — a foundational sweep-and-back-take position.",
        aliases=["half guard", "halfguard"],
        prereqs=["closed-guard"],
    ),
    dict(
        slug="lasso-guard",
        name="Lasso Guard",
        category=TechniqueCategory.GUARD,
        discipline=TechniqueDiscipline.GI_ONLY,
        belt=Belt.BLUE,
        description="Threading a leg through the opponent's arm to lasso it — controls posture and opens up sweeps.",
        aliases=["lasso guard", "lasso"],
        prereqs=["spider-guard"],
    ),
    dict(
        slug="x-guard",
        name="X-Guard",
        category=TechniqueCategory.GUARD,
        belt=Belt.BLUE,
        stripes_required=2,
        description="Hooking deep under the opponent's far leg while controlling their near leg — high-percentage standing sweeps.",
        aliases=["x guard", "x-guard"],
        prereqs=["butterfly-guard"],
    ),
    dict(
        slug="single-leg-x",
        name="Single Leg X",
        category=TechniqueCategory.GUARD,
        belt=Belt.BLUE,
        stripes_required=2,
        description="A modified X-Guard variant controlling a single leg — popular for leg-entries and ashi garami systems.",
        aliases=["single leg x", "slx", "ashi garami"],
        prereqs=["x-guard"],
    ),
    dict(
        slug="tornado-guard",
        name="Tornado Guard",
        category=TechniqueCategory.GUARD,
        belt=Belt.BLUE,
        stripes_required=2,
        description="A rolling, dynamic open guard popularized by Cyborg Abreu, leveraging inverted control.",
        aliases=["tornado guard", "tornado"],
        prereqs=["de-la-riva-guard"],
    ),
    # ==========================================================
    # BLUE BELT — SWEEPS
    # ==========================================================
    dict(
        slug="hook-sweep",
        name="Hook Sweep",
        category=TechniqueCategory.SWEEP,
        belt=Belt.BLUE,
        description="A butterfly-guard sweep using the hook to lift the opponent's leg as you fall to one side.",
        aliases=["hook sweep", "butterfly hook sweep"],
        prereqs=["butterfly-guard"],
    ),
    dict(
        slug="butterfly-sweep",
        name="Butterfly Sweep",
        category=TechniqueCategory.SWEEP,
        belt=Belt.BLUE,
        description="An underhook-and-elevate sweep from butterfly guard, classic Marcelo Garcia.",
        aliases=["butterfly sweep", "butterfly", "underhook sweep"],
        prereqs=["butterfly-guard"],
    ),
    dict(
        slug="old-school-sweep",
        name="Old School Sweep",
        category=TechniqueCategory.SWEEP,
        belt=Belt.BLUE,
        description="A classic half-guard sweep — overhook the leg, walk yourself around, and topple the opponent.",
        aliases=["old school", "old school sweep", "half guard sweep"],
        prereqs=["half-guard"],
    ),
    # ==========================================================
    # BLUE BELT — PASSES
    # ==========================================================
    dict(
        slug="double-under-pass",
        name="Double Under Pass",
        category=TechniqueCategory.PASS,
        belt=Belt.BLUE,
        description="Scooping both of the opponent's legs onto your shoulders and walking around — heavy and grinding.",
        aliases=["double under", "double under pass", "double unders"],
        prereqs=["stack-pass"],
    ),
    dict(
        slug="smash-pass",
        name="Smash Pass",
        category=TechniqueCategory.PASS,
        belt=Belt.BLUE,
        description="Flattening the opponent's hip with chest-to-knee pressure and shaving past their legs.",
        aliases=["smash pass", "leg smash pass"],
        prereqs=["stack-pass"],
    ),
    dict(
        slug="long-step-pass",
        name="Long Step Pass",
        category=TechniqueCategory.PASS,
        belt=Belt.BLUE,
        description="Stepping over the opponent's hip in a long arc to land directly into mount or side control.",
        aliases=["long step", "long step pass"],
        prereqs=["knee-slice-pass"],
    ),
    dict(
        slug="leg-drag",
        name="Leg Drag",
        category=TechniqueCategory.PASS,
        belt=Belt.BLUE,
        description="Dragging the opponent's leg across their centerline to flatten them and pass to the side.",
        aliases=["leg drag", "leg drag pass"],
        prereqs=["toreando-pass"],
    ),
    # ==========================================================
    # BLUE BELT — SUBMISSIONS
    # ==========================================================
    dict(
        slug="bow-and-arrow-choke",
        name="Bow & Arrow Choke",
        category=TechniqueCategory.SUBMISSION,
        discipline=TechniqueDiscipline.GI_ONLY,
        belt=Belt.BLUE,
        description="A devastating choke from back control using the collar and leg in opposite directions.",
        aliases=["bow and arrow", "bow & arrow", "bow and arrow choke"],
        prereqs=["back-control"],
    ),
    dict(
        slug="rear-naked-choke",
        name="Rear Naked Choke",
        category=TechniqueCategory.SUBMISSION,
        belt=Belt.BLUE,
        description="The classic blood choke from back control, no gi required.",
        aliases=["rear naked choke", "rnc", "mata leao", "rear naked"],
        prereqs=["back-control"],
    ),
    dict(
        slug="loop-choke",
        name="Loop Choke",
        category=TechniqueCategory.SUBMISSION,
        discipline=TechniqueDiscipline.GI_ONLY,
        belt=Belt.BLUE,
        description="A spinning collar choke from the front headlock or guard.",
        aliases=["loop choke"],
        prereqs=["cross-collar-choke"],
    ),
    dict(
        slug="darce-choke",
        name="D'Arce Choke",
        category=TechniqueCategory.SUBMISSION,
        belt=Belt.BLUE,
        description="A no-gi front-headlock choke threading the arm under the neck and across.",
        aliases=["darce", "d'arce", "d arce choke", "brabo choke"],
        prereqs=["side-control"],
    ),
    dict(
        slug="anaconda-choke",
        name="Anaconda Choke",
        category=TechniqueCategory.SUBMISSION,
        belt=Belt.BLUE,
        description="A front-headlock choke rolled out to the side, named for its constricting motion.",
        aliases=["anaconda", "anaconda choke"],
        prereqs=["side-control"],
    ),
    dict(
        slug="guillotine-choke",
        name="Guillotine Choke",
        category=TechniqueCategory.SUBMISSION,
        belt=Belt.BLUE,
        description="A front-headlock choke gripping the back of the neck and pulling up — defends against shots and from guard.",
        aliases=["guillotine", "guillotine choke", "front choke"],
        prereqs=["closed-guard"],
    ),
    dict(
        slug="ezekiel-choke",
        name="Ezekiel Choke",
        category=TechniqueCategory.SUBMISSION,
        discipline=TechniqueDiscipline.GI_ONLY,
        belt=Belt.BLUE,
        description="A sleeve-grip choke that can be hit from almost anywhere — top, bottom, or back.",
        aliases=["ezekiel", "ezekiel choke", "estrangulamento ezequiel"],
        prereqs=["mount-position"],
    ),
    dict(
        slug="omoplata",
        name="Omoplata",
        category=TechniqueCategory.SUBMISSION,
        belt=Belt.BLUE,
        stripes_required=1,
        description="A shoulder lock applied with the legs — equally useful as a sweep, a sub, or a transition.",
        aliases=["omoplata", "omoplata from guard"],
        prereqs=["closed-guard", "triangle-choke"],
    ),
    dict(
        slug="triangle-from-mount",
        name="Triangle from Mount",
        category=TechniqueCategory.SUBMISSION,
        belt=Belt.BLUE,
        stripes_required=2,
        description="Catching the triangle choke from the top, often as a counter to a strong frame.",
        aliases=["triangle from mount", "mount triangle"],
        prereqs=["mount-position", "triangle-choke"],
    ),
    # ==========================================================
    # BLUE BELT — TAKEDOWNS
    # ==========================================================
    dict(
        slug="double-leg",
        name="Double Leg Takedown",
        category=TechniqueCategory.TAKEDOWN,
        belt=Belt.BLUE,
        description="Shooting at both of the opponent's legs to lift and dump them to the mat.",
        aliases=["double leg", "double-leg", "double leg takedown"],
        prereqs=[],
    ),
    dict(
        slug="single-leg",
        name="Single Leg Takedown",
        category=TechniqueCategory.TAKEDOWN,
        belt=Belt.BLUE,
        description="Shooting on one leg, controlling it tight against your chest, and finishing in any direction.",
        aliases=["single leg", "single-leg", "single leg takedown"],
        prereqs=[],
    ),
    dict(
        slug="osoto-gari",
        name="Foot Sweep (Osoto Gari)",
        category=TechniqueCategory.TAKEDOWN,
        belt=Belt.BLUE,
        description="A judo throw — reaping the opponent's leg from the outside while breaking their balance backward.",
        aliases=["osoto gari", "foot sweep", "outer reap"],
        prereqs=[],
    ),
    dict(
        slug="o-goshi",
        name="Hip Throw (O Goshi)",
        category=TechniqueCategory.TAKEDOWN,
        belt=Belt.BLUE,
        description="A judo hip throw, loading the opponent over your hip and rolling them onto their back.",
        aliases=["o goshi", "ogoshi", "hip throw", "major hip throw"],
        prereqs=[],
    ),
    # ==========================================================
    # BLUE BELT — TRANSITIONS
    # ==========================================================
    dict(
        slug="mount-to-back",
        name="Mount to Back",
        category=TechniqueCategory.TRANSITION,
        belt=Belt.BLUE,
        description="Riding the opponent's roll-out attempt and taking the back as they expose it.",
        aliases=["mount to back", "back take from mount"],
        prereqs=["mount-position", "back-control"],
    ),
    dict(
        slug="s-mount",
        name="S-Mount",
        category=TechniqueCategory.TRANSITION,
        belt=Belt.BLUE,
        stripes_required=1,
        description="A high-mount variation with one leg curled across — the launchpad for armbars and triangles from top.",
        aliases=["s-mount", "s mount", "high mount"],
        prereqs=["mount-position"],
    ),
    # ==========================================================
    # PURPLE BELT — GUARDS / SYSTEMS
    # ==========================================================
    dict(
        slug="berimbolo",
        name="Berimbolo",
        category=TechniqueCategory.SWEEP,
        belt=Belt.PURPLE,
        description="A modern back-take system rolling under from De La Riva, popularized by the Mendes brothers.",
        aliases=["berimbolo", "berimbolo sweep"],
        prereqs=["de-la-riva-guard"],
    ),
    dict(
        slug="fifty-fifty-guard",
        name="50/50 Guard",
        category=TechniqueCategory.GUARD,
        belt=Belt.PURPLE,
        description="A symmetrical leg-entanglement opening up footlocks and back-take sequences.",
        aliases=["50/50", "fifty fifty", "fifty-fifty guard", "50 50 guard"],
        prereqs=["single-leg-x"],
    ),
    dict(
        slug="inverted-guard",
        name="Inverted Guard",
        category=TechniqueCategory.GUARD,
        belt=Belt.PURPLE,
        description="An open guard played upside-down on the shoulders — used to invert under passes and set up sweeps.",
        aliases=["inverted guard", "inversion"],
        prereqs=["de-la-riva-guard"],
    ),
    dict(
        slug="worm-guard",
        name="Worm Guard",
        category=TechniqueCategory.GUARD,
        discipline=TechniqueDiscipline.GI_ONLY,
        belt=Belt.PURPLE,
        description="A lapel-guard system threading the opponent's lapel between their legs for unique control.",
        aliases=["worm guard"],
        prereqs=["lasso-guard"],
    ),
    dict(
        slug="lapel-guard",
        name="Lapel Guard",
        category=TechniqueCategory.GUARD,
        discipline=TechniqueDiscipline.GI_ONLY,
        belt=Belt.PURPLE,
        description="A family of guards using the opponent's own lapel to tie up their movement.",
        aliases=["lapel guard"],
        prereqs=["spider-guard"],
    ),
    # ==========================================================
    # PURPLE BELT — LEG LOCKS
    # ==========================================================
    dict(
        slug="straight-ankle-lock",
        name="Straight Ankle Lock",
        category=TechniqueCategory.SUBMISSION,
        belt=Belt.PURPLE,
        description="The classic Achilles-tendon attack from leg entanglements.",
        aliases=["straight ankle lock", "ankle lock", "achilles lock"],
        prereqs=["single-leg-x"],
    ),
    dict(
        slug="heel-hook",
        name="Heel Hook",
        category=TechniqueCategory.SUBMISSION,
        discipline=TechniqueDiscipline.NO_GI_ONLY,
        belt=Belt.PURPLE,
        stripes_required=1,
        description="A devastating rotational knee attack via the heel — illegal in many gi rule-sets, dominant in no-gi.",
        aliases=["heel hook", "inside heel hook", "outside heel hook"],
        prereqs=["single-leg-x"],
    ),
    dict(
        slug="toe-hold",
        name="Toe Hold",
        category=TechniqueCategory.SUBMISSION,
        belt=Belt.PURPLE,
        description="A foot-and-ankle attack twisting the foot into a vulnerable angle.",
        aliases=["toe hold", "toehold"],
        prereqs=["straight-ankle-lock"],
    ),
    dict(
        slug="kneebar",
        name="Kneebar",
        category=TechniqueCategory.SUBMISSION,
        belt=Belt.PURPLE,
        description="A hyperextension attack on the knee — like an armbar, but on the leg.",
        aliases=["kneebar", "knee bar"],
        prereqs=["straight-ankle-lock"],
    ),
    # ==========================================================
    # PURPLE BELT — EXOTIC SUBMISSIONS
    # ==========================================================
    dict(
        slug="baratoplata",
        name="Baratoplata",
        category=TechniqueCategory.SUBMISSION,
        belt=Belt.PURPLE,
        description="A shoulder lock variant from a kimura grip with the leg blocking — named after Rafael Barata Freitas.",
        aliases=["baratoplata"],
        prereqs=["kimura-from-guard"],
    ),
    dict(
        slug="tarikoplata",
        name="Tarikoplata",
        category=TechniqueCategory.SUBMISSION,
        belt=Belt.PURPLE,
        description="A kimura-position shoulder lock finished by threading the leg over the head — named after Tarik Hopstock.",
        aliases=["tarikoplata"],
        prereqs=["kimura-from-guard"],
    ),
    dict(
        slug="crucifix",
        name="Crucifix",
        category=TechniqueCategory.SUBMISSION,
        belt=Belt.PURPLE,
        description="A back-attack pinning both of the opponent's arms with your legs — opens armbars, chokes, and neck cranks.",
        aliases=["crucifix", "crucifix position"],
        prereqs=["back-control"],
    ),
    dict(
        slug="twister",
        name="Twister",
        category=TechniqueCategory.SUBMISSION,
        belt=Belt.PURPLE,
        description="A spinal lock attacking the neck and torso from a truck-style leg entanglement.",
        aliases=["twister", "guillotine twist"],
        prereqs=["back-control"],
    ),
    dict(
        slug="tomoe-nage",
        name="Tomoe Nage",
        category=TechniqueCategory.SWEEP,
        belt=Belt.PURPLE,
        description="The classic sacrifice throw — falling backward and launching the opponent overhead with a foot.",
        aliases=["tomoe nage", "tomoenage", "circle throw"],
        prereqs=["closed-guard"],
    ),
    dict(
        slug="imanari-roll",
        name="Imanari Roll",
        category=TechniqueCategory.SWEEP,
        belt=Belt.PURPLE,
        description="A rolling leg-entry from feet, dropping under the opponent into a leg-lock control.",
        aliases=["imanari", "imanari roll"],
        prereqs=["single-leg-x"],
    ),
    # ==========================================================
    # PURPLE BELT — PASSES / SYSTEMS
    # ==========================================================
    dict(
        slug="knee-cut-with-underhook",
        name="Knee Cut with Underhook",
        category=TechniqueCategory.PASS,
        belt=Belt.PURPLE,
        description="The high-percentage knee-cut variation locking in the underhook to stop frames.",
        aliases=["knee cut underhook", "knee slice underhook"],
        prereqs=["knee-slice-pass"],
    ),
    dict(
        slug="stack-pass-bodylock",
        name="Stack Pass with Bodylock",
        category=TechniqueCategory.PASS,
        belt=Belt.PURPLE,
        description="Locking the bodylock from the stack to control the hips through the pass.",
        aliases=["bodylock pass", "stack pass bodylock"],
        prereqs=["stack-pass"],
    ),
    dict(
        slug="k-guard",
        name="K-Guard",
        category=TechniqueCategory.GUARD,
        belt=Belt.PURPLE,
        description="A leg-entry guard shaped like the letter K — launchpad for modern leg locks.",
        aliases=["k guard", "k-guard"],
        prereqs=["de-la-riva-guard"],
    ),
    dict(
        slug="z-guard",
        name="Z-Guard",
        category=TechniqueCategory.GUARD,
        belt=Belt.PURPLE,
        description="A knee-shield half-guard variation creating distance and angles for sweeps.",
        aliases=["z guard", "z-guard", "knee shield"],
        prereqs=["half-guard"],
    ),
    dict(
        slug="pressure-pass-system",
        name="Pressure Pass System",
        category=TechniqueCategory.PASS,
        belt=Belt.PURPLE,
        description="An integrated set of heavy, grinding passes built around hip-pressure and weight distribution.",
        aliases=["pressure pass", "pressure pass system", "heavy pass"],
        prereqs=["smash-pass", "double-under-pass"],
    ),
    # ==========================================================
    # BROWN BELT — placeholders
    # ==========================================================
    dict(
        slug="brown-belt-tba-1",
        name="ADVANCED — More techniques unlocking soon.",
        category=TechniqueCategory.FUNDAMENTAL,
        belt=Belt.BROWN,
        description="The brown-belt section is under construction. Keep training; we'll fill this in.",
        aliases=[],
        prereqs=[],
    ),
    dict(
        slug="brown-belt-tba-2",
        name="ADVANCED — More techniques unlocking soon.",
        category=TechniqueCategory.FUNDAMENTAL,
        belt=Belt.BROWN,
        description="The brown-belt section is under construction. Keep training; we'll fill this in.",
        aliases=[],
        prereqs=[],
    ),
    # ==========================================================
    # BLACK BELT — placeholders
    # ==========================================================
    dict(
        slug="black-belt-tba-1",
        name="ADVANCED — More techniques unlocking soon.",
        category=TechniqueCategory.FUNDAMENTAL,
        belt=Belt.BLACK,
        description="The black-belt section is under construction. Keep training; we'll fill this in.",
        aliases=[],
        prereqs=[],
    ),
    dict(
        slug="black-belt-tba-2",
        name="ADVANCED — More techniques unlocking soon.",
        category=TechniqueCategory.FUNDAMENTAL,
        belt=Belt.BLACK,
        description="The black-belt section is under construction. Keep training; we'll fill this in.",
        aliases=[],
        prereqs=[],
    ),
]


def main() -> None:
    db = SessionLocal()
    try:
        # PASS 1 — insert all techniques without prereqs resolved
        slug_to_id: dict[str, int] = {}
        existing = {t.slug: t for t in db.query(Technique).all()}

        for idx, entry in enumerate(CATALOG):
            slug = entry["slug"]
            if slug in existing:
                slug_to_id[slug] = existing[slug].id
                continue
            tech = Technique(
                slug=slug,
                name=entry["name"],
                category=entry["category"],
                discipline=entry.get("discipline", TechniqueDiscipline.BOTH),
                belt_required=entry["belt"],
                stripes_required=entry.get("stripes_required", 0),
                description=entry.get("description"),
                aliases=entry.get("aliases", []),
                prerequisite_technique_ids=[],
                sort_order=idx,
            )
            db.add(tech)
            db.flush()
            slug_to_id[slug] = tech.id

        db.commit()

        # PASS 2 — resolve prereq slugs to IDs
        for entry in CATALOG:
            prereq_ids = [slug_to_id[p] for p in entry.get("prereqs", []) if p in slug_to_id]
            if not prereq_ids:
                continue
            tech = db.query(Technique).filter(Technique.slug == entry["slug"]).first()
            if tech and tech.prerequisite_technique_ids != prereq_ids:
                tech.prerequisite_technique_ids = prereq_ids
        db.commit()

        total = db.query(Technique).count()
        print(f"✓ Seeded techniques catalog. Total in DB: {total}")
    finally:
        db.close()


if __name__ == "__main__":
    main()
