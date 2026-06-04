import Hero from "./home/_components/Hero.tsx";
import CategoryGrid from "./home/_components/CategoryGrid.tsx";
import NewProducts from "./home/_components/NewProducts.tsx";
import BestSellers from "./home/_components/BestSellers.tsx";
import AboutBlock from "./home/_components/AboutBlock.tsx";

export default function Index() {
  return (
    <div>
      <Hero />
      <div className="mx-8 h-px bg-gradient-to-r from-transparent via-pink-200 to-transparent" />
      <CategoryGrid />
      <div className="mx-8 h-px bg-gradient-to-r from-transparent via-pink-100 to-transparent" />
      <NewProducts />
      <div className="mx-8 h-px bg-gradient-to-r from-transparent via-pink-100 to-transparent" />
      <BestSellers />
      <div className="mx-8 h-px bg-gradient-to-r from-transparent via-pink-100 to-transparent" />
      <AboutBlock />
    </div>
  );
}
