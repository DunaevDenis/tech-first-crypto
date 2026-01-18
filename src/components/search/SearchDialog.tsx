import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, BookOpen, FileText, Sparkles, Hash } from "lucide-react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface SearchResult {
  id: string;
  type: 'chapter' | 'section' | 'term' | 'interactive';
  title: string;
  description?: string;
  href: string;
}

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const search = async () => {
      setLoading(true);
      const searchTerm = `%${query}%`;

      try {
        // Full-text search in sections content
        const { data: ftsResults } = await supabase
          .rpc('search_sections', { search_query: query });

        // Search chapters by title
        const { data: chapters } = await supabase
          .from('chapters')
          .select('id, title, slug, summary')
          .ilike('title', searchTerm)
          .limit(3);

        // Search sections by title (fallback)
        const { data: titleSections } = await supabase
          .from('sections')
          .select('id, title, slug, chapter_id')
          .ilike('title', searchTerm)
          .limit(3);

        // Search glossary
        const { data: terms } = await supabase
          .from('glossary_terms')
          .select('id, term, slug, short_def')
          .or(`term.ilike.${searchTerm},short_def.ilike.${searchTerm}`)
          .limit(5);

        // Search interactives
        const { data: interactives } = await supabase
          .from('interactives')
          .select('id, title, slug, description')
          .or(`title.ilike.${searchTerm},description.ilike.${searchTerm}`)
          .limit(3);

        // Merge FTS results with title-only results, avoiding duplicates
        const ftsIds = new Set(ftsResults?.map(r => r.id) || []);
        const uniqueTitleSections = titleSections?.filter(s => !ftsIds.has(s.id)) || [];

        const allResults: SearchResult[] = [
          // Full-text search results first (with snippets)
          ...(ftsResults?.map(s => ({
            id: s.id,
            type: 'section' as const,
            title: s.title,
            description: s.snippet,
            href: `/read/${s.chapter_id}/${s.slug}`
          })) || []),
          // Chapters
          ...(chapters?.map(c => ({
            id: c.id,
            type: 'chapter' as const,
            title: c.title,
            description: c.summary || undefined,
            href: `/read/${c.slug}`
          })) || []),
          // Title-only section matches
          ...(uniqueTitleSections.map(s => ({
            id: s.id,
            type: 'section' as const,
            title: s.title,
            href: `/read/${s.chapter_id}/${s.slug}`
          }))),
          // Glossary terms
          ...(terms?.map(t => ({
            id: t.id,
            type: 'term' as const,
            title: t.term,
            description: t.short_def,
            href: `/glossary/${t.slug}`
          })) || []),
          // Interactives
          ...(interactives?.map(i => ({
            id: i.id,
            type: 'interactive' as const,
            title: i.title,
            description: i.description,
            href: `/interactives/${i.slug}`
          })) || [])
        ];

        setResults(allResults);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(search, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const handleSelect = (href: string) => {
    navigate(href);
    onOpenChange(false);
    setQuery("");
  };

  const getTypeIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'chapter': return <BookOpen className="h-4 w-4" />;
      case 'section': return <FileText className="h-4 w-4" />;
      case 'term': return <Hash className="h-4 w-4" />;
      case 'interactive': return <Sparkles className="h-4 w-4" />;
    }
  };

  const getTypeBadge = (type: SearchResult['type']) => {
    const labels = {
      chapter: 'Глава',
      section: 'Секция',
      term: 'Термин',
      interactive: 'Интерактив'
    };
    return labels[type];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl p-0 gap-0 overflow-hidden">
        <div className="flex items-center gap-3 px-4 border-b">
          <Search className="h-5 w-5 text-muted-foreground shrink-0" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск по учебнику, глоссарию, интерактивам..."
            className="border-0 focus-visible:ring-0 text-base py-6"
            autoFocus
          />
        </div>

        <div className="max-h-[400px] overflow-y-auto">
          {loading && (
            <div className="p-8 text-center text-muted-foreground">
              Поиск...
            </div>
          )}

          {!loading && query && results.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              Ничего не найдено по запросу «{query}»
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="py-2">
              {results.map((result) => (
                <button
                  key={`${result.type}-${result.id}`}
                  onClick={() => handleSelect(result.href)}
                  className={cn(
                    "w-full flex items-start gap-3 px-4 py-3 text-left",
                    "hover:bg-muted transition-colors"
                  )}
                >
                  <div className="mt-0.5 text-muted-foreground">
                    {getTypeIcon(result.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium truncate">{result.title}</span>
                      <Badge variant="secondary" className="shrink-0 text-xs">
                        {getTypeBadge(result.type)}
                      </Badge>
                    </div>
                    {result.description && (
                      <p 
                        className="text-sm text-muted-foreground line-clamp-2 mt-0.5"
                        dangerouslySetInnerHTML={{ __html: result.description }}
                      />
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}

          {!query && (
            <div className="p-8 text-center text-muted-foreground">
              <p className="text-sm">Начните вводить для поиска</p>
              <p className="text-xs mt-1">Главы • Секции • Термины • Интерактивы</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
