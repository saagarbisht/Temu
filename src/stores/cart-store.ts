import { getOrCreateCart, syncCartWithUser, updateCartItems } from "@/actions/cart";
import { create } from "zustand";
import { persist } from "zustand/middleware";
export type CartItem = {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
};

type CartStore = {
  items: CartItem[];
  isLoading: boolean;
  isOpen: boolean;
  cartId: string | null;
  setStore: (store: Partial<CartStore>) => void;
  addItem: (item: CartItem) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => void;
  open: () => void;
  close: () => void;
  setLoading: (loading: boolean) => void;
  syncWithUser: () => Promise<void>;
  getTotalItems: () => number;
  getTotalPrice: () => number;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      isLoading: false,
      cartId: null,

      setStore: (store) => set(store),

      addItem: async ({ id, title, price, image, quantity }) => {
        const { cartId,items } = get();
        if (!cartId) return;

        const existingItem = items.find(item => item.id === id);
        const existingQuantity = existingItem ? existingItem.quantity : 0;
        const addedItemQuantity = existingQuantity + quantity;

        const updateCart = await updateCartItems(cartId, id, {
          title,
          price,
          image,
          quantity:addedItemQuantity,
        });

        set((state) => {
          const existingItem = state.items.find((item) => id === item.id);
          if (existingItem) {
            return {
              ...state,
              cartId: updateCart.id,
              items: state.items.map((product) =>
                product.id === id
                  ? { ...product, quantity: product.quantity + quantity }
                  : product
              ),
            };
          }
          return {
            ...state,
            cartId: updateCart.id,
            items: [...state.items, { id, title, quantity:addedItemQuantity, image, price }],
          };
        });
      },

      removeItem: async (id) => {
        const { cartId } = get();
        if (!cartId) return;

        const updateCart = await updateCartItems(cartId, id,{quantity:0});

        set((state) => {
          return {
            ...state,
            cartId: updateCart.id,
            items:state.items.filter(item => item.id !== id),
          };
        });
      },

      updateQuantity: async (id, quantity) => {
        const { cartId } = get();
        if (!cartId) return;

        const updateCart = await updateCartItems(cartId, id,{quantity});

        set((state) => {
          return {
            ...state,
            cartId: updateCart.id,
            items:state.items.map(item => item.id === id ? {...item,quantity} : item),
          };
        });
      },

      syncWithUser: async () => {
        const {cartId} = get();
        if(!cartId) {
          const cart = await getOrCreateCart();
          set((state) => ({...state,cartId:cart.id,items:cart.items}));
        }
        const syncCart = await syncCartWithUser(cartId);
        if(syncCart){
          set((state) => ({...state,cartId:syncCart.id,items:syncCart.items}));
        }
      },

      clearCart: () => {
        set((state) => ({ ...state, items: [] }));
      },

      open: () => {
        set((state) => ({ ...state, isOpen: true }));
      },

      close: () => {
        set((state) => ({ ...state, isOpen: false }));
      },

      setLoading: (loaded) => {
        set((state) => ({ ...state, isLoading: loaded }));
      },

      getTotalItems: () => {
        const { items } = get();
        return items.length;
      },

      getTotalPrice: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
    }),
    {
      name:"cart-storage",
      skipHydration:true,
    }
  )
);
