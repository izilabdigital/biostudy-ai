import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const ICON_OPTIONS = ["🧬", "🔬", "💊", "🩺", "🧪", "🫀", "🧠", "🦠", "📄", "📚", "⚗️", "🏥"];
const COLOR_OPTIONS = [
  "bg-blue-500", "bg-green-500", "bg-purple-500", "bg-red-500",
  "bg-orange-500", "bg-teal-500", "bg-pink-500", "bg-indigo-500",
];

interface Props {
  onCreated: () => void;
}

export function AddModuleDialog({ onCreated }: Props) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("📄");
  const [color, setColor] = useState("bg-blue-500");
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    if (!name.trim()) {
      toast({ title: "Nome obrigatório", variant: "destructive" });
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("custom_study_areas").insert({
      name: name.trim(),
      description: description.trim(),
      icon,
      color,
    });
    setSaving(false);

    if (error) {
      toast({ title: "Erro ao salvar", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "Módulo criado!" });
    setName("");
    setDescription("");
    setIcon("📄");
    setColor("bg-blue-500");
    setOpen(false);
    onCreated();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Plus className="h-4 w-4" /> Novo módulo
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Criar módulo de estudo</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="mod-name">Nome</Label>
            <Input id="mod-name" placeholder="Ex: Farmacologia" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="mod-desc">Descrição</Label>
            <Textarea id="mod-desc" placeholder="Breve descrição do módulo" value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
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
            {saving ? "Salvando..." : "Criar módulo"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
