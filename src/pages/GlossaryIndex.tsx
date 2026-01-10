import { useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useGlossaryTerms } from "@/hooks/useGlossary";
import { CATEGORY_LABELS } from "@/lib/types";

export default function GlossaryIndex() {
  const { data: terms, isLoading } = useGlossaryTerms();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories = [...new Set(terms?.map(t => t.category) || [])].sort();
  
  const filteredTerms = terms?.filter(term => {
    const matchesSearch = !search || 
      term.term.toLowerCase().includes(search.toLowerCase()) ||
      term.short_def.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !activeCategory || term.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Layout>
      <div className="py-12 md:py-20">
        <div className="wide-content">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Глоссарий</h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
            {terms?.length || 0} терминов с объяснениями
          </p>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск терминов..."
              className="pl-10 h-12"
            />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-8">
            <Badge
              variant={activeCategory === null ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setActiveCategory(null)}
            >
              Все
            </Badge>
            {categories.map(cat => (
              <Badge
                key={cat}
                variant={activeCategory === cat ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setActiveCategory(cat)}
              >
                {CATEGORY_LABELS[cat] || cat}
              </Badge>
            ))}
          </div>

          {/* Terms list */}
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-20 rounded-xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid gap-3">
              {filteredTerms?.map(term => (
                <Link
                  key={term.id}
                  to={`/glossary/${term.slug}`}
                  className="group p-4 rounded-xl border bg-card hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold group-hover:text-primary transition-colors">
                        {term.term}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {term.short_def}
                      </p>
                    </div>
                    <Badge variant="secondary" className="shrink-0">
                      {CATEGORY_LABELS[term.category] || term.category}
                    </Badge>
                  </div>
                </Link>
              ))}
              
              {filteredTerms?.length === 0 && (
                <p className="text-center py-12 text-muted-foreground">
                  Ничего не найдено
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
