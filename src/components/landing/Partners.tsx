import { Trophy } from "lucide-react";

const partnerLogos = [
  {
    name: "AUDD",
    logo: "/lovable-uploads/e256b69c-090e-49d1-a172-c3b3e485c38c.png"
  },
  {
    name: "DigiChain Innovations",
    logo: "/lovable-uploads/f7899a5a-7596-40c2-803c-ae0fd45d42d9.png"
  },
  {
    name: "XDC Network",
    logo: "/lovable-uploads/c4558b84-fdff-4546-a988-f4f33874854d.png"
  },
  {
    name: "Monetary Authority of Singapore",
    logo: "/lovable-uploads/feba1516-1bc2-40cc-a34a-e3464af259e6.png"
  },
  {
    name: "Singapore Fintech Festival",
    logo: "/lovable-uploads/2ee372c3-8029-48bf-a1d8-87df67783bb7.png"
  },
  {
    name: "Tokenaire",
    logo: "/lovable-uploads/e7871933-6aa9-4c04-8f45-3cc4022bb768.png"
  }
];

export const Partners = () => {
  return (
    <section className="py-20" id="partners">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 tracking-tight">
          Our <span className="text-primary">Partners</span>
        </h2>
        <div className="relative overflow-hidden w-full">
          <div className="flex space-x-8 animate-marquee whitespace-nowrap">
            {[...partnerLogos, ...partnerLogos].map((partner, index) => (
              <div
                key={`${partner.name}-${index}`}
                className="flex-none w-[200px] h-24 bg-white rounded-lg flex items-center justify-center p-4 hover:shadow-lg transition-shadow"
              >
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            ))}
          </div>
          <div className="flex space-x-8 animate-marquee2 whitespace-nowrap absolute top-0">
            {[...partnerLogos, ...partnerLogos].map((partner, index) => (
              <div
                key={`${partner.name}-second-${index}`}
                className="flex-none w-[200px] h-24 bg-white rounded-lg flex items-center justify-center p-4 hover:shadow-lg transition-shadow"
              >
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};