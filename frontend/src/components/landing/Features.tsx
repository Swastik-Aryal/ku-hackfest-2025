import { 
  Wand2, 
  Layers, 
  Brain, 
  Presentation, 
  Users, 
  Palette,
  Download,
  Zap
} from "lucide-react";

const features = [
  {
    icon: Wand2,
    title: "Customize Your AI",
    description: "Tailor Feynman to your specific needs with customizable prompts and styles."
  },
  {
    icon: Layers,
    title: "Versatile",
    description: "Create diagrams, flowcharts, mind maps, and complex visualizations with ease."
  },
  {
    icon: Brain,
    title: "Advanced AI",
    description: "Powered by cutting-edge AI to understand and visualize your concepts accurately."
  },
  {
    icon: Presentation,
    title: "Presentations",
    description: "No more boring slides. Create remarkable visual presentations that captivate."
  },
  {
    icon: Users,
    title: "Community",
    description: "Share your visualizations and discover inspiration from others."
  },
  {
    icon: Palette,
    title: "Beautiful Style",
    description: "Every visualization is crafted with aesthetics in mind."
  },
  {
    icon: Download,
    title: "High Quality Export",
    description: "Export your visualizations in high resolution formats."
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Generate complex visualizations in seconds, not hours."
  }
];

const Features = () => {
  return (
    <section id="features" className="py-24 bg-card/50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Features
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We want to make your visualization experience as easy as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-6 bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
            >
              <div className="w-12 h-12 mb-4 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
