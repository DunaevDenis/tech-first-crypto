import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Badge } from "@/components/ui/badge";
import { useInteractives } from "@/hooks/useInteractives";
import { DIFFICULTY_LABELS } from "@/lib/types";

export default function InteractivesIndex() {
  const { data: interactives, isLoading } = useInteractives();

  return (
    <Layout>
      <div className="py-12 md:py-20">
        <div className="wide-content">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="h-8 w-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold">Интерактивы</h1>
          </div>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl">
            Визуальные демонстрации для глубокого понимания технологий
          </p>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-48 rounded-xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {interactives?.map(item => (
                <Link
                  key={item.id}
                  to={`/interactives/${item.slug}`}
                  className="group p-6 rounded-2xl border bg-card hover-lift"
                >
                  <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mb-4">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {item.description}
                  </p>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      {DIFFICULTY_LABELS[item.difficulty]}
                    </Badge>
                    {item.tags?.slice(0, 2).map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
