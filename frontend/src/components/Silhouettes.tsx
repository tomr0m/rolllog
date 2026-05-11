const C = '#333333'

/* ── HELIO GRACIE — Closed Guard (guard player lying on back, legs raised) ── */
export function HelioSilhouette() {
  return (
    <svg viewBox="0 0 200 300" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="w-full h-full">
      {/* Head (on mat, lower-left) */}
      <circle cx="38" cy="248" r="20" fill={C} />
      {/* Neck */}
      <ellipse cx="56" cy="226" rx="9" ry="13" transform="rotate(-28 56 226)" fill={C} />
      {/* Upper torso — lying diagonally */}
      <ellipse cx="88" cy="197" rx="17" ry="46" transform="rotate(-28 88 197)" fill={C} />
      {/* Hips — wider */}
      <ellipse cx="122" cy="165" rx="26" ry="17" fill={C} />
      {/* Left thigh raised */}
      <ellipse cx="112" cy="114" rx="13" ry="44" transform="rotate(-10 112 114)" fill={C} />
      {/* Left lower leg bent at knee */}
      <ellipse cx="102" cy="67" rx="10" ry="32" transform="rotate(28 102 67)" fill={C} />
      {/* Right thigh raised wider */}
      <ellipse cx="148" cy="112" rx="13" ry="44" transform="rotate(18 148 112)" fill={C} />
      {/* Right lower leg bent */}
      <ellipse cx="164" cy="64" rx="10" ry="32" transform="rotate(-18 164 64)" fill={C} />
      {/* Left arm reaching up/out */}
      <ellipse cx="62" cy="194" rx="9" ry="34" transform="rotate(-52 62 194)" fill={C} />
      {/* Right arm reaching up */}
      <ellipse cx="82" cy="181" rx="9" ry="34" transform="rotate(-38 82 181)" fill={C} />
    </svg>
  )
}

/* ── RICKSON GRACIE — Standing Ready (fighting stance, hands raised) ── */
export function RicksonSilhouette() {
  return (
    <svg viewBox="0 0 200 300" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="w-full h-full">
      {/* Head */}
      <circle cx="100" cy="32" r="19" fill={C} />
      {/* Neck */}
      <rect x="91" y="49" width="18" height="16" fill={C} />
      {/* Torso — broad shoulders tapering to waist */}
      <path d="M62 64 L138 64 L130 172 L70 172 Z" fill={C} />
      {/* Left shoulder mass */}
      <ellipse cx="62" cy="78" rx="14" ry="22" fill={C} />
      {/* Left arm raised (guard) */}
      <ellipse cx="46" cy="98" rx="12" ry="36" transform="rotate(-18 46 98)" fill={C} />
      {/* Left forearm/fist up */}
      <ellipse cx="34" cy="64" rx="10" ry="24" transform="rotate(12 34 64)" fill={C} />
      {/* Right shoulder mass */}
      <ellipse cx="138" cy="78" rx="14" ry="22" fill={C} />
      {/* Right arm raised (guard) */}
      <ellipse cx="154" cy="98" rx="12" ry="36" transform="rotate(18 154 98)" fill={C} />
      {/* Right forearm/fist up */}
      <ellipse cx="166" cy="64" rx="10" ry="24" transform="rotate(-12 166 64)" fill={C} />
      {/* Hips */}
      <ellipse cx="100" cy="176" rx="34" ry="15" fill={C} />
      {/* Left thigh — slightly wide stance */}
      <ellipse cx="80" cy="222" rx="15" ry="44" transform="rotate(-4 80 222)" fill={C} />
      {/* Left calf */}
      <ellipse cx="75" cy="281" rx="12" ry="20" fill={C} />
      {/* Right thigh */}
      <ellipse cx="120" cy="222" rx="15" ry="44" transform="rotate(4 120 222)" fill={C} />
      {/* Right calf */}
      <ellipse cx="125" cy="281" rx="12" ry="20" fill={C} />
    </svg>
  )
}

