import { useEffect, useState } from "react";
import Button from "./Button";
export default function Navigation({
  logoTitle = "The Wild Highlands",
  primaryLink = "Conservation",
  secondaryLink = "Map",
  tertiaryLink = "Visit",
  scrollThreshold = 50,
}: {
  logoTitle?: string;
  primaryLink?: string;
  secondaryLink?: string;
  tertiaryLink?: string;
  scrollThreshold?: number;
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > scrollThreshold);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollThreshold]);
  return (
    <nav
      className={`fixed top-0 left-0 z-50 flex h-[80px] w-full items-center justify-between border-b px-8 transition-all duration-500 ease-in-out ${isScrolled ? "border-[#778DA9]/30 bg-[#1B263B]/85 shadow-xl backdrop-blur-md" : "border-transparent bg-transparent"}`}
      data-node-id="nav[0]"
    >
      {}
      <div className="flex flex-1 items-center" data-node-id="nav[0]>div[0]">
        <button
          className="group flex cursor-pointer flex-col gap-1.5 focus:outline-none"
          aria-label="Open elements menu"
          data-node-id="nav[0]>div[0]>button[0]"
          type="button"
        >
          <span
            className={`h-px w-6 transition-all duration-300 ${isScrolled ? "bg-[#E0E1DD]" : "bg-[#E0E1DD]"}`}
            data-node-id="nav[0]>div[0]>button[0]>span[0]"
          ></span>
          <span
            className="h-px w-4 bg-[#E0E1DD] transition-all duration-300 group-hover:w-6"
            data-node-id="nav[0]>div[0]>button[0]>span[1]"
          ></span>
          <span
            className="mt-1 font-['Montserrat'] text-[#E0E1DD] text-[10px] uppercase tracking-[0.2em] opacity-70 transition-opacity group-hover:opacity-100"
            data-node-id="nav[0]>div[0]>button[0]>span[2]"
          >
            The Elements
          </span>
        </button>
      </div>

      {}
      <div className="flex-none" data-node-id="nav[0]>div[1]">
        <h1
          className={`font-['Playfair_Display'] @md/viewport:text-3xl text-2xl text-[#E0E1DD] tracking-wide transition-transform duration-700 ${isScrolled ? "scale-95" : "scale-100"}`}
          data-node-id="nav[0]>div[1]>h1[0]"
        >
          {logoTitle}
        </h1>
      </div>

      {}
      <div className="flex flex-1 items-center justify-end gap-10" data-node-id="nav[0]>div[2]">
        <ul className="@md/viewport:flex hidden items-center gap-8" data-node-id="nav[0]>div[2]>ul[0]">
          <li data-node-id="nav[0]>div[2]>ul[0]>li[0]">
            <a
              href="/"
              className="hover:-translate-y-0.5 font-['Montserrat'] text-[#E0E1DD] text-[12px] uppercase tracking-[0.15em] opacity-70 transition-all duration-300 ease-out hover:opacity-100"
              data-node-id="nav[0]>div[2]>ul[0]>li[0]>a[0]"
            >
              {primaryLink}
            </a>
          </li>
          <li data-node-id="nav[0]>div[2]>ul[0]>li[1]">
            <a
              href="/"
              className="hover:-translate-y-0.5 font-['Montserrat'] text-[#E0E1DD] text-[12px] uppercase tracking-[0.15em] opacity-70 transition-all duration-300 ease-out hover:opacity-100"
              data-node-id="nav[0]>div[2]>ul[0]>li[1]>a[0]"
            >
              {secondaryLink}
            </a>
          </li>
        </ul>

        <div className="flex items-center" data-node-id="nav[0]>div[2]>div[1]">
          <Button
            variant="secondary"
            className={`border px-6 py-2 font-['Montserrat'] text-[11px] uppercase tracking-[0.2em] transition-all duration-500 ${isScrolled ? "border-[#778DA9] text-[#E0E1DD] hover:bg-[#415A77]" : "border-[#E0E1DD]/40 text-[#E0E1DD] hover:bg-[#E0E1DD] hover:text-[#1B263B]"}`}
            data-node-id="nav[0]>div[2]>div[1]>Button[0]"
            data-instance="true"
            data-instance-name="Button"
          >
            {tertiaryLink}
          </Button>
        </div>
      </div>

      {}
      <div
        className={`absolute bottom-0 left-0 h-px w-full bg-linear-to-r from-transparent via-[#778DA9]/40 to-transparent transition-opacity duration-700 ${isScrolled ? "opacity-100" : "opacity-0"}`}
        data-node-id="nav[0]>div[3]"
      />
    </nav>
  );
}
