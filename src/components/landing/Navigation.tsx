import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const Navigation = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.querySelector(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex-shrink-0">
            <img
              src="/lovable-uploads/646ae116-5adf-4c13-ba5d-ecd754fae841.png"
              alt="TruStamp Logo"
              className="h-8"
            />
          </Link>
          <div className="flex-grow flex justify-center">
            <div className="hidden md:flex items-center space-x-8">
              {[
                { id: "#about", text: "ABOUT" },
                { id: "#solution", text: "SOLUTION" },
                { id: "#documentation", text: "DOCUMENTATION" },
                { id: "#partners", text: "PARTNERS" }
              ].map(({ id, text }) => (
                <button
                  key={text}
                  onClick={() => scrollToSection(id)}
                  className="text-black hover:text-primary transition-colors duration-200 font-medium tracking-wider"
                >
                  {text}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/auth">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link to="/auth">
              <Button>Sign Up</Button>
            </Link>
            <Link to="/verify-onchain">
              <Button className="bg-black hover:bg-black/90">Verify</Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};