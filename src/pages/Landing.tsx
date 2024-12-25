import { Navigation } from "@/components/landing/Navigation";
import { Hero } from "@/components/landing/Hero";
import { FeatureCards } from "@/components/landing/FeatureCards";
import { About } from "@/components/landing/About";
import { Solution } from "@/components/landing/Solution";
import { Partners } from "@/components/landing/Partners";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Mail, Download } from "lucide-react";

const Landing = () => {
  const documents = [
    {
      name: "TruStamp Slide Deck",
      type: "Presentation",
      icon: <FileText className="h-6 w-6" />,
      description: "Overview of TruStamp's platform and capabilities"
    },
    {
      name: "TruStamp White Paper",
      type: "Document",
      icon: <FileText className="h-6 w-6" />,
      description: "Technical deep-dive into our technology and approach"
    },
    {
      name: "TruStamp Solution Proposal",
      type: "Document",
      icon: <FileText className="h-6 w-6" />,
      description: "Detailed solution architecture and implementation"
    },
    {
      name: "Use Cases Snapshot",
      type: "Document",
      icon: <FileText className="h-6 w-6" />,
      description: "Real-world applications and success stories"
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <Hero />
      <FeatureCards />
      <About />
      <Solution />
      <Partners />
      
      {/* Documentation Section */}
      <section className="py-20 bg-gray-50" id="documentation">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 tracking-tight">
            Documentation
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {documents.map((doc) => (
              <Card 
                key={doc.name}
                className="group hover:shadow-lg transition-shadow duration-200"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="p-3 bg-primary/10 rounded-full">
                      {doc.icon}
                    </div>
                    <h3 className="font-semibold text-lg">{doc.name}</h3>
                    <p className="text-sm text-muted-foreground">{doc.description}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button
              onClick={() => window.location.href = 'mailto:contact@trustamp.in'}
              className="inline-flex items-center gap-2"
              size="lg"
            >
              <Mail className="h-4 w-4" />
              Request More Information
            </Button>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Landing;