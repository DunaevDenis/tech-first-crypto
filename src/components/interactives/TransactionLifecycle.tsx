import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Wallet, 
  Send, 
  Radio, 
  Users, 
  CheckCircle2, 
  Box,
  Play,
  Pause,
  RotateCcw,
  ArrowRight
} from "lucide-react";

type Stage = 'idle' | 'creating' | 'signing' | 'broadcasting' | 'mempool' | 'validating' | 'confirmed';

const stages: { id: Stage; title: string; description: string; icon: typeof Wallet; duration: number }[] = [
  { id: 'creating', title: 'Создание', description: 'Формирование транзакции с входами и выходами', icon: Wallet, duration: 1500 },
  { id: 'signing', title: 'Подписание', description: 'Криптографическая подпись приватным ключом', icon: Send, duration: 2000 },
  { id: 'broadcasting', title: 'Отправка', description: 'Трансляция в P2P сеть нодам', icon: Radio, duration: 1500 },
  { id: 'mempool', title: 'Мемпул', description: 'Ожидание в очереди непроверенных транзакций', icon: Users, duration: 3000 },
  { id: 'validating', title: 'Валидация', description: 'Майнер включает в блок, проверяет сеть', icon: CheckCircle2, duration: 2500 },
  { id: 'confirmed', title: 'Подтверждено', description: 'Транзакция включена в блокчейн', icon: Box, duration: 0 },
];

export default function TransactionLifecycle() {
  const [currentStage, setCurrentStage] = useState<Stage>('idle');
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [confirmations, setConfirmations] = useState(0);

  const currentStageIndex = stages.findIndex(s => s.id === currentStage);

  useEffect(() => {
    if (!isPlaying || currentStage === 'idle') return;

    const stage = stages.find(s => s.id === currentStage);
    if (!stage || stage.duration === 0) {
      if (currentStage === 'confirmed') {
        // Добавляем подтверждения
        const confInterval = setInterval(() => {
          setConfirmations(c => {
            if (c >= 6) {
              clearInterval(confInterval);
              setIsPlaying(false);
              return 6;
            }
            return c + 1;
          });
        }, 1000);
        return () => clearInterval(confInterval);
      }
      return;
    }

    setProgress(0);
    const progressInterval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return p + (100 / (stage.duration / 50));
      });
    }, 50);

    const timer = setTimeout(() => {
      const nextIndex = currentStageIndex + 1;
      if (nextIndex < stages.length) {
        setCurrentStage(stages[nextIndex].id);
      }
    }, stage.duration);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(timer);
    };
  }, [currentStage, isPlaying, currentStageIndex]);

  const start = () => {
    setCurrentStage('creating');
    setIsPlaying(true);
    setProgress(0);
    setConfirmations(0);
  };

  const togglePause = () => {
    setIsPlaying(!isPlaying);
  };

  const reset = () => {
    setCurrentStage('idle');
    setIsPlaying(false);
    setProgress(0);
    setConfirmations(0);
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex justify-center gap-4">
        {currentStage === 'idle' ? (
          <Button onClick={start} size="lg" className="gap-2">
            <Play className="h-5 w-5" />
            Отправить транзакцию
          </Button>
        ) : (
          <>
            <Button onClick={togglePause} variant="outline" size="lg" className="gap-2">
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              {isPlaying ? 'Пауза' : 'Продолжить'}
            </Button>
            <Button onClick={reset} variant="outline" size="lg" className="gap-2">
              <RotateCcw className="h-5 w-5" />
              Сначала
            </Button>
          </>
        )}
      </div>

      {/* Transaction info */}
      <Card className="bg-muted/30">
        <CardContent className="pt-6">
          <div className="grid sm:grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Отправитель</p>
              <code className="text-sm">0x7a3b...f92d</code>
            </div>
            <div>
              <ArrowRight className="h-6 w-6 mx-auto text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Получатель</p>
              <code className="text-sm">0x4e8c...a1b7</code>
            </div>
          </div>
          <div className="text-center mt-4">
            <Badge variant="secondary" className="text-lg px-4 py-1">
              0.5 ETH
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Stages visualization */}
      <div className="relative">
        {/* Progress line */}
        <div className="absolute top-8 left-0 right-0 h-1 bg-muted rounded-full mx-8">
          <div 
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ 
              width: currentStage === 'idle' 
                ? '0%' 
                : `${(currentStageIndex / (stages.length - 1)) * 100}%` 
            }}
          />
        </div>

        <div className="grid grid-cols-6 gap-2 relative">
          {stages.map((stage, index) => {
            const Icon = stage.icon;
            const isPast = currentStageIndex > index;
            const isCurrent = currentStage === stage.id;
            const isFuture = currentStageIndex < index;

            return (
              <div key={stage.id} className="flex flex-col items-center">
                <div 
                  className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isPast 
                      ? 'bg-primary text-primary-foreground' 
                      : isCurrent 
                        ? 'bg-primary/20 text-primary ring-4 ring-primary/30 animate-pulse' 
                        : 'bg-muted text-muted-foreground'
                  }`}
                >
                  <Icon className="h-7 w-7" />
                </div>
                <p className={`text-xs font-medium mt-3 text-center ${isCurrent ? 'text-primary' : ''}`}>
                  {stage.title}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Current stage details */}
      {currentStage !== 'idle' && (
        <Card className={`transition-all ${currentStage === 'confirmed' ? 'bg-green-500/10 border-green-500/30' : ''}`}>
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              {(() => {
                const stage = stages.find(s => s.id === currentStage);
                if (!stage) return null;
                const Icon = stage.icon;
                return (
                  <>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                      currentStage === 'confirmed' ? 'bg-green-500/20 text-green-500' : 'bg-primary/10 text-primary'
                    }`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">{stage.title}</h4>
                      <p className="text-sm text-muted-foreground mb-3">{stage.description}</p>
                      
                      {currentStage === 'confirmed' ? (
                        <div className="flex items-center gap-2">
                          <span className="text-sm">Подтверждения:</span>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5, 6].map(n => (
                              <div 
                                key={n}
                                className={`w-6 h-6 rounded flex items-center justify-center text-xs font-medium transition-all ${
                                  n <= confirmations 
                                    ? 'bg-green-500 text-white' 
                                    : 'bg-muted text-muted-foreground'
                                }`}
                              >
                                {n}
                              </div>
                            ))}
                          </div>
                          {confirmations >= 6 && (
                            <Badge className="bg-green-500 ml-2">Финализировано</Badge>
                          )}
                        </div>
                      ) : (
                        <Progress value={progress} className="h-2" />
                      )}
                    </div>
                  </>
                );
              })()}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Education callout */}
      <div className="p-4 rounded-xl bg-accent/50 border">
        <h4 className="font-semibold mb-2">💡 Этапы транзакции</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• <strong>Создание</strong> — указываем откуда, куда и сколько</li>
          <li>• <strong>Подписание</strong> — доказываем владение средствами</li>
          <li>• <strong>Мемпул</strong> — зона ожидания, транзакцию видят все</li>
          <li>• <strong>Валидация</strong> — майнер/валидатор включает в блок</li>
          <li>• <strong>Подтверждения</strong> — каждый новый блок увеличивает безопасность</li>
        </ul>
      </div>
    </div>
  );
}
