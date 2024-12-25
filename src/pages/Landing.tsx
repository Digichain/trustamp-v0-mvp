import { Navigation } from "@/components/landing/Navigation";
import { Hero } from "@/components/landing/Hero";
import { FeatureCards } from "@/components/landing/FeatureCards";
import { About } from "@/components/landing/About";
import { Solution } from "@/components/landing/Solution";
import { Partners } from "@/components/landing/Partners";
import { Footer } from "@/components/landing/Footer";

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <Hero />
      <FeatureCards />
      <About />
      <Solution />
      
      {/* Documentation Section */}
      <section className="py-20 bg-gray-50" id="documentation">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 tracking-tight">
            Documentation
          </h2>
          {/* Add documentation content */}
        </div>
      </section>

      <Partners />
      <Footer />
    </div>
  );
};

export default Landing;
