import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 px-4 overflow-hidden">
      {/* Dynamic background with gradient animation */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-100 animate-gradient-x"></div>
      
      {/* Animated shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/4 w-1/2 h-1/2 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute -bottom-1/2 -right-1/4 w-1/2 h-1/2 bg-gradient-to-br from-indigo-400/20 to-blue-500/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
      </div>

      <div className="container mx-auto text-center relative z-10">
        <img
          src="/lovable-uploads/332db982-2d48-46a4-8185-5f16eafbf9b5.png"
          alt="Logo"
          className="w-64 mx-auto mb-12"
        />
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          Unlock Trust and Transparency with Blockchain-Powered Solutions
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Transform your document workflow with blockchain-powered verification and secure sharing
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/auth">
            <Button size="lg" className="gap-2 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90">
              Get Started
            </Button>
          </Link>
          <Link to="#documentation">
            <Button size="lg" variant="outline" className="gap-2 border-2">
              Learn More
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};