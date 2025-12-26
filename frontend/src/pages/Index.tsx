import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Mission from "@/components/landing/Mission";
import Features from "@/components/landing/Features";
import Examples from "@/components/landing/Examples";
import FAQ from "@/components/landing/FAQ";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Mission />
      <Features />
      <Examples />
      <FAQ />
      <Footer />
    </main>
  );
};

export default Index;
