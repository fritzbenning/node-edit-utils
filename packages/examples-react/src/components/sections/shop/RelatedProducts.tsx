import { ProductCard } from "../../cards/ProductCard";

export function RelatedProducts() {
  return (
    <div className="bg-green-100 px-4 py-8 md:px-8 md:py-16 lg:px-12 lg:py-12">
      <h2 className="mb-8 text-center font-light font-serif text-3xlmd:text-4xl md:mb-10 lg:mb-12 lg:text-5xl">Related Products</h2>
      <div className="flex flex-wrap justify-center gap-6 lg:flex-nowrap">
        <ProductCard
          name="Classic Polo"
          price={35}
          rating={5}
          inStock={true}
          image="https://images.unsplash.com/photo-1586790170083-2f9ceadc732d"
        />
        <ProductCard
          name="Casual Hoodie"
          price={45}
          rating={4}
          inStock={true}
          image="https://images.unsplash.com/photo-1556821840-3a63f95609a7"
        />
        <ProductCard
          name="Vintage Jeans"
          price={65}
          rating={4}
          inStock={false}
          image="https://images.unsplash.com/photo-1542272604-787c3835535d"
        />
      </div>
    </div>
  );
}
