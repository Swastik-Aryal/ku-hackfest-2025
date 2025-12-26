import feynmanLogo from "@/assets/feynman-logo.png";

const Footer = () => {
  return (
    <footer className="py-12 border-t border-border">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <img src={feynmanLogo} alt="Feynman" className="h-6 w-auto" />
            <span className="font-semibold text-foreground">Feynman</span>
            <span className="text-muted-foreground">- Visualize your ideas with AI</span>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Contact
            </a>
          </div>
        </div>
        
        <div className="mt-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Feynman. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
