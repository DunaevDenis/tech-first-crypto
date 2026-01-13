import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Sparkles, Shield, Cpu, Wallet, ArrowLeftRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";

const tracks = [
  {
    id: 'technology',
    title: 'С нуля',
    description: 'Блокчейн, криптография, консенсус — понимание технологии с основ',
    icon: Cpu,
    href: '/read/blockchain-basics',
    color: 'text-primary'
  },
  {
    id: 'wallets',
    title: 'Уже знаю базу',
    description: 'Кошельки, безопасность ключей, подписи и разрешения',
    icon: Wallet,
    href: '/read/wallet-basics',
    color: 'text-[hsl(var(--track-wallets))]'
  },
  {
    id: 'safety',
    title: 'Безопасность прежде всего',
    description: 'Модели угроз, красные флаги, защита от мошенничества',
    icon: Shield,
    href: '/read/security-threats',
    color: 'text-[hsl(var(--callout-threat))]'
  }
];

const features = [
  {
    icon: BookOpen,
    title: 'Технология, не трейдинг',
    description: 'Фокус на понимании: как работает блокчейн, криптография, консенсус'
  },
  {
    icon: Shield,
    title: 'Безопасность в основе',
    description: 'Модели угроз, реальные риски, защитные практики без паранойи'
  },
  {
    icon: Sparkles,
    title: 'Интерактивное обучение',
    description: 'Визуализации транзакций, подписей, Merkle-деревьев'
  }
];

export default function Index() {
  return (
    <Layout>
      {/* Hero */}
      <section className="py-20 md:py-32">
        <div className="wide-content text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-8 animate-fade-in">
            <Shield className="h-4 w-4" />
            Образование • Не финансовый совет
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-12 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Crypto Atlas
            <span className="block gradient-text mt-3">Technology First</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-12 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Понимание технологии криптовалют. Без хайпа, с доверием к первоисточникам.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <Button size="lg" asChild className="text-lg px-8">
              <Link to="/read">
                Начать обучение
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-lg px-8">
              <Link to="/glossary">
                Глоссарий терминов
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Start scenarios */}
      <section className="py-16 bg-muted/30">
        <div className="wide-content">
          <h2 className="text-2xl md:text-3xl font-semibold text-center mb-4">
            Выберите свой путь
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
            Начните с того, что соответствует вашему уровню
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            {tracks.map((track) => {
              const Icon = track.icon;
              return (
                <Link
                  key={track.id}
                  to={track.href}
                  className="group p-6 rounded-2xl bg-card border hover-lift"
                >
                  <div className={`w-12 h-12 rounded-xl bg-accent flex items-center justify-center mb-4 ${track.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {track.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {track.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="wide-content">
          <h2 className="text-2xl md:text-3xl font-semibold text-center mb-12">
            Почему этому можно доверять
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div key={i} className="text-center">
                  <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-7 w-7 text-accent-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-12 bg-muted/30">
        <div className="content-width text-center">
          <p className="text-sm text-muted-foreground">
            <strong>Дисклеймер:</strong> Crypto Atlas — образовательный проект. Материалы не являются финансовой рекомендацией или инвестиционным советом. Всегда проводите собственное исследование и консультируйтесь со специалистами.
          </p>
        </div>
      </section>
    </Layout>
  );
}
