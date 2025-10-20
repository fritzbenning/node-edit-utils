import { ProductCard } from "../../cards/ProductCard";

export function RelatedProducts() {
  return (
    <div className="py-8 lg:py-12 md:py-16 bg-green-100 px-4 md:px-8 lg:px-12">
      <h2 className="font-serif text-3xlmd:text-4xl lg:text-5xl font-light mb-8 md:mb-10 lg:mb-12 text-center">
        Related Products
      </h2>
      <div className="flex gap-6 justify-center flex-wrap lg:flex-nowrap">
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
