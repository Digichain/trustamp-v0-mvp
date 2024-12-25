import { Navigation } from "@/components/landing/Navigation";
import { Hero } from "@/components/landing/Hero";
import { FeatureCards } from "@/components/landing/FeatureCards";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <Hero />
      <FeatureCards />
      
      {/* About Section */}
      <section className="py-20 bg-gray-50" id="about">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">About Us</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="text-gray-700 leading-relaxed">
                In an increasingly digital world, ensuring the authenticity and integrity of information is crucial. TruStamp offers a cutting-edge, blockchain-based solution designed to address critical challenges in global trade and supply chain digitization. It provides instant, escrow-based payments, including liquidity optimization.
              </p>
              <p className="text-gray-700 leading-relaxed">
                TruStamp's innovative approach ensures traceability, transparency, and automation for trade settlements. By leveraging blockchain technology, smart contracts, and tokenization, the platform optimizes working capital, enables safe and efficient end-to-end transactions, and supports document verification, identity validation, and robust security.
              </p>
            </div>
            <div className="aspect-video rounded-lg overflow-hidden shadow-lg">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/wlPMbgsmNBs"
                title="TruStamp Introduction"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20" id="solution">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Solution</h2>
          {/* Add solution content */}
        </div>
      </section>

      <section className="py-20 bg-gray-50" id="documentation">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Documentation</h2>
          {/* Add documentation content */}
        </div>
      </section>

      <section className="py-20" id="partners">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Partners</h2>
          {/* Add partners content */}
        </div>
      </section>

      <section className="py-20 bg-gray-50" id="careers">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Careers</h2>
          {/* Add careers content */}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <img
                src="/lovable-uploads/646ae116-5adf-4c13-ba5d-ecd754fae841.png"
                alt="TruStamp Logo"
                className="h-8 brightness-0 invert mb-4"
              />
              <p className="text-gray-400">
                Transforming document management with blockchain technology
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link to="#about" className="text-gray-400 hover:text-white">About</Link></li>
                <li><Link to="#careers" className="text-gray-400 hover:text-white">Careers</Link></li>
                <li><Link to="#partners" className="text-gray-400 hover:text-white">Partners</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Link to="#documentation" className="text-gray-400 hover:text-white">Documentation</Link></li>
                <li><Link to="#" className="text-gray-400 hover:text-white">API Reference</Link></li>
                <li><Link to="#" className="text-gray-400 hover:text-white">Support</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link to="#" className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
                <li><Link to="#" className="text-gray-400 hover:text-white">Terms of Service</Link></li>
                <li><Link to="#" className="text-gray-400 hover:text-white">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>© 2025 Powered by DigiChain Innovations. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
