import { useEffect, useState } from "react";
import { Trash2, MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

interface Highlight {
  id: string;
  quote: string;
  note: string | null;
  created_at: string | null;
}

interface HighlightsListProps {
  sectionId: string;
  userId: string | undefined;
  refreshKey?: number;
}

export default function HighlightsList({ sectionId, userId, refreshKey }: HighlightsListProps) {
  const { toast } = useToast();
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHighlights = async () => {
    if (!userId) {
      setHighlights([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("highlights")
        .select("id, quote, note, created_at")
        .eq("section_id", sectionId)
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setHighlights(data || []);
    } catch (err) {
      console.error("Error fetching highlights:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHighlights();
  }, [sectionId, userId, refreshKey]);

  const deleteHighlight = async (id: string) => {
    try {
      const { error } = await supabase
        .from("highlights")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setHighlights((prev) => prev.filter((h) => h.id !== id));
      toast({ title: "Цитата удалена" });
    } catch (err) {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить цитату",
        variant: "destructive"
      });
    }
  };

  if (!userId) return null;
  if (loading) return null;
  if (highlights.length === 0) return null;

  return (
    <div className="border-t pt-6 mt-8">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <MessageSquare className="h-5 w-5" />
        Мои цитаты ({highlights.length})
      </h3>
      <ScrollArea className="max-h-[300px]">
        <div className="space-y-3">
          {highlights.map((highlight) => (
            <div
              key={highlight.id}
              className="bg-muted/50 rounded-lg p-3 group relative"
            >
              <p className="text-sm italic text-foreground/90 pr-8">
                "{highlight.quote}"
              </p>
              {highlight.note && (
                <p className="text-xs text-muted-foreground mt-2 pl-3 border-l-2 border-primary/30">
                  {highlight.note}
                </p>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => deleteHighlight(highlight.id)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
