import { Card } from "@/components/ui/card";

export const Partners = () => {
  return (
    <section className="w-full py-12 bg-white">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 items-center">
          <div className="flex flex-col justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Partners
              </h2>
              <p className="max-w-[900px] text-zinc-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mx-auto">
                Trusted by leading organizations
              </p>
            </div>
          </div>
          <div className="flex flex-col justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h3 className="text-xl font-bold tracking-tighter sm:text-2xl">
                Finalists
              </h3>
            </div>
          </div>
          <div className="overflow-hidden w-full">
            <div className="flex animate-marquee space-x-8 whitespace-nowrap">
              <div className="flex space-x-8 items-center">
                <img
                  alt="Singapore Fintech Festival"
                  className="h-24 w-auto object-contain"
                  src="/lovable-uploads/e7871933-6aa9-4c04-8f45-3cc4022bb768.png"
                />
                {/* Add duplicate images to create seamless loop */}
                <img
                  alt="Singapore Fintech Festival"
                  className="h-24 w-auto object-contain"
                  src="/lovable-uploads/e7871933-6aa9-4c04-8f45-3cc4022bb768.png"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};