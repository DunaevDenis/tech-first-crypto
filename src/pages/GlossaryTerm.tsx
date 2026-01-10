import { useParams, Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGlossaryTermBySlug } from "@/hooks/useGlossary";
import { CATEGORY_LABELS } from "@/lib/types";

export default function GlossaryTerm() {
  const { termSlug } = useParams();
  const { data: term, isLoading } = useGlossaryTermBySlug(termSlug);

  if (isLoading) {
    return (
      <Layout>
        <div className="py-20 text-center animate-pulse">Загрузка...</div>
      </Layout>
    );
  }

  if (!term) {
    return (
      <Layout>
        <div className="py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Термин не найден</h1>
          <Button asChild>
            <Link to="/glossary">Вернуться к глоссарию</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="py-12 md:py-20">
        <div className="content-width">
          <Link to="/glossary" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-8">
            <ChevronLeft className="h-4 w-4" />
            Глоссарий
          </Link>

          <Badge variant="secondary" className="mb-4">
            {CATEGORY_LABELS[term.category] || term.category}
          </Badge>

          <h1 className="text-3xl md:text-4xl font-bold mb-6">{term.term}</h1>

          <div className="prose-crypto">
            <div className="p-6 rounded-xl bg-muted/50 mb-8">
              <h3 className="font-semibold mb-2">Краткое определение</h3>
              <p className="text-lg">{term.short_def}</p>
            </div>

            {term.full_def && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Подробнее</h3>
                <p className="text-lg leading-relaxed">{term.full_def}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
