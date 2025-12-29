import BaseToken from "./BaseToken";

interface FooterProps {
  ecoImpactValue?: string;
  pageWeight?: string;
  navGroups?: Array<{
    title: string;
    links: Array<{
      label: string;
      href: string;
    }>;
  }>;
  partnerLogos?: Array<{
    name: string;
    url: string;
  }>;
  showConservationBadge?: boolean;
}
const Footer = ({
  ecoImpactValue = "0.02g CO2e",
  pageWeight = "1.2 MB",
  navGroups = [
    {
      title: "Discover",
      links: [
        {
          label: "Highland Flora",
          href: "#",
        },
        {
          label: "Conservation efforts",
          href: "#",
        },
        {
          label: "The Cairngorms",
          href: "#",
        },
      ],
    },
    {
      title: "Legals",
      links: [
        {
          label: "Privacy Policy",
          href: "#",
        },
        {
          label: "Eco-Manifesto",
          href: "#",
        },
        {
          label: "Cookie Settings",
          href: "#",
        },
      ],
    },
  ],
  partnerLogos = [
    {
      name: "NatureScot",
      url: "#",
    },
    {
      name: "Rewilding Britain",
      url: "#",
    },
  ],
  showConservationBadge = true,
}: FooterProps) => {
  const currentYear = new Date().getFullYear();
  return (
    <footer
      className="relative w-full overflow-hidden bg-[#1B263B] px-6 @md/viewport:py-[120px] py-20 font-['Montserrat'] text-[#E0E1DD]"
      data-node-id="footer[0]"
    >
      {}
      <div
        className="pointer-events-none absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/moss.png')] opacity-2"
        data-node-id="footer[0]>div[0]"
      />

      <div className="relative z-10 mx-auto max-w-7xl" data-node-id="footer[0]>div[1]">
        {}
        <div
          className="flex @md/viewport:flex-row flex-col items-start @md/viewport:items-center justify-between gap-8 border-[#778DA9]/30 border-b pb-12"
          data-node-id="footer[0]>div[1]>div[0]"
        >
          <div className="flex flex-col gap-2" data-node-id="footer[0]>div[1]>div[0]>div[0]">
            <span className="text-[#778DA9] text-[10px] uppercase tracking-[0.2em]" data-node-id="footer[0]>div[1]>div[0]>div[0]>span[0]">
              Digital Footprint
            </span>
            <div className="flex gap-8" data-node-id="footer[0]>div[1]>div[0]>div[0]>div[1]">
              <div className="flex flex-col" data-node-id="footer[0]>div[1]>div[0]>div[0]>div[1]>div[0]">
                <span className="font-light text-sm" data-node-id="footer[0]>div[1]>div[0]>div[0]>div[1]>div[0]>span[0]">
                  Page Weight
                </span>
                <span className="font-medium text-[#415A77] text-xl" data-node-id="footer[0]>div[1]>div[0]>div[0]>div[1]>div[0]>span[1]">
                  {pageWeight}
                </span>
              </div>
              <div className="flex flex-col" data-node-id="footer[0]>div[1]>div[0]>div[0]>div[1]>div[1]">
                <span className="font-light text-sm" data-node-id="footer[0]>div[1]>div[0]>div[0]>div[1]>div[1]>span[0]">
                  Carbon Est.
                </span>
                <span className="font-medium text-[#415A77] text-xl" data-node-id="footer[0]>div[1]>div[0]>div[0]>div[1]>div[1]>span[1]">
                  {ecoImpactValue}
                </span>
              </div>
            </div>
          </div>
          {showConservationBadge && (
            <div className="group flex cursor-default items-center gap-4" data-node-id="footer[0]>div[1]>div[0]>div[1]">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-full border border-[#415A77] p-2 transition-colors duration-500 group-hover:bg-[#415A77]/10"
                data-node-id="footer[0]>div[1]>div[0]>div[1]>div[0]"
              >
                <BaseToken
                  data-node-id="footer[0]>div[1]>div[0]>div[1]>div[0]>BaseToken[0]"
                  data-instance="true"
                  data-instance-name="BaseToken"
                />
              </div>
              <p className="max-w-[180px] text-[#778DA9] text-xs italic leading-relaxed" data-node-id="footer[0]>div[1]>div[0]>div[1]>p[1]">
                Committed to WCAG 2.1 AA and low-carbon web standards.
              </p>
            </div>
          )}
        </div>

        {}
        <div className="grid @md/viewport:grid-cols-12 grid-cols-1 gap-12 py-20" data-node-id="footer[0]>div[1]>div[1]">
          <div className="@md/viewport:col-span-5" data-node-id="footer[0]>div[1]>div[1]>div[0]">
            <h2
              className="mb-6 font-['Playfair_Display'] @md/viewport:text-5xl text-4xl"
              data-node-id="footer[0]>div[1]>div[1]>div[0]>h2[0]"
            >
              The Wild
              <br data-node-id="footer[0]>div[1]>div[1]>div[0]>h2[0]>br[0]" />
              Highlands
            </h2>
            <p className="max-w-sm text-sm leading-loose opacity-70" data-node-id="footer[0]>div[1]>div[1]>div[0]>p[1]">
              Preserving the rugged majesty of Scotland's natural heritage through immersive storytelling and conscious digital design.
            </p>
          </div>

          <div
            className="@md/viewport:col-span-7 grid @lg/viewport:grid-cols-3 grid-cols-2 gap-8"
            data-node-id="footer[0]>div[1]>div[1]>div[1]"
          >
            {navGroups.map((group, idx) => (
              <div
                key={group.title}
                className={`flex flex-col gap-6 ${idx === 1 ? "@md/viewport:mt-0 mt-8" : ""}`}
                data-node-id="footer[0]>div[1]>div[1]>div[1]>div[0]"
              >
                <h3
                  className="border-[#778DA9]/20 border-b pb-2 font-['Playfair_Display'] text-lg"
                  data-node-id="footer[0]>div[1]>div[1]>div[1]>div[0]>h3[0]"
                >
                  {group.title}
                </h3>
                <nav className="flex flex-col gap-4" data-node-id="footer[0]>div[1]>div[1]>div[1]>div[0]>nav[1]">
                  {group.links.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      className="font-light text-sm tracking-wide transition-colors duration-500 hover:text-white"
                      data-node-id="footer[0]>div[1]>div[1]>div[1]>div[0]>nav[1]>a[0]"
                    >
                      {link.label}
                    </a>
                  ))}
                </nav>
              </div>
            ))}

            <div className="@lg/viewport:col-span-1 col-span-2 flex flex-col gap-6" data-node-id="footer[0]>div[1]>div[1]>div[1]>div[1]">
              <h3
                className="border-[#778DA9]/20 border-b pb-2 font-['Playfair_Display'] text-lg"
                data-node-id="footer[0]>div[1]>div[1]>div[1]>div[1]>h3[0]"
              >
                Partners
              </h3>
              <div
                className="flex flex-wrap gap-4 opacity-50 grayscale transition-all duration-700 hover:grayscale-0"
                data-node-id="footer[0]>div[1]>div[1]>div[1]>div[1]>div[1]"
              >
                {partnerLogos.map((logo) => (
                  <a
                    key={logo.name}
                    href={logo.url}
                    className="border border-[#778DA9] px-3 py-1 text-[10px] uppercase tracking-widest transition-colors hover:border-[#E0E1DD]"
                    data-node-id="footer[0]>div[1]>div[1]>div[1]>div[1]>div[1]>a[0]"
                  >
                    {logo.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {}
        <div
          className="flex @md/viewport:flex-row flex-col items-center justify-between gap-4 border-[#778DA9]/30 border-t pt-8"
          data-node-id="footer[0]>div[1]>div[2]"
        >
          <p className="text-[#778DA9] text-[10px] uppercase tracking-widest" data-node-id="footer[0]>div[1]>div[2]>p[0]">
            © {currentYear} The Wild Highlands Digital Experience
          </p>
          <div className="flex gap-6" data-node-id="footer[0]>div[1]>div[2]>div[1]">
            <span className="text-[#415A77] text-[10px] tracking-widest" data-node-id="footer[0]>div[1]>div[2]>div[1]>span[0]">
              SCOTLAND
            </span>
            <span className="text-[#415A77] text-[10px] tracking-widest" data-node-id="footer[0]>div[1]>div[2]>div[1]>span[1]">
              57.1485° N, 4.6439° W
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
