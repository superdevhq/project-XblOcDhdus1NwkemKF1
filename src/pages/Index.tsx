
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Code, Eye } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex flex-col">
      <header className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 py-4 px-6 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 w-8 h-8 rounded-md flex items-center justify-center text-white font-bold">M</div>
          <h1 className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Mermaid Editor</h1>
        </div>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => setIsSettingsOpen(true)}
          className="border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <Settings className="h-5 w-5 text-slate-600 dark:text-slate-400" />
          <span className="sr-only">Settings</span>
        </Button>
      </header>

      <main className="flex-1 p-6 container max-w-6xl mx-auto">
        <div className="mb-6">
          <h2 className="text-xl font-medium text-slate-800 dark:text-slate-200">Create beautiful diagrams with AI</h2>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Use natural language to generate diagrams or write Mermaid code directly
          </p>
        </div>
        
        <Tabs defaultValue="editor" className="w-full">
          <div className="flex justify-between items-center mb-4">
            <TabsList className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1">
              <TabsTrigger 
                value="editor" 
                className="data-[state=active]:bg-slate-100 dark:data-[state=active]:bg-slate-800 data-[state=active]:text-slate-900 dark:data-[state=active]:text-slate-100 flex items-center gap-1.5"
              >
                <Code className="h-4 w-4" />
                Editor
              </TabsTrigger>
              <TabsTrigger 
                value="preview" 
                className="data-[state=active]:bg-slate-100 dark:data-[state=active]:bg-slate-800 data-[state=active]:text-slate-900 dark:data-[state=active]:text-slate-100 flex items-center gap-1.5"
              >
                <Eye className="h-4 w-4" />
                Preview
              </TabsTrigger>
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

      <footer className="py-4 px-6 border-t border-slate-200 dark:border-slate-800 text-center text-sm text-slate-500 dark:text-slate-400">
        Powered by Mermaid.js and OpenAI GPT-4o-mini
      </footer>

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
