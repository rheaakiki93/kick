import Layout from "@/components/Layout";
import MarqueeBanner from "@/components/MarqueeBanner";
import Newsletter from "@/components/Newsletter";
import OriginStory from "@/components/OriginStory";
import ProductSpotlight from "@/components/ProductSpotlight";
import WavyDivider from "@/components/WavyDivider";
import BenefitCallouts from "@/components/BenefitCallouts";
import ComparisonTable from "@/components/ComparisonTable";
import SocialGrid from "@/components/SocialGrid";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Index = () => {
  return (
    <Layout>
      <ProductSpotlight />
      <section className="bg-secondary py-3">
        <div className="container mx-auto px-6">
          <Link
            to="/our-story"
            onClick={() => window.scrollTo(0, 0)}
            className="inline-flex items-center gap-2 text-background font-sans font-medium text-sm tracking-[0.2em] uppercase mx-[15px] group"
          >
            Read our story
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
      <MarqueeBanner />
      <OriginStory />
      <WavyDivider className="bg-[#DD6A17] text-background" />
      <BenefitCallouts />
      <ComparisonTable />
      <SocialGrid />
      <Newsletter />
    </Layout>
  );
};

export default Index;