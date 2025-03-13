
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Sparkles } from "lucide-react";

interface MermaidEditorProps {
  code: string;
  onChange: (code: string) => void;
  onGenerate: (prompt: string) => Promise<void>;
  isGenerating: boolean;
  hasApiKey: boolean;
}

const MermaidEditor = ({
  code,
  onChange,
  onGenerate,
  isGenerating,
  hasApiKey,
}: MermaidEditorProps) => {
  const [prompt, setPrompt] = useState("");

  const handleGenerateClick = async () => {
    if (prompt.trim()) {
      await onGenerate(prompt);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  placeholder="Describe the diagram you want to create..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="flex-1"
                  disabled={isGenerating}
                />
                <Button 
                  onClick={handleGenerateClick} 
                  disabled={!prompt.trim() || isGenerating || !hasApiKey}
                >
                  {isGenerating ? (
                    <span className="flex items-center gap-1">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Generating...
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Sparkles className="h-4 w-4" />
                      Generate
                    </span>
                  )}
                </Button>
              </div>
              {!hasApiKey && (
                <p className="text-xs text-muted-foreground">
                  Please add your OpenAI API key in settings to use the generation feature.
                </p>
              )}
            </div>
            <Textarea
              value={code}
              onChange={(e) => onChange(e.target.value)}
              className="font-mono min-h-[400px] resize-none"
              placeholder="Enter your Mermaid code here..."
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MermaidEditor;
