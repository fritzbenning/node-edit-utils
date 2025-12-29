const ImageGallerySection = () => {
  return (
    <div className="mx-auto max-w-7xl px-6" data-node-id="div[0]">
      <div className="grid @md/viewport:grid-cols-3 grid-cols-1 gap-4">
        <div className="aspect-square overflow-hidden rounded-sm bg-[#415A77]/20" data-node-id="div[0]>div[0]>div[0]">
          <div className="h-full w-full bg-gradient-to-br from-[#1B263B] to-[#415A77]" />
        </div>
        <div className="aspect-square overflow-hidden rounded-sm bg-[#415A77]/20" data-node-id="div[0]>div[0]>div[1]">
          <div className="h-full w-full bg-gradient-to-br from-[#415A77] to-[#778DA9]" />
        </div>
        <div className="aspect-square overflow-hidden rounded-sm bg-[#415A77]/20" data-node-id="div[0]>div[0]>div[2]">
          <div className="h-full w-full bg-gradient-to-br from-[#778DA9] to-[#E0E1DD]" />
        </div>
      </div>
    </div>
  );
};

export default ImageGallerySection;

