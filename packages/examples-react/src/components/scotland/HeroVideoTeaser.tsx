import { useEffect, useRef, useState } from "react";
import Button from "./Button";

interface HeroVideoHeaderProps {
  videoSrc?: string;
  posterSrc?: string;
  headline?: string;
  subheadline?: string;
  ctaText?: string;
  onCtaClick?: () => void;
  locationCoords?: string;
  autoPlay?: boolean;
}
export default function HeroVideoHeader({
  videoSrc = "https://player.vimeo.com/external/494252666.hd.mp4?s=2f5c70eb35a6ed62409545084918e7d2287a9163&profile_id=175",
  posterSrc = "https://images.unsplash.com/photo-1506377585622-bedcbb027afc?auto=format&fit=crop&q=80&w=2000",
  headline = "The Untamed Spirit of the Highlands",
  subheadline = "Experience the raw, rugged beauty of the Scottish peaks and the mystical stillness of the lochs.",
  ctaText = "Explore the Wild!",
  onCtaClick = () => {},
  locationCoords = "57.1497° N, 4.1826° W",
  autoPlay = true,
}: HeroVideoHeaderProps) {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(() => setIsPlaying(false));
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying]);
  const togglePlay = () => setIsPlaying(!isPlaying);
  return (
    <section className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-[#415A77]" data-node-id="section[0]">
      {}
      <video
        ref={videoRef}
        poster={posterSrc}
        className="absolute inset-0 h-full w-full object-cover"
        muted
        loop
        playsInline
        data-node-id="section[0]>video[0]"
      >
        <source src={videoSrc} type="video/mp4" data-node-id="section[0]>video[0]>source[0]" />
      </video>

      {}
      <div
        className="pointer-events-none absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] opacity-[0.03]"
        data-node-id="section[0]>div[1]"
      />

      {}
      <div
        className="absolute inset-0 bg-linear-to-b from-[#1B263B]/30 via-[#1B263B]/50 to-[#1B263B]/70"
        data-node-id="section[0]>div[2]"
      />

      {}
      <div
        className="container relative z-10 mx-auto flex flex-col @md/viewport:items-start items-center @lg/viewport:px-20 px-6 @md/viewport:text-left text-center"
        data-node-id="section[0]>div[3]"
      >
        {}
        <span
          className="mb-6 inline-block font-['Montserrat'] font-light text-[#E0E1DD] text-[12px] uppercase tracking-[0.3em]"
          data-node-id="section[0]>div[3]>span[0]"
        >
          {locationCoords}
        </span>

        {}
        <h1
          className="mb-8 max-w-4xl font-['Playfair_Display'] @lg/viewport:text-8xl @md/viewport:text-7xl text-5xl text-[#E0E1DD] leading-[1.1] transition-transform duration-1000"
          data-node-id="section[0]>div[3]>h1[1]"
        >
          {headline}
        </h1>

        {}
        <p
          className="mb-12 max-w-xl font-['Montserrat'] font-light @md/viewport:text-xl text-[#E0E1DD]/90 text-lg leading-relaxed"
          data-node-id="section[0]>div[3]>p[2]"
        >
          {subheadline}
        </p>

        {}
        <div className="flex @sm/viewport:flex-row flex-col items-center gap-6" data-node-id="section[0]>div[3]>div[3]">
          <Button
            className="transform border-none bg-[#1B263B] px-10 py-5 font-['Montserrat'] text-[#E0E1DD] text-sm uppercase tracking-widest transition-all duration-300 hover:translate-y-[-2px] hover:bg-[#1B263B]/90 hover:shadow-2xl"
            data-node-id="section[0]>div[3]>div[3]>Button[0]"
            data-instance="true"
            data-instance-name="Button"
            variant="primary"
            fullWidth={false}
            onClick={onCtaClick}
          >
            {ctaText}
          </Button>

          {}
          <button
            type="button"
            aria-label={isPlaying ? "Pause background video" : "Play background video"}
            className="flex items-center gap-3 border-[#E0E1DD]/30 border-b py-2 font-['Montserrat'] text-[#E0E1DD] text-xs uppercase tracking-widest transition-colors hover:border-[#E0E1DD]"
            data-node-id="section[0]>div[3]>div[3]>button[1]"
            onClick={togglePlay}
          >
            <span
              className={`h-2 w-2 rounded-full ${isPlaying ? "animate-pulse bg-green-400" : "bg-red-400"}`}
              data-node-id="section[0]>div[3]>div[3]>button[1]>span[0]"
            />
            {isPlaying ? "Motion Active" : "Motion Paused"}
          </button>
        </div>
      </div>

      {}
      <div
        className="absolute bottom-0 left-0 h-px w-full bg-linear-to-r from-transparent via-[#778DA9]/40 to-transparent"
        data-node-id="section[0]>div[4]"
      />

      {}
      <div
        className="-translate-x-1/2 absolute bottom-10 left-1/2 flex flex-col items-center gap-2 opacity-60"
        data-node-id="section[0]>div[5]"
      >
        <span
          className="font-['Montserrat'] text-[#E0E1DD] text-[10px] uppercase tracking-[0.4em]"
          data-node-id="section[0]>div[5]>span[0]"
        >
          Scroll
        </span>
        <div className="h-12 w-px bg-linear-to-b from-[#E0E1DD] to-transparent" data-node-id="section[0]>div[5]>div[1]" />
      </div>
    </section>
  );
}
