import { CheckCircle2, Trophy } from "lucide-react";

export const Solution = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50" id="solution">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-16 tracking-tight">
          Our <span className="text-primary">Solution</span>
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start max-w-7xl mx-auto">
          <div className="space-y-8">
            <div className="space-y-6">
              <h3 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent leading-tight">
                A Complete End to End Solution for Supply Chain and Trade Lifecycle
              </h3>
              <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <Trophy className="h-8 w-8 text-yellow-500 flex-shrink-0" />
                <p className="text-xl font-semibold text-gray-800">
                  Finalists of the Singapore Fintech Festival 2024
                </p>
              </div>
            </div>
            <div className="hidden lg:block">
              <img 
                src="/lovable-uploads/3252abbb-cf47-4c25-9740-92b6ae23d542.png" 
                alt="Singapore Fintech Festival 2024" 
                className="w-full max-w-lg mx-auto"
              />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <h4 className="text-2xl font-semibold mb-8 text-gray-900">Key Features</h4>
            <div className="space-y-6">
              {[
                "Tamper-Proof Verification: Ensures documents and digital assets are immutable and authentic.",
                "Real-Time Authentication: Provides instant validation of information and transactions.",
                "Blockchain Integration: Utilizes blockchain technology for secure and transparent record-keeping.",
                "User-Friendly Interface: Simplifies the process of verifying and managing digital assets.",
                "Customizable Solutions: Tailors verification processes to meet specific business or personal needs.",
                "Seamless Integration: Easily integrates with existing systems and applications for enhanced functionality.",
                "Instant Settlement: Settle the payments instantly through our powerful Escrow Smart Contract System.",
                "Liquidity: Option to Settle the payments through Trade Finance or Supply Chain Finance leveraging Asset Tokenisation."
              ].map((feature, index) => (
                <div key={index} className="flex items-start gap-4 group">
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1 group-hover:scale-110 transition-transform duration-200" />
                  <div>
                    <p className="text-gray-800">
                      <span className="font-medium">{feature.split(":")[0]}:</span>
                      {feature.split(":")[1]}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};