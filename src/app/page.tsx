import { getCurrentSession } from "@/actions/auth"
import ProductGrid from "@/components/product/ProductGrid";
import SalesCampaignBanner from "@/components/SalesCampaignBanner";
import { getAllProducts } from "@/sanity/lib/client";

const Home = async () => {
  const {user} = await getCurrentSession();
  const products = await getAllProducts();

  return (
    <div>
      <SalesCampaignBanner/>
      <section className="container mx-auto py-8">
      <ProductGrid products={products}/>
      </section>
    </div>
  )
}

export default Home