/* ── ROGER GRACIE — Mount (sitting upright, dominant position) ── */
export function RogerSilhouette() {
  return (
    <svg viewBox="0 0 200 300" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="w-full h-full">
      {/* Head — upright, dominant */}
      <circle cx="100" cy="42" r="20" fill={C} />
      {/* Neck */}
      <rect x="91" y="60" width="18" height="16" fill={C} />
      {/* Torso — upright, broad chest */}
      <path d="M63 76 L137 76 L133 178 L67 178 Z" fill={C} />
      {/* Left shoulder */}
      <ellipse cx="58" cy="88" rx="15" ry="24" fill={C} />
      {/* Left arm pressing downward */}
      <ellipse cx="46" cy="122" rx="12" ry="38" transform="rotate(22 46 122)" fill={C} />
      <ellipse cx="36" cy="158" rx="10" ry="22" transform="rotate(-8 36 158)" fill={C} />
      {/* Right shoulder */}
      <ellipse cx="142" cy="88" rx="15" ry="24" fill={C} />
      {/* Right arm pressing downward */}
      <ellipse cx="154" cy="122" rx="12" ry="38" transform="rotate(-22 154 122)" fill={C} />
      <ellipse cx="164" cy="158" rx="10" ry="22" transform="rotate(8 164 158)" fill={C} />
      {/* Hips — wide in mount */}
      <ellipse cx="100" cy="182" rx="42" ry="18" fill={C} />
      {/* Left leg splayed wide in mount */}
      <ellipse cx="58" cy="218" rx="18" ry="36" transform="rotate(-28 58 218)" fill={C} />
      <ellipse cx="30" cy="254" rx="14" ry="28" transform="rotate(12 30 254)" fill={C} />
      {/* Right leg splayed wide */}
      <ellipse cx="142" cy="218" rx="18" ry="36" transform="rotate(28 142 218)" fill={C} />
      <ellipse cx="170" cy="254" rx="14" ry="28" transform="rotate(-12 170 254)" fill={C} />
      {/* Bottom fighter — flat beneath mount */}
      <ellipse cx="100" cy="288" rx="58" ry="10" fill={C} />
    </svg>
  )
}

/* ── JOHN DANAHER — Standing Instructor (pointing, analytical) ── */
export function DanaherSilhouette() {
  return (
    <svg viewBox="0 0 200 300" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="w-full h-full">
      {/* Head — slightly tilted forward */}
      <circle cx="96" cy="35" r="18" fill={C} />
      {/* Neck */}
      <rect x="88" y="51" width="16" height="15" fill={C} />
      {/* Torso — very upright */}
      <path d="M68 65 L128 65 L124 172 L72 172 Z" fill={C} />
      {/* Left shoulder */}
      <ellipse cx="64" cy="76" rx="14" ry="20" fill={C} />
      {/* Left arm — at side/slightly back */}
      <ellipse cx="54" cy="114" rx="11" ry="40" transform="rotate(6 54 114)" fill={C} />
      <ellipse cx="50" cy="160" rx="10" ry="22" transform="rotate(-4 50 160)" fill={C} />
      {/* Right shoulder — raised for pointing */}
      <ellipse cx="136" cy="68" rx="14" ry="20" fill={C} />
      {/* Right upper arm — extending forward/out */}
      <ellipse cx="152" cy="88" rx="12" ry="36" transform="rotate(-38 152 88)" fill={C} />
      {/* Right forearm pointing */}
      <ellipse cx="174" cy="66" rx="9" ry="28" transform="rotate(-42 174 66)" fill={C} />
      {/* Pointed finger tip */}
      <ellipse cx="190" cy="48" rx="5" ry="12" transform="rotate(-45 190 48)" fill={C} />
      {/* Hips */}
      <ellipse cx="98" cy="175" rx="30" ry="14" fill={C} />
      {/* Left leg — straight */}
      <ellipse cx="84" cy="224" rx="13" ry="46" transform="rotate(-2 84 224)" fill={C} />
      <ellipse cx="81" cy="284" rx="13" ry="16" fill={C} />
      {/* Right leg — slightly forward */}
      <ellipse cx="112" cy="224" rx="13" ry="46" transform="rotate(3 112 224)" fill={C} />
      <ellipse cx="115" cy="284" rx="13" ry="16" fill={C} />
    </svg>
  )
}

