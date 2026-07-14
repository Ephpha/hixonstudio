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
          <div className="relative flex h-28 w-28 items-center justify-center sm:h-32 sm:w-32">
            <Image
              src="/logo.png"
              alt="Ramble logo"
              width={128}
              height={128}
              className="h-[112px] w-[112px] object-contain drop-shadow-[0_2px_6px_rgba(4,18,51,0.45)] [filter:drop-shadow(0_22px_44px_rgba(4,18,51,0.5))] sm:h-[128px] sm:w-[128px]"
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
