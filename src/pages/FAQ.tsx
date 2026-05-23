import Layout from "@/components/Layout";
import FAQSection from "@/components/FAQ";

const FAQPage = () => {
  return (
    <Layout showHeaderBackground>
      <div className="pt-20">
        <FAQSection />
      </div>
    </Layout>
  );
};

export default FAQPage;
