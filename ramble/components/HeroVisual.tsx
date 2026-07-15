import Image from "next/image";

export default function HeroVisual() {
  return (
    <div className="hero-shell fade-up aspect-[5/4] sm:aspect-[2.05/1]">
      <Image
        src="/hero-bg.jpg"
        alt=""
        fill
        priority
        className="object-cover"
        sizes="(max-width: 1200px) 100vw, 1120px"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#04102b]/60 via-transparent to-[#0b3d91]/20" />

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 pb-16 sm:gap-7 sm:pb-24">
        <div className="relative">
          <span className="listen-pulse" aria-hidden />
          <span className="listen-pulse" aria-hidden />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-[0_30px_80px_rgba(2,10,30,0.5)] sm:h-36 sm:w-36">
            <Image
              src="/logo.png"
              alt="Ramble logo"
              width={128}
              height={128}
              className="h-[76px] w-[76px] object-contain sm:h-[116px] sm:w-[116px]"
              priority
              unoptimized
            />
          </div>
        </div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/80">
          Hold to listen
        </p>
      </div>
    </div>
  );
}
