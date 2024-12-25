import { Navigation } from "@/components/landing/Navigation";
import { Hero } from "@/components/landing/Hero";
import { FeatureCards } from "@/components/landing/FeatureCards";
import { Link } from "react-router-dom";
import { CheckCircle2, Trophy } from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <Hero />
      <FeatureCards />
      
      {/* About Section */}
      <section className="py-20 bg-gray-50" id="about">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 tracking-tight">
            About <span className="text-primary">Us</span>
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="text-lg text-gray-700 leading-relaxed">
                In an increasingly digital world, ensuring the authenticity and integrity of information is crucial. 
                <span className="font-medium text-primary"> TruStamp </span> 
                offers a cutting-edge, blockchain-based solution designed to address critical challenges in global trade and supply chain digitization. It provides instant, escrow-based payments, including liquidity optimization.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                TruStamp's innovative approach ensures traceability, transparency, and automation for trade settlements. By leveraging 
                <span className="font-medium"> blockchain technology, smart contracts, and tokenization</span>, 
                the platform optimizes working capital, enables safe and efficient end-to-end transactions, and supports document verification, identity validation, and robust security.
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

      {/* Solution Section */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50" id="solution">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 tracking-tight">
            Our <span className="text-primary">Solution</span>
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start max-w-7xl mx-auto">
            <div className="space-y-8">
              <div>
                <h3 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent leading-tight">
                  A Complete End to End Solution
                </h3>
                <div className="flex items-center gap-2 text-xl text-gray-600 mb-4">
                  <Trophy className="h-6 w-6 text-yellow-500" />
                  <p className="leading-relaxed">
                    Finalists of the Singapore Fintech Festival 2024
                  </p>
                </div>
              </div>
              <div className="hidden lg:block">
                <img 
                  src="/lovable-uploads/3252abbb-cf47-4c25-9740-92b6ae23d542.png" 
                  alt="Singapore Fintech Festival 2024" 
                  className="w-full max-w-lg mx-auto"
                />
              </div>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <h4 className="text-2xl font-semibold mb-8 text-gray-900">Key Features</h4>
              <div className="space-y-6">
                {[
                  "Tamper-Proof Verification: Ensures documents and digital assets are immutable and authentic.",
                  "Real-Time Authentication: Provides instant validation of information and transactions.",
                  "Blockchain Integration: Utilizes blockchain technology for secure and transparent record-keeping.",
                  "User-Friendly Interface: Simplifies the process of verifying and managing digital assets.",
                  "Customizable Solutions: Tailors verification processes to meet specific business or personal needs.",
                  "Seamless Integration: Easily integrates with existing systems and applications for enhanced functionality.",
                  "Instant Settlement: Settle the payments instantly through our powerful Escrow Smart Contract System.",
                  "Liquidity: Option to Settle the payments through Trade Finance or Supply Chain Finance leveraging Asset Tokenisation."
                ].map((feature, index) => (
                  <div key={index} className="flex items-start gap-4 group">
                    <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1 group-hover:scale-110 transition-transform duration-200" />
                    <div>
                      <p className="text-gray-800">
                        <span className="font-medium">{feature.split(":")[0]}:</span>
                        {feature.split(":")[1]}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Documentation Section */}
      <section className="py-20 bg-gray-50" id="documentation">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 tracking-tight">
            Documentation
          </h2>
          {/* Add documentation content */}
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-20" id="partners">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 tracking-tight">
            Our <span className="text-primary">Partners</span>
          </h2>
          {/* Add partners content */}
        </div>
      </section>

      {/* Careers Section */}
      <section className="py-20 bg-gray-50" id="careers">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 tracking-tight">
            Careers
          </h2>
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
              <h3 className="font-semibold mb-4 text-lg">Company</h3>
              <ul className="space-y-2">
                <li><Link to="#about" className="text-gray-400 hover:text-white transition-colors">About</Link></li>
                <li><Link to="#careers" className="text-gray-400 hover:text-white transition-colors">Careers</Link></li>
                <li><Link to="#partners" className="text-gray-400 hover:text-white transition-colors">Partners</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-lg">Resources</h3>
              <ul className="space-y-2">
                <li><Link to="#documentation" className="text-gray-400 hover:text-white transition-colors">Documentation</Link></li>
                <li><Link to="#" className="text-gray-400 hover:text-white transition-colors">API Reference</Link></li>
                <li><Link to="#" className="text-gray-400 hover:text-white transition-colors">Support</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-lg">Legal</h3>
              <ul className="space-y-2">
                <li><Link to="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link to="#" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</Link></li>
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