import Image from "next/image";

export function HeroIllustration() {
  return (
    <div className="hero-illustration" style={{ overflow: "hidden" }}>
      <Image
        src="/hero-tools-2.jpg"
        alt=""
        aria-hidden="true"
        width={220}
        height={294}
        priority
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          mixBlendMode: "screen",
          opacity: 0.32,
          transform: "scale(1.18)",
        }}
      />
    </div>
  );
}
