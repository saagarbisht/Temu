"use client";
import Link from "next/link";
import { Menu, Search, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { User } from "@prisma/client";
import { logoutUser } from "@/actions/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import HeaderSearchBox from "./HeaderSearchBox";
import { useCartStore } from "@/stores/cart-store";
import { useShallow } from "zustand/shallow";

type HeaderProps = {
  user: Omit<User, "passwordHash"> | null;
  categorySelector: React.ReactNode;
};

const AnnouncementBar = () => {
  return (
    <div className="w-full bg-gradient-to-r from-red-600 via-orange-500 to-red-600 py-2">
      <div className="container mx-auto flex items-center justify-center px-8">
        <span className="text-center text-sm font-medium tracking-wide text-white">
          FREE SHIPPING ON ORDERS OVER Rs. 300 FREE RETURNS
        </span>
      </div>
    </div>
  );
};

const Header = ({ user, categorySelector }: HeaderProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [prevScrollY, setPrevScrollY] = useState<number>(0);
  const { open, getTotalItems } = useCartStore(
    useShallow((state) => ({
      open: state.open,
      getTotalItems: state.getTotalItems,
    }))
  );

  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrolledUp = currentScrollY < prevScrollY;

      if (scrolledUp) {
        setIsOpen(true);
      } else if (currentScrollY > 100) {
        setIsOpen(false);
      }

      setPrevScrollY(currentScrollY);
    };
    setPrevScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollY]);
  return (
    <header className="w-full sticky top-0 z-50">
      <div
        className={`w-full transform transition-transform duration-300 ease-in-out ${
          isOpen ? " translate-y-0 " : " -translate-y-full "
        }`}
      >
        <AnnouncementBar />
        <div className="w-full justify-between items-center py-3 sm:py-4 bg-white/80 shadow-sm border-b border-gray-100 backdrop-blur-sm">
          <div className="flex justify-between items-center container mx-auto px-8">
            <div className="flex flex-1 justify-start items-center gap-4 sm:gap-6">
              <button className="text-gray-700 hover:text-gray-600 md:hidden">
                <Menu className="size-5 sm:size-6 " strokeWidth={3} />
              </button>
              <nav className="hidden md:flex gap-4 lg:gap-6 text-sm font-medium">
                <Link href="/">Shop</Link>
                {categorySelector}
              </nav>
            </div>
            <Link href="/" className="absolute left-1/2 -translate-x-">
              <span className="text-xl sm:text-2xl font-bold tracking-tight bg-gradient-to-r from-red-500 to-orange-500 inline-block text-transparent bg-clip-text">
                DEAL
              </span>
            </Link>
            <div className="flex flex-1 justify-end items-center gap-2 sm:gap-4">
              <HeaderSearchBox />
              {user ? (
                <>
                  <div className="flex items-center gap-2 sm:gap-4">
                    <span className="text-sm text-gray-700 hidden md:block">
                      {user.email}
                    </span>
                    <Link
                      href="#"
                      className="text-xs sm:text-sm font-medium text-gray-700 hover:text-gray-900"
                      onClick={async (e) => {
                        e.preventDefault();
                        await logoutUser();
                        toast.success("logged out", { duration: 2000 });
                        router.refresh();
                      }}
                    >
                      Sign Out
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/sign-in"
                    className="text-xs sm:text-sm font-medium text-gray-700 hover:text-gray-900"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/sign-up"
                    className="text-xs sm:text-sm font-medium text-gray-700 hover:text-gray-900"
                  >
                    Sign Up
                  </Link>
                </>
              )}
              <button
                onClick={() => {
                  open();
                }}
                className="relative text-gray-700 hover:text-gray-900"
              >
                <ShoppingBag className="size-5 sm:size-6 " strokeWidth={2} />
                <span className="absolute -top-1 -right-1 bg-black text-white h-3.5 w-3.5 sm:w-4 sm:h-4 text-[10px] sm:text-sm rounded-full flex items-center justify-center">
                  {getTotalItems()}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
