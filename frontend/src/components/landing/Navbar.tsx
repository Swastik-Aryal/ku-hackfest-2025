import { Button } from "@/components/ui/button";
import feynmanLogo from "@/assets/feynman-logo.png";

const Navbar = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <nav className="container mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={feynmanLogo} alt="Feynman" className="h-8 w-auto" />
          <span className="text-xl font-semibold text-foreground">Feynman</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          <a href="#examples" className="text-muted-foreground hover:text-foreground transition-colors">
            Examples
          </a>
          <a href="#faq" className="text-muted-foreground hover:text-foreground transition-colors">
            FAQ
          </a>
        </div>
        
        <div className="flex items-center gap-4">
          <Button>Get Started</Button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
