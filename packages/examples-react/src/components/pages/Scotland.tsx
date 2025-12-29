import Button from "../scotland/Button";
import FloraFaunaCard from "../scotland/FloraFaunaCard";
import Footer from "../scotland/Footer";
import HeroVideoHeader from "../scotland/HeroVideoTeaser";
import ImageGallerySection from "../scotland/ImageGallerySection";
import Navigation from "../scotland/Navigation";

interface ScotlandProps {
  title?: string;
  subtitle?: string;
  introText?: string;
  floraFaunaData?: Array<{
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    category: "flora" | "fauna";
  }>;
}
const Scotland = ({
  title = "The Wild Highlands",
  subtitle = "A Sanctuary of Ancient Beauty",
  introText = "Venture into the raw, untamed heart of Scotland. From the mist-shrouded peaks of the Cairngorms to the deep, silent waters of our lochs, the Highlands offer a landscape of storytelling, resilience, and breathtaking biodiversity. We invite you to explore the delicate balance of life in one of Europe's last true wildernesses.",
  floraFaunaData = [
    {
      id: "1",
      title: "The Red Deer",
      description: "The iconic monarch of the glen, roaming the vast open moors and mountain sides.",
      imageUrl: "https://images.unsplash.com/photo-1528650057134-97216a69894e?auto=format&fit=crop&w=800&q=80",
      category: "fauna",
    },
    {
      id: "2",
      title: "Scots Pine",
      description: "The backbone of the Caledonian Forest, these ancient trees support a unique ecosystem.",
      imageUrl: "https://images.unsplash.com/photo-1510672981848-a1c4f1cb5ccf?auto=format&fit=crop&w=800&q=80",
      category: "flora",
    },
    {
      id: "3",
      title: "Golden Eagle",
      description: "A master of the thermal currents, soaring above the rugged ridges of the west coast.",
      imageUrl: "https://images.unsplash.com/photo-1548202970-076135804561?auto=format&fit=crop&w=800&q=80",
      category: "fauna",
    },
  ],
}: ScotlandProps) => {
  return (
    <div
      className="min-h-screen bg-[#E0E1DD] font-['Montserrat'] text-[#1B263B] selection:bg-[#415A77] selection:text-white"
      data-node-id="div[0]"
    >
      <Navigation data-node-id="div[0]>Navigation[0]" data-instance="true" data-instance-name="Navigation" />

      <main data-node-id="div[0]>main[1]">
        {}
        <section className="relative" data-node-id="div[0]>main[1]>section[0]">
          <HeroVideoHeader
            videoSrc="https://player.vimeo.com/external/370371454.sd.mp4?s=49c258d4f40a4630737a076a4a49c4a52011740d&profile_id=164&oauth2_token_id=57447761"
            headline={title}
            subheadline={subtitle}
            data-node-id="div[0]>main[1]>section[0]>HeroVideoHeader[0]"
            data-instance="true"
            data-instance-name="HeroVideoHeader"
          />
        </section>

        {}
        <section
          className="mx-auto flex max-w-7xl flex-col items-center px-6 @md/viewport:py-56 py-40 text-center"
          data-node-id="div[0]>main[1]>section[1]"
        >
          <span
            className="mb-6 font-semibold text-[#415A77] text-sm uppercase tracking-[0.2em]"
            data-node-id="div[0]>main[1]>section[1]>span[0]"
          >
            Our Heritage
          </span>
          <h2
            className="mb-12 font-['Playfair_Display'] @md/viewport:text-8xl text-5xl leading-tight"
            data-node-id="div[0]>main[1]>section[1]>h2[1]"
          >
            Where Mist Meets <br data-node-id="div[0]>main[1]>section[1]>h2[1]>br[0]" />
            <span className="italic" data-node-id="div[0]>main[1]>section[1]>h2[1]>span[1]">
              Ancient Stone
            </span>
          </h2>
          <p
            className="mb-12 max-w-2xl font-light @md/viewport:text-xl text-[#415A77] text-lg leading-relaxed"
            data-node-id="div[0]>main[1]>section[1]>p[2]"
          >
            {introText}
          </p>
          <Button data-node-id="div[0]>main[1]>section[1]>Button[3]" data-instance="true" data-instance-name="Button" fullWidth={false}>
            This is nice!
          </Button>
        </section>

        {}
        <section className="mx-auto max-w-7xl px-6 pb-48" data-node-id="div[0]>main[1]>section[2]">
          <div className="mb-24 flex items-end justify-between" data-node-id="div[0]>main[1]>section[2]>div[0]">
            <div data-node-id="div[0]>main[1]>section[2]>div[0]>div[0]">
              <h3
                className="mb-4 font-['Playfair_Display'] @md/viewport:text-6xl text-4xl"
                data-node-id="div[0]>main[1]>section[2]>div[0]>div[0]>h3[0]"
              >
                Biodiversity
              </h3>
              <p className="text-[#778DA9] text-sm uppercase tracking-widest" data-node-id="div[0]>main[1]>section[2]>div[0]>div[0]>p[1]">
                Life within the Highlands
              </p>
            </div>
          </div>

          <div className="grid @md/viewport:grid-cols-12 grid-cols-1 items-start gap-12" data-node-id="div[0]>main[1]>section[2]>div[1]">
            {floraFaunaData.map((item, index) => (
              <div
                key={item.id}
                className={`
                  ${index === 0 ? "@md/viewport:col-span-7" : ""}
                  ${index === 1 ? "@md/viewport:col-span-5 @md/viewport:mt-32" : ""}
                  ${index === 2 ? "@md/viewport:-mt-24 @md/viewport:col-span-6 @md/viewport:ml-12" : ""}
                `}
                data-node-id="div[0]>main[1]>section[2]>div[1]>div[0]"
              >
                <FloraFaunaCard
                  commonName={item.title}
                  description={item.description}
                  imageUrl={item.imageUrl}
                  category={item.category === "flora" ? "Flora" : "Fauna"}
                  data-node-id="div[0]>main[1]>section[2]>div[1]>div[0]>FloraFaunaCard[0]"
                  data-instance="true"
                  data-instance-name="FloraFaunaCard"
                />
              </div>
            ))}
          </div>
        </section>

        {}
        <section className="mb-48 bg-[#1B263B] @md/viewport:py-48 py-32" data-node-id="div[0]>main[1]>section[3]">
          <div className="mx-auto mb-16 max-w-7xl px-6" data-node-id="div[0]>main[1]>section[3]>div[0]">
            <h2
              className="mb-4 font-['Playfair_Display'] @md/viewport:text-7xl text-5xl text-white"
              data-node-id="div[0]>main[1]>section[3]>div[0]>h2[0]"
            >
              The Gallery
            </h2>
            <div className="h-1 w-24 bg-[#778DA9]" data-node-id="div[0]>main[1]>section[3]>div[0]>div[1]"></div>
          </div>
          <ImageGallerySection
            data-node-id="div[0]>main[1]>section[3]>ImageGallerySection[1]"
            data-instance="true"
            data-instance-name="ImageGallerySection"
          />
        </section>

        {}
        <section className="mx-auto mb-48 max-w-4xl px-6 text-center" data-node-id="div[0]>main[1]>section[4]">
          <h2 className="mb-8 font-['Playfair_Display'] @md/viewport:text-6xl text-4xl" data-node-id="div[0]>main[1]>section[4]>h2[0]">
            Ready to Preserve?
          </h2>
          <p className="mb-12 text-[#415A77] text-lg" data-node-id="div[0]>main[1]>section[4]>p[1]">
            Every step you take through these glens is a step through history. Join our efforts in mapping and protecting these vital
            ecosystems for generations to come.
          </p>
          <button
            className="rounded-sm bg-[#1B263B] px-12 py-5 text-[#E0E1DD] text-sm uppercase tracking-widest transition-colors duration-500 hover:bg-[#415A77]"
            type="button"
            data-node-id="div[0]>main[1]>section[4]>button[2]"
          >
            View Conservation Map
          </button>
        </section>
      </main>

      <Footer data-node-id="div[0]>Footer[2]" data-instance="true" data-instance-name="Footer" />
    </div>
  );
};
export default Scotland;
