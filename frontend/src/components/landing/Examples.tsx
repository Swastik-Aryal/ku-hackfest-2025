import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import poyntingTheorem from "@/assets/poyntingtheorem.mp4";
import fourierAnalysis from "@/assets/FourierAnalysis.mp4";
import simpleHarmonicMotion from "@/assets/SimpleHarmonicMotion.mp4";

const examples = [
  {
    title: "Poynting Theorem",
    description: "Visualize electromagnetic energy flow and power density",
    video: poyntingTheorem
  },
  {
    title: "Fourier Analysis",
    description: "Understand how complex signals decompose into simple waves",
    video: fourierAnalysis
  },
  {
    title: "Simple Harmonic Motion",
    description: "Animate oscillatory motion and its mathematical foundations",
    video: simpleHarmonicMotion
  }
];

const Examples = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % examples.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + examples.length) % examples.length);
  };

  return (
    <section id="examples" className="py-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Examples
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We'll let our work speak for itself.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {examples.map((example, index) => (
                <div key={index} className="w-full flex-shrink-0 px-4">
                  <div className="aspect-video rounded-xl border border-border overflow-hidden bg-card">
                    <video
                      src={example.video}
                      className="w-full h-full object-cover"
                      autoPlay
                      loop
                      muted
                      playsInline
                    />
                  </div>
                  <div className="text-center mt-4">
                    <h3 className="text-2xl font-semibold text-foreground mb-2">
                      {example.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {example.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 mt-8">
            <Button
              variant="outline"
              size="icon"
              onClick={prev}
              className="rounded-full"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            
            <div className="flex gap-2">
              {examples.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentIndex ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={next}
              className="rounded-full"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Examples;
