import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
  showHeaderBackground?: boolean;
}

const Layout = ({ children, showHeaderBackground = false }: LayoutProps) => {
  return (
    <div className="min-h-screen">
      {/* Header background for non-hero pages */}
      {showHeaderBackground && (
        <div className="fixed top-0 left-0 right-0 h-24 bg-secondary z-40" />
      )}
      <Header />
      <main>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
