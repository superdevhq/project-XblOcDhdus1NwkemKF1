
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
      theme: "default",
      securityLevel: "loose",
    });

    const renderDiagram = async () => {
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
    <Card>
      <CardContent className="p-4">
        {error ? (
          <div className="p-4 border border-red-300 bg-red-50 text-red-800 rounded-md">
            {error}
          </div>
        ) : svg ? (
          <div 
            className="flex justify-center p-4 bg-white rounded-md"
            dangerouslySetInnerHTML={{ __html: svg }} 
          />
        ) : (
          <div className="flex justify-center items-center h-[400px]">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MermaidPreview;
