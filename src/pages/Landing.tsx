import { Navigation } from "@/components/landing/Navigation";
import { Hero } from "@/components/landing/Hero";
import { FeatureCards } from "@/components/landing/FeatureCards";
import { About } from "@/components/landing/About";
import { Solution } from "@/components/landing/Solution";
import { Partners } from "@/components/landing/Partners";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Mail, Download } from "lucide-react";

const Landing = () => {
  const documents = [
    {
      name: "TruStamp Slide Deck",
      type: "Presentation",
      icon: <FileText className="h-4 w-4" />,
    },
    {
      name: "TruStamp White Paper",
      type: "Document",
      icon: <FileText className="h-4 w-4" />,
    },
    {
      name: "TruStamp Solution Proposal",
      type: "Document",
      icon: <FileText className="h-4 w-4" />,
    },
    {
      name: "Use Cases Snapshot",
      type: "Document",
      icon: <FileText className="h-4 w-4" />,
    },
  ];

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
          
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Document Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="w-20"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((doc) => (
                  <TableRow key={doc.name} className="hover:bg-gray-50">
                    <TableCell>{doc.icon}</TableCell>
                    <TableCell className="font-medium">{doc.name}</TableCell>
                    <TableCell>{doc.type}</TableCell>
                    <TableCell>
                      <Download className="h-4 w-4 text-gray-500 hover:text-gray-700 cursor-pointer" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-8 text-center">
            <Button
              onClick={() => window.location.href = 'mailto:contact@trustamp.in'}
              className="inline-flex items-center gap-2"
            >
              <Mail className="h-4 w-4" />
              Request More Information
            </Button>
          </div>
        </div>
      </section>

      <Partners />
      <Footer />
    </div>
  );
};

export default Landing;