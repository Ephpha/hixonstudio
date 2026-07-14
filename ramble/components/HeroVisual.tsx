import Image from "next/image";

export default function HeroVisual() {
  return (
    <div className="hero-shell fade-up aspect-[16/9] sm:aspect-[2.05/1]">
      <Image
        src="/hero-texture.jpg"
        alt=""
        fill
        priority
        className="object-cover"
        sizes="(max-width: 1200px) 100vw, 1120px"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#061433]/55 via-transparent to-[#0b3d91]/15" />

      <div className="absolute inset-0 flex items-center justify-center pb-10 sm:pb-14">
        <div className="relative">
          <span className="listen-pulse" aria-hidden />
          <span className="listen-pulse" aria-hidden />
          <div className="relative flex h-24 w-24 items-center justify-center sm:h-28 sm:w-28">
            <Image
              src="/logo.png"
              alt="Ramble logo"
              width={96}
              height={96}
              className="h-[84px] w-[84px] object-contain drop-shadow-[0_18px_40px_rgba(0,0,0,0.35)] sm:h-[96px] sm:w-[96px]"
              priority
              unoptimized
            />
          </div>
        </div>
      </div>

      <div className="absolute bottom-[4.25rem] left-1/2 z-10 w-full -translate-x-1/2 px-4 text-center sm:bottom-[5.25rem]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/75">
          Hold to listen
        </p>
      </div>
    </div>
  );
}
