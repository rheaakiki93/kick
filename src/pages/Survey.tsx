import Layout from "@/components/Layout";
import SurveySection from "@/components/Survey";

const SurveyPage = () => {
  return (
    <Layout showHeaderBackground>
      <div className="pt-20">
        <SurveySection />
      </div>
    </Layout>
  );
};

export default SurveyPage;
