import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const Hero = () => {
  const navigate = useNavigate();
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Floating geometric shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-16 h-16 border-2 border-foreground/20 rotate-12 animate-pulse" />
        <div className="absolute top-40 left-32 w-12 h-12 border-2 border-foreground/20 rounded-full" />
        <div className="absolute top-28 left-52 w-0 h-0 border-l-8 border-r-8 border-b-[14px] border-l-transparent border-r-transparent border-b-foreground/20" />
        
        <div className="absolute top-24 right-10 w-14 h-14 border-2 border-foreground/20 -rotate-12" />
        <div className="absolute top-16 right-40 w-10 h-10 border-2 border-foreground/20 rounded-full" />
        <div className="absolute top-48 right-20 w-16 h-16 border-2 border-foreground/20 rotate-45" />
        <div className="absolute top-60 right-48 w-0 h-0 border-l-10 border-r-10 border-t-[18px] border-l-transparent border-r-transparent border-t-foreground/20 rotate-180" />
      </div>

      <div className="container mx-auto px-6 text-center relative z-10">
        {/* Announcement badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card mb-8 hover:bg-accent transition-colors cursor-pointer">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm text-muted-foreground">New: AI-Powered Visualizations</span>
          <ArrowRight className="w-4 h-4 text-muted-foreground" />
        </div>

        {/* Main heading */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
          Learn Physics & Maths
          <br />
          <span className="text-primary">Visually with AI</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
          Feynman is an AI-powered visualization tool that helps students understand 
          complex physics and mathematics concepts through interactive animations.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" className="px-8 py-6 text-lg" onClick={() => navigate("/dashboard")}>
            Get Started
          </Button>
          <Button variant="outline" size="lg" className="px-8 py-6 text-lg">
            Learn More
          </Button>
        </div>

        {/* Dashboard preview */}
        <div className="mt-16 mx-auto max-w-5xl">
          <div className="relative rounded-xl overflow-hidden shadow-2xl border border-border bg-gradient-to-br from-card to-accent">
            <div className="aspect-video bg-card/50 backdrop-blur-sm flex items-center justify-center">
              <div className="flex gap-6">
                {/* Sidebar mock */}
                <div className="hidden md:block w-48 bg-card/80 rounded-lg p-4 space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-primary/20" />
                    <span className="text-sm font-medium text-foreground">Feynman</span>
                  </div>
                  <div className="space-y-2">
                    <div className="text-xs text-muted-foreground">Dashboard</div>
                    <div className="flex items-center gap-2 text-sm text-foreground">
                      <div className="w-4 h-4 rounded bg-muted" />
                      Home
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-4 h-4 rounded bg-muted/50" />
                      Projects
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-4 h-4 rounded bg-muted/50" />
                      Visualizations
                    </div>
                  </div>
                </div>
                
                {/* Main content mock */}
                <div className="flex-1 bg-card/60 rounded-lg p-6 max-w-lg">
                  <div className="text-left">
                    <div className="text-xs text-muted-foreground mb-2">/ dashboard</div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">Welcome back!</h3>
                    <p className="text-sm text-muted-foreground mb-4">Create stunning visualizations with AI</p>
                    <div className="bg-foreground/5 rounded-lg p-4 aspect-video flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-2 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                          <Sparkles className="w-8 h-8 text-primary" />
                        </div>
                        <p className="text-xs text-muted-foreground">Your visualizations appear here</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
