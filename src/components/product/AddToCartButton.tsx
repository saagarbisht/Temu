"use client";
import { formatPrice } from "@/lib/utils";
import { Product } from "@/sanity.types";
import { urlFor } from "@/sanity/lib/image";
import { useCartStore } from "@/stores/cart-store";
import { Loader2, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useShallow } from "zustand/shallow";

type AddToCartButtonProps = {
  product: Product;
};
const AddToCartButton = ({ product }: AddToCartButtonProps) => {
  const { addItem, open } = useCartStore(
    useShallow((state) => ({ addItem: state.addItem, open: state.open }))
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleAddToCart = async () => {
    if(!product.title || product.price === undefined || !product.image) return;
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      addItem({
        id:product._id,
        title:product.title,
        price:product.price,
        image:urlFor(product.image).url(),
        quantity:1,
      })
    } catch (error) {
      toast.error('Server Error. Please try again')
    } finally {
      setIsLoading(false);
      open();
    }
  };
  if (!product.price) {
    return <></>;
  }
  return (
    <button
      onClick={handleAddToCart}
      disabled={isLoading}
      className={`w-full mt-6 bg-gradient-to-r from-red-500 to bg-red-600 text-white py-4 rounded-full font-bold text-xl hover:from-red-600 hover:to-red-700 transition-all transform hover:scale-[1.02] active:scale-[1.02] shadow-xl flex items-center justify-center gap-3 disabled:opacity-80 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:active:scale-100 disabled:hover:from-red-500 disabled:hover:to-red-600`}
    >
      {isLoading ? (
        <>
          <Loader2 className="size-6 animate-spin" />
          <span>Adding to Cart...</span>
        </>
      ) : (
        <>
          <ShoppingCart className="size-6" />
          <span>Add to Cart - {formatPrice(product.price)}</span>
        </>
      )}
    </button>
  );
};

export default AddToCartButton;
