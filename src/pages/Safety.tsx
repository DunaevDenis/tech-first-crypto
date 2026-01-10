import { Shield, Key, AlertTriangle, Link as LinkIcon, Fingerprint, Eye } from "lucide-react";
import Layout from "@/components/layout/Layout";
import Callout from "@/components/content/Callout";

const sections = [
  {
    id: 'seed-phrase',
    icon: Key,
    title: 'Правила seed phrase',
    content: [
      'Никогда не вводите seed phrase на сайтах',
      'Храните оффлайн — бумага, металл, не фото',
      'Не отправляйте в мессенджерах и email',
      'Никто легитимный никогда не попросит вашу seed phrase'
    ]
  },
  {
    id: 'approvals',
    icon: Fingerprint,
    title: 'Риски approvals/allowances',
    content: [
      'Unlimited approve = доступ ко всем вашим токенам',
      'Проверяйте что подписываете — читайте детали транзакции',
      'Регулярно отзывайте ненужные разрешения',
      'Используйте отдельный кошелёк для экспериментов'
    ]
  },
  {
    id: 'phishing',
    icon: Eye,
    title: 'Фишинг и поддельные сайты',
    content: [
      'Проверяйте URL — буква может отличаться',
      'Используйте закладки для важных сайтов',
      'Не переходите по ссылкам из сообщений',
      'Официальные проекты не пишут первыми в DM'
    ]
  },
  {
    id: 'bridges',
    icon: LinkIcon,
    title: 'Риски мостов (bridges)',
    content: [
      'Мосты — одна из главных точек атак',
      'Используйте только проверенные мосты',
      'Не переводите большие суммы за раз',
      'Понимайте: активы на другой сети — другие активы'
    ]
  }
];

const redFlags = [
  'Гарантированная доходность',
  'Срочность: "только сегодня"',
  'Просят seed phrase или приватный ключ',
  'Неизвестный токен появился в кошельке',
  'Ссылка пришла в личные сообщения',
  'Сайт просит подключить кошелёк для "верификации"',
  '"Техподдержка" пишет первой',
  'Слишком хорошо, чтобы быть правдой'
];

export default function Safety() {
  return (
    <Layout>
      <div className="py-12 md:py-20">
        <div className="wide-content">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-8 w-8 text-[hsl(var(--callout-threat))]" />
            <h1 className="text-3xl md:text-4xl font-bold">Центр безопасности</h1>
          </div>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl">
            Практические правила защиты ваших криптоактивов
          </p>

          <Callout type="securitynote" title="Главный принцип">
            Безопасность — это процесс, не продукт. Ни одна технология не заменит осознанности. 
            Большинство потерь происходит из-за социальной инженерии, а не взломов.
          </Callout>

          <div className="grid md:grid-cols-2 gap-8 mt-12">
            {sections.map(section => {
              const Icon = section.icon;
              return (
                <div key={section.id} id={section.id} className="p-6 rounded-2xl border bg-card">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                      <Icon className="h-5 w-5 text-accent-foreground" />
                    </div>
                    <h2 className="text-xl font-semibold">{section.title}</h2>
                  </div>
                  <ul className="space-y-3">
                    {section.content.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-muted-foreground">
                        <span className="text-primary mt-1">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* Red flags */}
          <section id="red-flags" className="mt-16">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 text-[hsl(var(--callout-misconception))]" />
              Красные флаги
            </h2>
            <div className="p-6 rounded-2xl border border-[hsl(var(--callout-misconception)/0.3)] bg-[hsl(var(--callout-misconception-bg))]">
              <p className="text-muted-foreground mb-4">
                Если видите что-то из этого — остановитесь и подумайте дважды:
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                {redFlags.map((flag, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-[hsl(var(--callout-misconception))] shrink-0" />
                    <span>{flag}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}
