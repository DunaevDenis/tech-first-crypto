import { useState, useEffect, useCallback } from "react";
import { Bookmark, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface TextSelectionPopoverProps {
  sectionId: string;
  userId: string | undefined;
  onSaved?: () => void;
}

export default function TextSelectionPopover({ sectionId, userId, onSaved }: TextSelectionPopoverProps) {
  const { toast } = useToast();
  const [selection, setSelection] = useState<{ text: string; x: number; y: number } | null>(null);
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSelection = useCallback(() => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || !sel.toString().trim()) {
      return;
    }

    const text = sel.toString().trim();
    if (text.length < 3) return;

    const range = sel.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    setSelection({
      text,
      x: rect.left + rect.width / 2,
      y: rect.top + window.scrollY - 10,
    });
    setShowNoteInput(false);
    setNote("");
  }, []);

  const handleClickOutside = useCallback((e: MouseEvent) => {
    const popover = document.getElementById("selection-popover");
    if (popover && !popover.contains(e.target as Node)) {
      setSelection(null);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mouseup", handleSelection);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mouseup", handleSelection);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleSelection, handleClickOutside]);

  const saveHighlight = async () => {
    if (!userId || !selection) {
      toast({
        title: "Войдите в аккаунт",
        description: "Чтобы сохранять цитаты, нужно авторизоваться",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from("highlights")
        .insert({
          user_id: userId,
          section_id: sectionId,
          quote: selection.text,
          note: note.trim() || null,
        });

      if (error) throw error;

      toast({ title: "Цитата сохранена!" });
      setSelection(null);
      onSaved?.();
    } catch (err) {
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить цитату",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (!selection) return null;

  return (
    <div
      id="selection-popover"
      className="fixed z-50 bg-popover border rounded-lg shadow-lg p-2 animate-in fade-in-0 zoom-in-95"
      style={{
        left: `${Math.max(10, Math.min(selection.x - 100, window.innerWidth - 220))}px`,
        top: `${selection.y}px`,
        transform: "translateY(-100%)",
      }}
    >
      {!showNoteInput ? (
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="ghost"
            className="gap-2"
            onClick={() => setShowNoteInput(true)}
            disabled={!userId}
          >
            <Bookmark className="h-4 w-4" />
            {userId ? "Сохранить" : "Войдите"}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0"
            onClick={() => setSelection(null)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="w-64 space-y-2">
          <p className="text-xs text-muted-foreground line-clamp-2 italic">
            "{selection.text.slice(0, 100)}{selection.text.length > 100 ? "..." : ""}"
          </p>
          <Textarea
            placeholder="Добавить заметку (необязательно)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="min-h-[60px] text-sm"
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={saveHighlight} disabled={saving} className="flex-1">
              {saving && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
              Сохранить
            </Button>
            <Button size="sm" variant="outline" onClick={() => setSelection(null)}>
              Отмена
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
