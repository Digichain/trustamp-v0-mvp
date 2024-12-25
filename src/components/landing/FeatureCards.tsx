import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const FeatureCards = () => {
  const features = [
    {
      title: "Smart Document Creation",
      description: "Create and manage digital documents with blockchain-backed security and authenticity",
      imagePath: "/lovable-uploads/0eeaddc3-20bd-4a8f-90f7-7850f9122bc4.png"
    },
    {
      title: "Document Verification",
      description: "Instantly verify document authenticity using blockchain technology",
      imagePath: "/lovable-uploads/b89f2486-94a2-4566-966c-5fa336c6e971.png"
    },
    {
      title: "Instant Settlements",
      description: "Streamline payments and settlements with secure blockchain transactions",
      imagePath: "/lovable-uploads/0d20854b-1212-4f30-a7c6-acc4b63adc49.png"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature) => (
            <Card key={feature.title} className="text-center bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 min-h-[400px]">
              <CardHeader>
                <div className="w-full h-56 mb-4 overflow-hidden rounded-t-lg">
                  <img
                    src={feature.imagePath}
                    alt={feature.title}
                    className="w-full h-full object-contain p-2"
                  />
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Vision Statement Section */}
      <div className="mt-20 bg-gray-900 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center max-w-4xl mx-auto leading-tight">
            <span className="block mb-2">Set to become</span>
            <span className="text-blue-400">Innovation leaders</span>
            <span className="block mt-2">for Global Trade and Supply Chain</span>
            <span className="block mt-2 text-2xl md:text-3xl text-gray-300">through digital transformation</span>
          </h2>
        </div>
      </div>
    </section>
  );
};