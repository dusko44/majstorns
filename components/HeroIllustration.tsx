import Image from "next/image";

export function HeroIllustration() {
  return (
    <div className="hero-illustration">
      <Image
        src="/hero-tools-3.jpg"
        alt=""
        aria-hidden="true"
        width={220}
        height={220}
        priority
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          filter: "invert(1) hue-rotate(180deg)",
          mixBlendMode: "screen",
          opacity: 0.45,
        }}
      />
    </div>
  );
}
