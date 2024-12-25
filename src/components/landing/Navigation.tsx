import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Lightbulb, Building2, BookOpen, HandshakeIcon, Briefcase } from "lucide-react";

export const Navigation = () => {
  return (
    <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex-shrink-0">
            <img
              src="/lovable-uploads/df36eb75-8c90-479d-961a-9fa2c1a89be2.png"
              alt="Logo"
              className="h-8"
            />
          </Link>
          <div className="flex-grow flex justify-center">
            <div className="hidden md:flex items-center space-x-8">
              {[
                { to: "#about", icon: <Lightbulb className="h-4 w-4" />, text: "ABOUT" },
                { to: "#solution", icon: <Building2 className="h-4 w-4" />, text: "SOLUTION" },
                { to: "#documentation", icon: <BookOpen className="h-4 w-4" />, text: "DOCUMENTATION" },
                { to: "#partners", icon: <HandshakeIcon className="h-4 w-4" />, text: "PARTNERS" },
                { to: "#careers", icon: <Briefcase className="h-4 w-4" />, text: "CAREERS" }
              ].map(({ to, icon, text }) => (
                <Link
                  key={text}
                  to={to}
                  className="text-gray-600 hover:text-primary transition-colors duration-200 font-medium tracking-wider flex items-center gap-2"
                >
                  {icon}
                  <span>{text}</span>
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/auth">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link to="/auth">
              <Button className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90">Sign Up</Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};