import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const FeatureCards = () => {
  const features = [
    {
      title: "Smart Document Creation",
      description: "Create and manage digital documents with blockchain-backed security and authenticity",
      imagePath: "/placeholder.svg" // Replace with actual image path
    },
    {
      title: "Document Verification",
      description: "Instantly verify document authenticity using blockchain technology",
      imagePath: "/placeholder.svg" // Replace with actual image path
    },
    {
      title: "Instant Settlements",
      description: "Streamline payments and settlements with secure blockchain transactions",
      imagePath: "/placeholder.svg" // Replace with actual image path
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature) => (
            <Card key={feature.title} className="text-center bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="w-full h-48 mb-4 overflow-hidden rounded-t-lg">
                  <img
                    src={feature.imagePath}
                    alt={feature.title}
                    className="w-full h-full object-cover"
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
      <div className="mt-20 bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold max-w-4xl mx-auto leading-tight">
            Set to become Innovation leaders for Global Trade and Supply Chain through digital transformation
          </h2>
        </div>
      </div>

      {/* Partner Logos Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center gap-12">
            {/* Replace with actual partner logos */}
            <div className="w-40 h-20 bg-gray-200 rounded flex items-center justify-center">
              Digital Economy Council
            </div>
            <div className="w-40 h-20 bg-gray-200 rounded flex items-center justify-center">
              Austrade
            </div>
            <div className="w-40 h-20 bg-gray-200 rounded flex items-center justify-center">
              Novatti
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};