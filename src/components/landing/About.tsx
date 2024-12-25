export const About = () => {
  return (
    <section className="py-20 bg-gray-50" id="about">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 tracking-tight">
          About <span className="text-primary">Us</span>
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <p className="text-lg text-gray-700 leading-relaxed">
              In an increasingly digital world, ensuring the authenticity and integrity of information is crucial. 
              <span className="font-medium text-primary"> TruStamp </span> 
              offers a cutting-edge, blockchain-based solution designed to address critical challenges in global trade and supply chain digitization. It provides instant, escrow-based payments, including liquidity optimization.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              TruStamp's innovative approach ensures traceability, transparency, and automation for trade settlements. By leveraging 
              <span className="font-medium"> blockchain technology, smart contracts, and tokenization</span>, 
              the platform optimizes working capital, enables safe and efficient end-to-end transactions, and supports document verification, identity validation, and robust security.
            </p>
          </div>
          <div className="aspect-video rounded-lg overflow-hidden shadow-lg">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/wlPMbgsmNBs"
              title="TruStamp Introduction"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};