"use client";

import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/stores/cart-store";
import { ShoppingCart, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo } from "react";
import { useShallow } from "zustand/shallow";

const freeShippingAmount = 300;

const Cart = () => {
  const {
    items,
    close,
    isOpen,
    syncWithUser,
    setLoading,
    getTotalItems,
    updateQuantity,
    removeItem,
    getTotalPrice,
  } = useCartStore(
    useShallow((state) => ({
      items: state.items,
      close: state.close,
      isOpen: state.isOpen,
      syncWithUser: state.syncWithUser,
      setLoading: state.setLoading,
      getTotalItems: state.getTotalItems,
      updateQuantity: state.updateQuantity,
      removeItem:state.removeItem,
      getTotalPrice:state.getTotalPrice,
    }))
  );
  const totalPrice = getTotalPrice();

  const remainingForFreeShipping = useMemo(() => {
    return Math.max(0,(freeShippingAmount - totalPrice));
  },[totalPrice])

  useEffect(() => {
    const initCart = async () => {
      await useCartStore.persist.rehydrate();
      await syncWithUser();
      setLoading(true);
    };
    initCart();
  }, []);
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity backdrop-blur-sm"
          onClick={close}
        />
      )}
      <div
        className={`fixed right-0 top-0 h-full w-full sm:w-[400px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${isOpen ? " translate-x-0 " : " translate-x-full "}`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b bg-gray-50">
            <div className="flex items-center gap-2">
              <ShoppingCart className="size-5" />
              <h2 className="text-lg font-semibold">Shopping Cart</h2>
              <span className="bg-gray-200 px-2 py-1 rounded-full text-sm font-medium">
                {getTotalItems()}
              </span>
            </div>
            <button
              onClick={close}
              className="p-2 hover:bg-gray-200 rounded-full transition-colors"
            >
              <X className="size-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {items.length === 0 ? (
              <div className="flex flex-col justify-center items-center h-full p-4 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <ShoppingCart className="size-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold">Your cart is empty</h3>
                <p className="text-gray-500 mb-6">
                  Looks like you have not added any items to your cart yet!
                </p>
                <Link
                  href="/"
                  onClick={close}
                  className="bg-black text-white px-6 py-2 rounded-full font-medium hover:bg-gray-900 transition-colors"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="divide-y">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-4 hover:bg-gray-50"
                  >
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border">
                      <Image
                        src={item.image}
                        alt={item.title || "Product Image"}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">
                        {item.title}
                      </h3>
                      <div className="text-sm text-gray-500 mt-1">
                        {formatPrice(item.price)}
                      </div>
                      <div className="flex items-center gap-3 mt-2">
                        <select
                          value={item.quantity}
                          onChange={(e) => {
                            updateQuantity(item.id, Number(e.target.value));
                          }}
                          className="border rounded-md px-2 py-1 text-sm bg-white"
                        >
                          {Array.from({ length: (item.quantity < 10 ? 10 : item.quantity) }).map((_, index) => (
                            <option
                              key={`cart-quantity-option-${index}`}
                              value={index + 1}
                            >
                              {index + 1}
                            </option>
                          ))}
                        </select>
                        <button
                        onClick={() => {removeItem(item.id)}}
                        className="text-red-500 text-sm  hover:text-red-600"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {items.length > 0 && (
            <div className="border-t">
                {remainingForFreeShipping > 0 ? (
                  <div className="p-4 bg-blue-50 border-b">
                      <div className="flex items-center gap-2 text-blue-800 mb-2">
                        <span>🚚</span>
                        <span className="font-medium">Add {formatPrice(remainingForFreeShipping)} more for free shipping</span>
                      </div>
                      <div className="w-full bg-blue-200 rounded-full h-2">
                        <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-100"
                        style={{ width: `${Math.min(100, (totalPrice / freeShippingAmount) * 100)}%` }}
                        />
                      </div>
                  </div>
                ):(
                  <div></div>
                )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;
