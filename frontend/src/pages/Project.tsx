import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Atom, Calculator } from "lucide-react";
import ChatPanel from "@/components/project/ChatPanel";
import VideoPlayer from "@/components/project/VideoPlayer";
import { routerResponse, llmResponse, generateVideo } from "@/lib/api";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const Project = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const subject = location.state?.subject || "physics";
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);

  const handleSendMessage = async (question: string) => {
    setIsLoading(true);
    setMessages((prev) => [...prev, { role: "user", content: question }]);

    try {
      // Step 1: Get router response to determine if visualization is needed
      const router = await routerResponse(question);
      
      const needsVisualization = router.response.visualization_needed && router.response.manim_prompt;
      
      // Step 2: Run LLM response and video generation in parallel
      if (needsVisualization) {
        setIsGeneratingVideo(true);
        toast.info("Generating explanation and visualization...");
        
        // Run both in parallel
        const [llm, videoPath] = await Promise.all([
          llmResponse(question),
          generateVideo(router.response.manim_prompt!).catch((error) => {
            console.error("Video generation failed:", error);
            toast.error("Failed to generate visualization");
            return null;
          }),
        ]);
        
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: llm.llm_response },
        ]);
        
        if (videoPath) {
          setVideoUrl(videoPath);
          toast.success("Visualization ready!");
        }
        setIsGeneratingVideo(false);
      } else {
        // Only get LLM response
        const llm = await llmResponse(question);
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: llm.llm_response },
        ]);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong. Please try again.");
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I encountered an error. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
      setIsGeneratingVideo(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm flex-shrink-0">
        <div className="container mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="h-6 w-px bg-border" />
            <div className="flex items-center gap-2">
              {subject === "physics" ? (
                <Atom className="w-5 h-5 text-primary" />
              ) : (
                <Calculator className="w-5 h-5 text-primary" />
              )}
              <span className="font-medium text-foreground capitalize">{subject} Project</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left side - Chat */}
        <div className="w-1/2 border-r border-border flex flex-col">
          <div className="p-4 border-b border-border bg-card/30">
            <h2 className="font-semibold text-foreground">AI Assistant</h2>
            <p className="text-sm text-muted-foreground">
              Ask questions and get explanations
            </p>
          </div>
          <div className="flex-1 overflow-hidden">
            <ChatPanel
              messages={messages}
              isLoading={isLoading}
              onSendMessage={handleSendMessage}
            />
          </div>
        </div>

        {/* Right side - Video */}
        <div className="w-1/2 flex flex-col p-6">
          <div className="mb-4">
            <h2 className="font-semibold text-foreground">Visualization</h2>
            <p className="text-sm text-muted-foreground">
              {isGeneratingVideo 
                ? "Generating animation..." 
                : "Animations will appear here"
              }
            </p>
          </div>
          <VideoPlayer src={videoUrl} autoPlay />
        </div>
      </div>
    </div>
  );
};

export default Project;
