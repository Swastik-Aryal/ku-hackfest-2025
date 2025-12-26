import { Brain, Eye } from "lucide-react";

const Mission = () => {
  return (
    <section className="py-24 bg-card/50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Our Mission
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We're bridging the gap between AI capabilities and educational needs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-card border border-border p-8 rounded-lg">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Brain className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-3">
              LLMs Struggle with Hard Problems
            </h3>
            <p className="text-muted-foreground">
              Large language models are not designed to solve complex physics and 
              mathematics problems. They often make calculation errors and lack 
              the reasoning depth needed for advanced scientific concepts.
            </p>
          </div>

          <div className="bg-card border border-border p-8 rounded-lg">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Eye className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-3">
              LLMs Lack Visualization Tools
            </h3>
            <p className="text-muted-foreground">
              Text-based explanations fall short when teaching physics and math. 
              Students learn best through visual demonstrations. Feynman gives AI 
              the power to create dynamic visualizations for better understanding.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Mission;
