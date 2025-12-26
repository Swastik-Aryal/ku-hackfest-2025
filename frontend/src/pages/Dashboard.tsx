import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Atom, Calculator, Plus, ArrowLeft } from "lucide-react";
import { setSubject, resetHistory } from "@/lib/api";
import { toast } from "sonner";

const Dashboard = () => {
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateProject = async (subject: "physics" | "mathematics") => {
    setIsLoading(true);
    try {
      await Promise.all([setSubject(subject), resetHistory()]);
      toast.success(`Subject set to ${subject}`);
      navigate("/project", { state: { subject } });
    } catch (error) {
      toast.error("Failed to create project. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img 
              src="/src/assets/feynman-logo.png" 
              alt="Feynman" 
              className="h-8 w-8"
            />
            <span className="font-semibold text-foreground">Feynman</span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-foreground mb-4">
              {isCreating ? "Choose Your Subject" : "Your Projects"}
            </h1>
            <p className="text-muted-foreground">
              {isCreating 
                ? "Select a subject to load the fine-tuned AI model" 
                : "Create a new project to start learning with AI visualizations"
              }
            </p>
          </div>

          {!isCreating ? (
            <div className="flex justify-center">
              <Card 
                className="w-64 border-dashed border-2 hover:border-primary/50 hover:bg-accent/50 transition-all cursor-pointer group"
                onClick={() => setIsCreating(true)}
              >
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Plus className="w-8 h-8 text-primary" />
                  </div>
                  <p className="font-medium text-foreground">Create New Project</p>
                  <p className="text-sm text-muted-foreground mt-1">Start learning</p>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <Card 
                className="hover:border-primary/50 hover:shadow-lg transition-all cursor-pointer group"
                onClick={() => !isLoading && handleCreateProject("physics")}
              >
                <CardHeader className="text-center">
                  <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Atom className="w-10 h-10 text-primary" />
                  </div>
                  <CardTitle>Physics</CardTitle>
                  <CardDescription>
                    Explore mechanics, waves, electromagnetism, and more with interactive visualizations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Loading..." : "Start Physics Project"}
                  </Button>
                </CardContent>
              </Card>

              <Card 
                className="hover:border-primary/50 hover:shadow-lg transition-all cursor-pointer group"
                onClick={() => !isLoading && handleCreateProject("mathematics")}
              >
                <CardHeader className="text-center">
                  <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Calculator className="w-10 h-10 text-primary" />
                  </div>
                  <CardTitle>Mathematics</CardTitle>
                  <CardDescription>
                    Learn calculus, algebra, geometry, and more with step-by-step visual explanations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Loading..." : "Start Maths Project"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {isCreating && (
            <div className="text-center mt-8">
              <Button variant="ghost" onClick={() => setIsCreating(false)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Projects
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
