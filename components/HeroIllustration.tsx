import Image from "next/image";

export function HeroIllustration() {
  return (
    <div className="hero-illustration">
      <Image
        src="/hero-tools.jpg"
        alt=""
        aria-hidden="true"
        width={220}
        height={294}
        priority
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          mixBlendMode: "screen",
          opacity: 0.28,
        }}
      />
    </div>
  );
}

function _OldSvgIllustration() {
  return (
    <svg
      viewBox="0 0 420 520"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ width: "100%", height: "100%" }}
    >
      {/* Testera — pozadina, široka */}
      <g transform="translate(210, 340) rotate(-5)"
         stroke="rgba(249,115,22,0.18)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="-155" y="-20" width="275" height="40" rx="4"/>
        {/* Pistol grip */}
        <path d="M 118 20 C 130 28 148 26 154 12 L 154 -12 C 148 -26 130 -28 118 -20"/>
        {/* Zubi */}
        <path d="M -155 20 L -140 34 L -125 20 L -110 34 L -95 20 L -80 34 L -65 20 L -50 34 L -35 20 L -20 34 L -5 20 L 10 34 L 25 20 L 40 34 L 55 20 L 70 34 L 85 20 L 100 34 L 118 20"/>
      </g>

      {/* Odvijač — gornji levi, nagnut */}
      <g transform="translate(88, 148) rotate(36)"
         stroke="rgba(249,115,22,0.28)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {/* Drška */}
        <rect x="-12" y="-88" width="24" height="66" rx="10"/>
        {/* Linija na dršci */}
        <line x1="0" y1="-88" x2="0" y2="-60"/>
        {/* Osovina */}
        <rect x="-4" y="-22" width="8" height="138" rx="2"/>
        {/* Vrh — flat head */}
        <path d="M -10 116 L 10 116"/>
      </g>

      {/* Ključ — desno, blago nagnut */}
      <g transform="translate(348, 192) rotate(-6)"
         stroke="rgba(249,115,22,0.38)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {/* Drška */}
        <rect x="-7" y="22" width="14" height="172" rx="5"/>
        {/* Otvorena vilica */}
        <path d="M -7 22 C -7 2 -34 -12 -26 -56 C -18 -94 18 -94 26 -56 C 34 -12 7 2 7 22"/>
        {/* Linija razmaka vilice */}
        <line x1="-26" y1="-32" x2="26" y2="-32"/>
      </g>

      {/* Čekić — centralni, dominantan */}
      <g transform="translate(192, 248) rotate(-17)"
         stroke="rgba(249,115,22,0.55)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {/* Drška */}
        <rect x="-6" y="-18" width="12" height="162" rx="4"/>
        {/* Glava */}
        <rect x="-40" y="-70" width="80" height="54" rx="6"/>
        {/* Linija na glavi */}
        <line x1="-40" y1="-44" x2="40" y2="-44"/>
        {/* Tekstura drške */}
        <line x1="-5" y1="35" x2="5" y2="35"/>
        <line x1="-5" y1="55" x2="5" y2="55"/>
        <line x1="-5" y1="75" x2="5" y2="75"/>
        <line x1="-5" y1="95" x2="5" y2="95"/>
        <line x1="-5" y1="115" x2="5" y2="115"/>
      </g>

      {/* Libela — dno, skoro horizontalna */}
      <g transform="translate(210, 474) rotate(2)"
         stroke="rgba(249,115,22,0.22)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {/* Telo */}
        <rect x="-162" y="-14" width="324" height="28" rx="4"/>
        {/* Mjehurica — cev */}
        <rect x="-46" y="-8" width="92" height="16" rx="6"/>
        {/* Mjehurica — krug */}
        <circle cx="0" cy="0" r="5"/>
        {/* Krajnji zarezi */}
        <line x1="-144" y1="-14" x2="-144" y2="14"/>
        <line x1="144" y1="-14" x2="144" y2="14"/>
      </g>

      {/* Ekser — mali detalj */}
      <g transform="translate(308, 430) rotate(72)"
         stroke="rgba(249,115,22,0.2)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="-9" y="-10" width="18" height="14" rx="2"/>
        <line x1="0" y1="4" x2="0" y2="58"/>
        <path d="M -4 52 L 0 62 L 4 52"/>
      </g>

      {/* Rolna trake — mali detalj, gornji desni */}
      <g transform="translate(368, 108) rotate(-10)"
         stroke="rgba(249,115,22,0.18)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="-26" y="-22" width="52" height="44" rx="9"/>
        {/* Traka */}
        <path d="M -26 -5 L -38 -5 L -38 5 L -26 5"/>
        {/* Dugme */}
        <circle cx="14" cy="-10" r="5"/>
        {/* Logo krug */}
        <circle cx="-4" cy="4" r="8"/>
      </g>
    </svg>
  );
}
