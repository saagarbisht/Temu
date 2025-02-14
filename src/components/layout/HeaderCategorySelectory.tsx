import { getAllCategories } from "@/sanity/lib/client";
import { ChevronDown } from "lucide-react";
import Link from "next/link";

const HeaderCategorySelectory = async () => {
  const categories = await getAllCategories();
  return (
    <div className="relative inline-block">
      <button className="peer group text-gray-700 hover:text-gray-900 text-sm font-medium flex items-center">
        Categories
        <ChevronDown className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
      </button>
      <div className="absolute top-full left-0 pt-2 opacity-0 invisible peer-hover:opacity-100 peer-hover:visible hover:opacity-100 hover:visible transition-all duration-200">
        <div className="w-64 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden">
          <div className="py-2">
            {categories.map((category) => (
              <Link
                href={`/category/${category.slug?.current}`}
                key={category._id}
                className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-100"
                prefetch
              >{category.title}</Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderCategorySelectory;
