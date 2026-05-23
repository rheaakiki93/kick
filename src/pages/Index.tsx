import Layout from "@/components/Layout";
import Hero from "@/components/Hero";
import MarqueeBanner from "@/components/MarqueeBanner";
import Ingredients from "@/components/Ingredients";
import Benefits from "@/components/Benefits";
import Newsletter from "@/components/Newsletter";
import TypewriterTagline from "@/components/TypewriterTagline";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Index = () => {
  return (
    <Layout>
      <TypewriterTagline />
      <Hero />
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
      <Benefits />
      <Ingredients />
      <Newsletter />
    </Layout>
  );
};

export default Index;