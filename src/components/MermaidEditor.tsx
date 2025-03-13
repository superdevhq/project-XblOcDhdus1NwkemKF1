
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Sparkles, Info } from "lucide-react";

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
      <Card className="border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 p-4 border-b border-slate-200 dark:border-slate-800">
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  placeholder="Describe the diagram you want to create..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="flex-1 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus-visible:ring-blue-500"
                  disabled={isGenerating}
                />
                <Button 
                  onClick={handleGenerateClick} 
                  disabled={!prompt.trim() || isGenerating || !hasApiKey}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                >
                  {isGenerating ? (
                    <span className="flex items-center gap-1.5">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Generating...
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4" />
                      Generate
                    </span>
                  )}
                </Button>
              </div>
              {!hasApiKey && (
                <div className="flex items-start gap-2 p-2.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-md text-sm text-amber-800 dark:text-amber-300">
                  <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <p>
                    Please add your OpenAI API key in settings to use the generation feature.
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="p-0">
            <Textarea
              value={code}
              onChange={(e) => onChange(e.target.value)}
              className="font-mono min-h-[400px] resize-none border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 p-4"
              placeholder="Enter your Mermaid code here..."
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-xs text-slate-500 dark:text-slate-400 px-1">
        <p>
          <span className="font-medium">Tip:</span> Try prompts like "Create a flowchart for user registration process" or "Draw a sequence diagram for API authentication"
        </p>
      </div>
    </div>
  );
};

export default MermaidEditor;
