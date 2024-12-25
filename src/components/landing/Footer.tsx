import { Link } from "react-router-dom";

export const Footer = () => {
  return (
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
  );
};