/* ── MARCELO GARCIA — Back Take (two-figure, seatbelt grip) ── */
export function MarceloSilhouette() {
  return (
    <svg viewBox="0 0 200 300" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="w-full h-full">
      {/* === Front figure (opponent) === */}
      {/* Front head */}
      <circle cx="98" cy="54" r="19" fill={C} />
      {/* Front neck */}
      <rect x="90" y="71" width="16" height="14" fill={C} />
      {/* Front torso */}
      <path d="M68 84 L128 84 L125 178 L71 178 Z" fill={C} />

      {/* === Marcelo's arms coming from behind — seatbelt/body lock === */}
      {/* Marcelo's left arm — comes from behind left shoulder, wraps forward */}
      <ellipse cx="44" cy="102" rx="15" ry="38" transform="rotate(28 44 102)" fill={C} />
      {/* Left forearm crosses front */}
      <ellipse cx="34" cy="136" rx="12" ry="28" transform="rotate(-14 34 136)" fill={C} />
      {/* Marcelo's right arm — comes from behind right shoulder, over top */}
      <ellipse cx="152" cy="102" rx="15" ry="38" transform="rotate(-28 152 102)" fill={C} />
      {/* Right forearm crosses front */}
      <ellipse cx="164" cy="132" rx="12" ry="28" transform="rotate(14 164 132)" fill={C} />

      {/* === Marcelo himself — visible from behind === */}
      {/* Marcelo's head (peeks from behind, off-center) */}
      <circle cx="116" cy="32" r="15" fill={C} />
      {/* Marcelo's torso (partially hidden) */}
      <ellipse cx="118" cy="108" rx="14" ry="48" transform="rotate(4 118 108)" fill={C} />

      {/* === Front figure legs === */}
      <ellipse cx="80" cy="222" rx="14" ry="42" transform="rotate(-3 80 222)" fill={C} />
      <ellipse cx="76" cy="278" rx="12" ry="18" fill={C} />
      <ellipse cx="116" cy="222" rx="14" ry="42" transform="rotate(3 116 222)" fill={C} />
      <ellipse cx="120" cy="278" rx="12" ry="18" fill={C} />
    </svg>
  )
}

/* ── GORDON RYAN — Heel Hook / Ashi Garami (ground leg control) ── */
export function GordonSilhouette() {
  return (
    <svg viewBox="0 0 200 300" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="w-full h-full">
      {/* Gordon is sitting on his hip, controlling an opponent's leg */}
      {/* Head — upper-left */}
      <circle cx="48" cy="68" r="18" fill={C} />
      {/* Neck */}
      <ellipse cx="62" cy="87" rx="9" ry="13" transform="rotate(-18 62 87)" fill={C} />
      {/* Torso — leaning back on hip, angled */}
      <ellipse cx="94" cy="128" rx="20" ry="50" transform="rotate(-22 94 128)" fill={C} />
      {/* Right arm supporting body */}
      <ellipse cx="138" cy="148" rx="11" ry="38" transform="rotate(42 138 148)" fill={C} />
      <ellipse cx="162" cy="170" rx="9" ry="22" transform="rotate(28 162 170)" fill={C} />
      {/* Left arm gripping opponent's leg */}
      <ellipse cx="58" cy="140" rx="10" ry="34" transform="rotate(-42 58 140)" fill={C} />
      <ellipse cx="38" cy="166" rx="9" ry="22" transform="rotate(-28 38 166)" fill={C} />
      {/* Hips — sideways on ground */}
      <ellipse cx="112" cy="184" rx="36" ry="18" transform="rotate(-12 112 184)" fill={C} />
      {/* Gordon's inside leg — controlling */}
      <ellipse cx="100" cy="234" rx="14" ry="46" transform="rotate(-18 100 234)" fill={C} />
      <ellipse cx="86" cy="282" rx="12" ry="18" transform="rotate(12 86 282)" fill={C} />
      {/* Gordon's outside leg — hooks heel */}
      <ellipse cx="148" cy="228" rx="14" ry="44" transform="rotate(18 148 228)" fill={C} />
      <ellipse cx="166" cy="274" rx="12" ry="18" transform="rotate(-10 166 274)" fill={C} />
      {/* Implied opponent's leg being controlled */}
      <ellipse cx="58" cy="242" rx="11" ry="40" transform="rotate(6 58 242)" fill={C} />
      <ellipse cx="52" cy="286" rx="10" ry="14" fill={C} />
    </svg>
  )
}
