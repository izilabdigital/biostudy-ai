import { useState, useRef } from "react";
import { Upload, Loader2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PdfUploadButtonProps {
  onUploadComplete: () => void;
}

export function PdfUploadButton({ onUploadComplete }: PdfUploadButtonProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast({ title: "Arquivo inválido", description: "Envie apenas arquivos PDF.", variant: "destructive" });
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("pdf", file);

      const { data, error } = await supabase.functions.invoke("process-pdf", {
        body: formData,
      });

      if (error) throw error;

      if (data?.success) {
        toast({
          title: "PDF analisado com sucesso!",
          description: `${data.themes?.length ?? 0} tema(s) extraído(s) pela IA.`,
        });
        onUploadComplete();
      } else {
        toast({
          title: "Erro na análise",
          description: data?.error || "A IA não conseguiu extrair temas do PDF.",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Erro ao processar PDF",
        description: err instanceof Error ? err.message : "Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={handleFileChange}
      />
      <Button
        onClick={handleClick}
        disabled={uploading}
        variant="outline"
        className="gap-2 border-dashed border-2 h-auto py-4 px-6"
      >
        {uploading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Analisando PDF com IA...
          </>
        ) : (
          <>
            <Upload className="h-5 w-5" />
            <div className="text-left">
              <div className="font-medium">Enviar PDF de estudos</div>
              <div className="text-xs text-muted-foreground">A IA extrai temas automaticamente</div>
            </div>
          </>
        )}
      </Button>
    </>
  );
}
