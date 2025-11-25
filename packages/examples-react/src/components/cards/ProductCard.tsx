import { StarIcon } from "@heroicons/react/24/solid";
import { Button } from "../actions/Button";

interface ProductCardProps {
  name: string;
  price: number;
  rating: number;
  inStock: boolean;
  image?: string;
}

export function ProductCard({
  name = "'Heaven on Earth' Shirt",
  price = 24,
  rating,
  inStock,
  image = "https://images.unsplash.com/photo-1622351772377-c3dda74beb03",
  ...restProps
}: ProductCardProps) {
  const newLocal = "font-light text-3xl";
  return (
    <div
      className="overflow-hidden rounded-xl bg-white font-display shadow-lg transition-shadow duration-300 hover:shadow-xl"
      {...restProps}
    >
      <div className="aspect-4/3 max-h-100 w-full object-cover">
        <img src={image} alt="product shot" className="h-full w-full object-cover" />
      </div>
      <div className="flex flex-col gap-3 p-6">
        <div className="flex items-center justify-between font-serif">
          <h2 className={newLocal}>{name}</h2>
          <p className={`text-3xl text-gray-700 ${price < 3 && "text-red-500"}`}>{price} €</p>
        </div>
        <div className="mb-2 flex items-center">
          {[...Array(5)].map((_, i) => (
            <StarIcon key={`star-${i}`} className={`h-5 w-5 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
          ))}
        </div>
        <div>
          <div data-instance="test">Test</div>
          <Button className="w-full" disabled={!inStock} data-instance="true">
            <span className="text-xs">Test</span>
          </Button>
          <Button className="w-full" disabled={!inStock} data-instance="true">
            <span className="text-xs">{inStock ? "Add to Cart" : "Out of Stock"}</span>
          </Button>
          <Button className="w-full" disabled={!inStock} data-instance="true">
            <span className="text-xs">{inStock ? "Add to Cart" : "Out of Stock"}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
