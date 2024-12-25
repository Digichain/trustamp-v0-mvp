import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 px-4 bg-background">
      <div className="container mx-auto text-center relative z-10">
        <img
          src="/lovable-uploads/646ae116-5adf-4c13-ba5d-ecd754fae841.png"
          alt="TruStamp Logo"
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
            <Button size="lg" className="gap-2">
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