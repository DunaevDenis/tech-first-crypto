import { useParams, Link } from "react-router-dom";
import { ChevronLeft, Sparkles } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useInteractiveBySlug } from "@/hooks/useInteractives";
import { DIFFICULTY_LABELS } from "@/lib/types";
import {
  DigitalSignatureDemo,
  MerkleTreeExplorer,
  TransactionLifecycle,
  UTXOvsAccountDemo,
  RollupL2Demo,
  ApprovalsSandbox
} from "@/components/interactives";

// Маппинг slug → компонент (соответствует slugs в БД)
const INTERACTIVE_COMPONENTS: Record<string, React.ComponentType> = {
  'digital-signature-steps': DigitalSignatureDemo,
  'merkle-proof': MerkleTreeExplorer,
  'transaction-lifecycle': TransactionLifecycle,
  'utxo-vs-account': UTXOvsAccountDemo,
  'rollup-flow': RollupL2Demo,
  'approvals-sandbox': ApprovalsSandbox,
};

export default function InteractiveView() {
  const { slug } = useParams();
  const { data: interactive, isLoading } = useInteractiveBySlug(slug);

  if (isLoading) {
    return (
      <Layout>
        <div className="py-20 text-center animate-pulse">Загрузка...</div>
      </Layout>
    );
  }

  if (!interactive) {
    return (
      <Layout>
        <div className="py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Интерактив не найден</h1>
          <Button asChild>
            <Link to="/interactives">Вернуться к интерактивам</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  // Получаем компонент по slug
  const InteractiveComponent = slug ? INTERACTIVE_COMPONENTS[slug] : null;

  return (
    <Layout>
      <div className="py-12 md:py-20">
        <div className="wide-content">
          <Link to="/interactives" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-8">
            <ChevronLeft className="h-4 w-4" />
            Все интерактивы
          </Link>

          <div className="flex items-start gap-4 mb-6">
            <div className="w-14 h-14 rounded-xl bg-accent flex items-center justify-center shrink-0">
              <Sparkles className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{interactive.title}</h1>
              <div className="flex items-center gap-2">
                <Badge>{DIFFICULTY_LABELS[interactive.difficulty]}</Badge>
                {interactive.tags?.map(tag => (
                  <Badge key={tag} variant="outline">{tag}</Badge>
                ))}
              </div>
            </div>
          </div>

          <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
            {interactive.description}
          </p>

          {/* Interactive component or placeholder */}
          {InteractiveComponent ? (
            <div className="rounded-2xl border bg-card p-6 md:p-8">
              <InteractiveComponent />
            </div>
          ) : (
            <div className="rounded-2xl border bg-muted/30 p-12 text-center min-h-[400px] flex flex-col items-center justify-center">
              <Sparkles className="h-16 w-16 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">
                Интерактивная демонстрация в разработке
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Здесь будет визуализация: {interactive.title}
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
