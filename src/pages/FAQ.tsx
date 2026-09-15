import Layout from "@/components/Layout";
import FAQSection from "@/components/FAQ";
import SEO from "@/components/SEO";

const FAQPage = () => {
  return (
    <Layout showHeaderBackground>
      <SEO
        title="FAQ | Kick by Kicklab"
        description="Answers to common questions about Kick's cold-pressed ginger shots — ingredients, taste, and the best time of day to drink one."
        path="/faq"
      />
      <div className="pt-20">
        <FAQSection />
      </div>
    </Layout>
  );
};

export default FAQPage;
