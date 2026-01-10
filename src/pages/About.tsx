import { BookOpen, Shield, FileText } from "lucide-react";
import Layout from "@/components/layout/Layout";

export default function About() {
  return (
    <Layout>
      <div className="py-12 md:py-20">
        <div className="content-width">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">О проекте</h1>
          
          <div className="prose-crypto">
            <p className="text-xl text-muted-foreground mb-12">
              Crypto Atlas — образовательный проект о технологии криптовалют. 
              Наш фокус: понимание того, как работают системы, а не советы "что купить".
            </p>

            <section className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-semibold">Наши принципы</h2>
              </div>
              <ul className="space-y-3 text-lg">
                <li className="flex items-start gap-3">
                  <span className="text-primary">1.</span>
                  <span><strong>Технология прежде всего</strong> — мы объясняем как работает блокчейн, а не как на нём "заработать"</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary">2.</span>
                  <span><strong>Честность о рисках</strong> — мы не скрываем сложности и угрозы</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary">3.</span>
                  <span><strong>Первоисточники</strong> — мы опираемся на официальную документацию и спецификации</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary">4.</span>
                  <span><strong>Без хайпа</strong> — никаких обещаний доходности и "инвестиционных советов"</span>
                </li>
              </ul>
            </section>

            <section id="sources" className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-semibold">Источники</h2>
              </div>
              <p className="text-lg text-muted-foreground mb-4">
                Мы используем проверенные источники:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Официальные whitepapers и спецификации протоколов</li>
                <li>• Документация Ethereum, Bitcoin и других проектов</li>
                <li>• Рецензируемые академические исследования</li>
                <li>• Аудиты безопасности от признанных компаний</li>
              </ul>
            </section>

            <section id="disclaimer" className="p-6 rounded-2xl border bg-muted/30">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="h-6 w-6 text-[hsl(var(--callout-threat))]" />
                <h2 className="text-xl font-semibold">Дисклеймер</h2>
              </div>
              <div className="space-y-3 text-muted-foreground">
                <p>
                  <strong>Crypto Atlas — образовательный проект.</strong> Материалы на этом сайте 
                  предназначены исключительно для информационных и образовательных целей.
                </p>
                <p>
                  Мы <strong>не даём</strong> инвестиционных, финансовых, юридических или налоговых советов. 
                  Мы <strong>не рекомендуем</strong> покупать, продавать или держать какие-либо криптовалюты.
                </p>
                <p>
                  Криптовалюты — высокорисковые активы. Вы можете потерять все вложенные средства. 
                  Всегда проводите собственное исследование и консультируйтесь с квалифицированными специалистами.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
}
