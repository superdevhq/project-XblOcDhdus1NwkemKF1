
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import mermaid from "mermaid";

interface MermaidPreviewProps {
  code: string;
}

const MermaidPreview = ({ code }: MermaidPreviewProps) => {
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize mermaid
    mermaid.initialize({
      startOnLoad: true,
      theme: "neutral",
      securityLevel: "loose",
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    });

    const renderDiagram = async () => {
      if (!code.trim()) {
        setSvg("");
        setError(null);
        return;
      }
      
      try {
        setError(null);
        const { svg } = await mermaid.render("mermaid-diagram", code);
        setSvg(svg);
      } catch (err) {
        console.error("Mermaid rendering error:", err);
        setError("Failed to render diagram. Please check your syntax.");
        setSvg("");
      }
    };

    renderDiagram();
  }, [code]);

  return (
    <Card className="border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <CardContent className="p-0">
        <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 border-b border-slate-200 dark:border-slate-800">
          <h3 className="font-medium text-slate-800 dark:text-slate-200">Diagram Preview</h3>
        </div>
        <div className="p-6 bg-white dark:bg-slate-950 min-h-[400px] flex items-center justify-center">
          {error ? (
            <div className="p-4 border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 text-red-800 dark:text-red-300 rounded-md max-w-md mx-auto flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium mb-1">Rendering Error</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          ) : svg ? (
            <div 
              className="max-w-full overflow-auto"
              dangerouslySetInnerHTML={{ __html: svg }} 
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-600">
              <div className="h-8 w-8 mb-4 animate-spin rounded-full border-4 border-slate-300 dark:border-slate-700 border-t-blue-500"></div>
              <p>Rendering diagram...</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MermaidPreview;
