import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Briefcase,
  Building2,
  HandshakeIcon,
  Lightbulb,
} from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <Link to="/">
                <img
                  src="/lovable-uploads/df36eb75-8c90-479d-961a-9fa2c1a89be2.png"
                  alt="Logo"
                  className="h-8"
                />
              </Link>
              <div className="hidden md:flex items-center space-x-6">
                <Link to="#about" className="text-gray-600 hover:text-primary flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" />
                  About
                </Link>
                <Link to="#solution" className="text-gray-600 hover:text-primary flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Solution
                </Link>
                <Link to="#documentation" className="text-gray-600 hover:text-primary flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Documentation
                </Link>
                <Link to="#partners" className="text-gray-600 hover:text-primary flex items-center gap-2">
                  <HandshakeIcon className="h-4 w-4" />
                  Partners
                </Link>
                <Link to="#careers" className="text-gray-600 hover:text-primary flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Careers
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/auth">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/auth">
                <Button>Sign Up</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Secure Document Management
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Transform your document workflow with blockchain-powered verification and secure sharing
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/auth">
              <Button size="lg" className="gap-2">
                Get Started
              </Button>
            </Link>
            <Link to="#documentation">
              <Button size="lg" variant="outline" className="gap-2">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content Sections */}
      <section className="py-20 bg-gray-50" id="about">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">About Us</h2>
          {/* Add about content */}
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
                src="/lovable-uploads/df36eb75-8c90-479d-961a-9fa2c1a89be2.png"
                alt="Logo"
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