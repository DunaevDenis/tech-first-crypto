import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="wide-content py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 font-semibold text-lg mb-3">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">CA</span>
              </div>
              Crypto Atlas
            </Link>
            <p className="text-sm text-muted-foreground">
              Технология криптовалют. Без хайпа, с доверием.
            </p>
          </div>

          {/* Learning */}
          <div>
            <h4 className="font-medium mb-3">Обучение</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/read" className="hover:text-foreground transition-colors">Учебник</Link></li>
              <li><Link to="/glossary" className="hover:text-foreground transition-colors">Глоссарий</Link></li>
              <li><Link to="/interactives" className="hover:text-foreground transition-colors">Интерактивы</Link></li>
            </ul>
          </div>

          {/* Safety */}
          <div>
            <h4 className="font-medium mb-3">Безопасность</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/safety" className="hover:text-foreground transition-colors">Центр безопасности</Link></li>
              <li><Link to="/safety#seed-phrase" className="hover:text-foreground transition-colors">Правила seed phrase</Link></li>
              <li><Link to="/safety#red-flags" className="hover:text-foreground transition-colors">Красные флаги</Link></li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="font-medium mb-3">О проекте</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-foreground transition-colors">О Crypto Atlas</Link></li>
              <li><Link to="/about#sources" className="hover:text-foreground transition-colors">Источники</Link></li>
              <li><Link to="/about#disclaimer" className="hover:text-foreground transition-colors">Дисклеймер</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground text-center md:text-left">
            © 2024 Crypto Atlas. Образовательный проект. Не является финансовой рекомендацией.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link to="/about#disclaimer" className="hover:text-foreground transition-colors">
              Дисклеймер
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
