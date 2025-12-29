import { useState } from "react";

interface FloraFaunaCardProps {
  scientificName?: string;
  commonName?: string;
  description?: string;
  imageUrl?: string;
  category?: "Flora" | "Fauna";
  conservationStatus?: string;
  onClick?: () => void;
}
export default function FloraFaunaCard({
  scientificName = "Cervus elaphus",
  commonName = "Red Deer",
  description = "The iconic monarch of the glen, roaming the vast peaks and heather-clad moors of the Cairngorms.",
  imageUrl = "https://images.unsplash.com/photo-1549408180-1a2c3a378253?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  category = "Fauna",
  conservationStatus = "Least Concern",
  onClick = () => {},
  ...restProps
}: FloraFaunaCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div
      className={`group relative flex aspect-4/5 w-full max-w-[400px] cursor-pointer flex-col overflow-visible rounded-[8px] border border-[#778DA9]/20 bg-[#E0E1DD] p-6 transition-all duration-700 ease-out hover:border-[#778DA9]`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-node-id="div[0]"
    >
      <div
        className={`pointer-events-none absolute inset-0 rounded-[8px] transition-shadow duration-500 ${isHovered ? "shadow-[0_20px_50px_rgba(27,38,59,0.1)]" : "shadow-none"}`}
        data-node-id="div[0]>div[0]"
      />
      <div className="relative z-10 h-3/5 w-full overflow-hidden rounded-[4px]" data-node-id="div[0]>div[1]">
        <img
          src={imageUrl}
          alt={commonName}
          loading="lazy"
          className={`h-full w-full object-cover transition-transform duration-1000 ease-in-out ${isHovered ? "scale-110" : "scale-100"}`}
          data-node-id="div[0]>div[1]>img[0]"
        />
        <div
          className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-[#415A77]/60 to-transparent"
          data-node-id="div[0]>div[1]>div[1]"
        />
        <div className="absolute top-4 left-4" data-node-id="div[0]>div[1]>div[2]">
          <span
            className="bg-[#1B263B] px-3 py-1 font-sans text-[#E0E1DD] text-[10px] uppercase tracking-[0.2em]"
            data-node-id="div[0]>div[1]>div[2]>span[0]"
          >
            {category}
          </span>
        </div>
      </div>
      <div className="relative z-20 flex-1 pt-6" data-node-id="div[0]>div[2]">
        <h2
          className={`-mt-10 mb-2 transform font-serif text-[#1B263B] text-[42px] leading-[0.9] transition-transform duration-500 ease-out ${isHovered ? "-translate-x-2" : "translate-x-0"}`}
          style={{
            fontFamily: "Playfair Display, serif",
          }}
          data-node-id="div[0]>div[2]>h2[0]"
        >
          {commonName}
        </h2>

        <p
          className="mb-4 font-sans text-[#415A77] text-sm italic tracking-wide"
          style={{
            fontFamily: "Montserrat, sans-serif",
          }}
          data-node-id="div[0]>div[2]>p[1]"
        >
          {scientificName}
        </p>

        <p
          className={`mb-6 font-sans text-[#1B263B]/80 text-[13px] leading-relaxed transition-all duration-500 ${isHovered ? "translate-y-0 opacity-100" : "translate-y-1 opacity-70"}`}
          style={{
            fontFamily: "Montserrat, sans-serif",
          }}
          data-node-id="div[0]>div[2]>p[2]"
        >
          {description}
        </p>
        <div className="mt-auto flex items-center justify-between border-[#778DA9]/30 border-t pt-4" data-node-id="div[0]>div[2]>div[3]">
          <div className="flex flex-col" data-node-id="div[0]>div[2]>div[3]>div[0]">
            <span className="mb-1 text-[#778DA9] text-[10px] uppercase tracking-widest" data-node-id="div[0]>div[2]>div[3]>div[0]>span[0]">
              Status
            </span>
            <span
              className="font-bold text-[#1B263B] text-[11px] uppercase tracking-tighter"
              data-node-id="div[0]>div[2]>div[3]>div[0]>span[1]"
            >
              {conservationStatus}
            </span>
          </div>

          <button
            className={`group/btn flex items-center gap-2 transition-colors duration-300 ${isHovered ? "text-[#1B263B]" : "text-[#415A77]"}`}
            data-node-id="div[0]>div[2]>div[3]>button[1]"
            type="button"
          >
            <span
              className="font-sans font-semibold text-[11px] text-inherit uppercase tracking-[0.15em]"
              data-node-id="div[0]>div[2]>div[3]>button[1]>span[0]"
            >
              Discover
            </span>
            <svg
              className={`h-4 w-4 transition-transform duration-300 ${isHovered ? "translate-x-1" : "translate-x-0"}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              data-node-id="div[0]>div[2]>div[3]>button[1]>svg[1]"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
                data-node-id="div[0]>div[2]>div[3]>button[1]>svg[1]>path[0]"
              />
            </svg>
          </button>
        </div>
      </div>
      <div
        className={`pointer-events-none absolute right-0 bottom-0 h-32 w-32 rounded-tl-full bg-[#415A77]/5 blur-2xl transition-opacity duration-700 ${isHovered ? "opacity-100" : "opacity-0"}`}
        data-node-id="div[0]>div[3]"
      />
    </div>
  );
}
