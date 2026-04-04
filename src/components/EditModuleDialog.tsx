import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { StudyArea } from "@/types/study";

const ICON_OPTIONS = ["🧬", "🔬", "💊", "🩺", "🧪", "🫀", "🧠", "🦠", "📄", "📚", "⚗️", "🏥"];
const COLOR_OPTIONS = [
  "bg-blue-500", "bg-green-500", "bg-purple-500", "bg-red-500",
  "bg-orange-500", "bg-teal-500", "bg-pink-500", "bg-indigo-500",
];

interface Props {
  area: StudyArea | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdated: () => void;
}

export function EditModuleDialog({ area, open, onOpenChange, onUpdated }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("📄");
  const [color, setColor] = useState("bg-blue-500");
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (area) {
      setName(area.name);
      setDescription(area.description);
      setIcon(area.icon);
      setColor(area.color);
    }
  }, [area]);

  const handleSave = async () => {
    if (!area || !name.trim()) {
      toast({ title: "Nome obrigatório", variant: "destructive" });
      return;
    }
    const dbId = area.id.replace("custom-", "");
    setSaving(true);
    const { error } = await supabase.from("custom_study_areas").update({
      name: name.trim(),
      description: description.trim(),
      icon,
      color,
    }).eq("id", dbId);
    setSaving(false);

    if (error) {
      toast({ title: "Erro ao salvar", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "Módulo atualizado!" });
    onOpenChange(false);
    onUpdated();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar módulo</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="edit-name">Nome</Label>
            <Input id="edit-name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="edit-desc">Descrição</Label>
            <Textarea id="edit-desc" value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
          </div>
          <div className="space-y-1.5">
            <Label>Ícone</Label>
            <div className="flex flex-wrap gap-2">
              {ICON_OPTIONS.map((em) => (
                <button
                  key={em}
                  type="button"
                  onClick={() => setIcon(em)}
                  className={`text-xl p-1.5 rounded-md border-2 transition-colors ${icon === em ? "border-primary bg-primary/10" : "border-transparent hover:border-muted-foreground/30"}`}
                >
                  {em}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Cor</Label>
            <div className="flex flex-wrap gap-2">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`h-8 w-8 rounded-full ${c} border-2 transition-all ${color === c ? "border-foreground scale-110" : "border-transparent"}`}
                />
              ))}
            </div>
          </div>
          <Button onClick={handleSave} disabled={saving} className="w-full">
            {saving ? "Salvando..." : "Salvar alterações"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
