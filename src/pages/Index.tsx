
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings } from "lucide-react";
import MermaidEditor from "@/components/MermaidEditor";
import MermaidPreview from "@/components/MermaidPreview";
import SettingsDialog from "@/components/SettingsDialog";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [code, setCode] = useState<string>(`graph TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> B`);
  const [openAIKey, setOpenAIKey] = useState<string>("");
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const { toast } = useToast();

  // Load OpenAI key from localStorage on component mount
  useEffect(() => {
    const savedKey = localStorage.getItem("openai-key");
    if (savedKey) {
      setOpenAIKey(savedKey);
    }
  }, []);

  const handleGenerateDiagram = async (prompt: string) => {
    if (!openAIKey) {
      toast({
        title: "OpenAI API Key Required",
        description: "Please add your OpenAI API key in settings first.",
        variant: "destructive",
      });
      setIsSettingsOpen(true);
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openAIKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: "You are a helpful assistant that generates Mermaid diagram code based on user prompts. Only respond with valid Mermaid syntax without any explanations or markdown formatting."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.7,
        }),
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message || "Error generating diagram");
      }

      const mermaidCode = data.choices[0].message.content.trim();
      setCode(mermaidCode);
      toast({
        title: "Diagram Generated",
        description: "Your mermaid diagram has been created successfully.",
      });
    } catch (error) {
      console.error("Error generating diagram:", error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate diagram. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const saveOpenAIKey = (key: string) => {
    setOpenAIKey(key);
    localStorage.setItem("openai-key", key);
    setIsSettingsOpen(false);
    toast({
      title: "Settings Saved",
      description: "Your OpenAI API key has been saved.",
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b py-4 px-6 flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Mermaid Editor</h1>
        <Button variant="ghost" size="icon" onClick={() => setIsSettingsOpen(true)}>
          <Settings className="h-5 w-5" />
          <span className="sr-only">Settings</span>
        </Button>
      </header>

      <main className="flex-1 p-6 container max-w-6xl mx-auto">
        <Tabs defaultValue="editor" className="w-full">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="editor">Editor</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="editor" className="mt-0">
            <MermaidEditor 
              code={code} 
              onChange={setCode} 
              onGenerate={handleGenerateDiagram}
              isGenerating={isGenerating}
              hasApiKey={!!openAIKey}
            />
          </TabsContent>

          <TabsContent value="preview" className="mt-0">
            <MermaidPreview code={code} />
          </TabsContent>
        </Tabs>
      </main>

      <SettingsDialog 
        open={isSettingsOpen} 
        onOpenChange={setIsSettingsOpen}
        apiKey={openAIKey}
        onSave={saveOpenAIKey}
      />
    </div>
  );
};

export default Index;
