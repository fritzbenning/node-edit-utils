import { Button } from "../actions/Button";
import { StarIcon } from "@heroicons/react/24/solid";

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
}: ProductCardProps) {
  return (
    <div className="font-display rounded-xl shadow-lg bg-white hover:shadow-xl overflow-hidden transition-shadow duration-300">
      <div className="aspect-4/3 object-cover max-h-100 w-full">
        <img src={image} alt="image" className="w-full h-full object-cover" />
      </div>
      <div className="p-6 flex flex-col gap-3">
        <div className="flex justify-between items-center font-serif">
          <h2 className="font-light text-3xl">{name}</h2>
          <p
            className={`text-gray-700 text-3xl ${price < 3 && "text-red-500"}`}
          >
            {price} €
          </p>
        </div>
        <div className="flex items-center mb-2">
          {[...Array(5)].map((_, i) => (
            <StarIcon
              key={i}
              className={`w-5 h-5 ${
                i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
              }`}
            />
          ))}
        </div>
        <Button className="w-full" disabled={!inStock}>
          {inStock ? "Add to Cart" : "Out of Stock"}
        </Button>
      </div>
    </div>
  );
}
