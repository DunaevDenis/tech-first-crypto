import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Key, Lock, CheckCircle, XCircle, RefreshCw } from "lucide-react";

interface KeyPair {
  privateKey: string;
  publicKey: string;
}

export default function DigitalSignatureDemo() {
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("Привет, блокчейн!");
  const [keyPair, setKeyPair] = useState<KeyPair | null>(null);
  const [signature, setSignature] = useState<string | null>(null);
  const [verifyMessage, setVerifyMessage] = useState("");
  const [verificationResult, setVerificationResult] = useState<boolean | null>(null);

  // Симуляция генерации ключей (в реальности это криптографически безопасно)
  const generateKeyPair = () => {
    const randomHex = () => Array.from({ length: 16 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
    
    setKeyPair({
      privateKey: `0x${randomHex()}${randomHex()}`,
      publicKey: `0x04${randomHex()}${randomHex().slice(0, 16)}`
    });
    setStep(2);
    setSignature(null);
    setVerificationResult(null);
  };

  // Простая хэш-функция для демонстрации (поддерживает Unicode)
  const simpleHash = (str: string): string => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16).padStart(8, '0');
  };

  // Симуляция подписи
  const signMessage = () => {
    if (!keyPair) return;
    
    // Хэш сообщения + часть приватного ключа
    const hash = simpleHash(message + keyPair.privateKey.slice(0, 10));
    
    setSignature(`0x${hash}${simpleHash(hash)}...${hash.slice(-4)}`);
    setVerifyMessage(message);
    setStep(3);
  };

  // Симуляция верификации
  const verifySignature = () => {
    setVerificationResult(verifyMessage === message);
    setStep(4);
  };

  const reset = () => {
    setStep(1);
    setKeyPair(null);
    setSignature(null);
    setVerifyMessage("");
    setVerificationResult(null);
    setMessage("Привет, блокчейн!");
  };

  return (
    <div className="space-y-6">
      {/* Progress indicator */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
              step >= s 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted text-muted-foreground'
            }`}>
              {s}
            </div>
            {s < 4 && (
              <ArrowRight className={`h-4 w-4 mx-2 ${step > s ? 'text-primary' : 'text-muted-foreground'}`} />
            )}
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Step 1: Generate Keys */}
        <Card className={step === 1 ? 'ring-2 ring-primary' : ''}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Key className="h-5 w-5" />
              Шаг 1: Генерация ключей
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Создаём пару ключей: приватный (секретный) и публичный (можно показывать всем).
            </p>
            
            {keyPair ? (
              <div className="space-y-2">
                <div className="p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                  <p className="text-xs text-muted-foreground mb-1">🔐 Приватный ключ (СЕКРЕТ!)</p>
                  <code className="text-xs break-all text-destructive">{keyPair.privateKey}</code>
                </div>
                <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                  <p className="text-xs text-muted-foreground mb-1">🔓 Публичный ключ</p>
                  <code className="text-xs break-all text-primary">{keyPair.publicKey}</code>
                </div>
              </div>
            ) : (
              <Button onClick={generateKeyPair} className="w-full">
                Сгенерировать ключи
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Step 2: Sign Message */}
        <Card className={step === 2 ? 'ring-2 ring-primary' : ''}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Lock className="h-5 w-5" />
              Шаг 2: Подписание сообщения
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Подписываем сообщение приватным ключом. Подпись доказывает авторство.
            </p>
            
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Введите сообщение..."
              disabled={step !== 2}
            />
            
            {signature ? (
              <div className="p-3 bg-accent rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">✍️ Цифровая подпись</p>
                <code className="text-xs break-all">{signature}</code>
              </div>
            ) : (
              <Button onClick={signMessage} disabled={step < 2} className="w-full">
                Подписать сообщение
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Step 3: Verify */}
        <Card className={step === 3 ? 'ring-2 ring-primary' : ''}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CheckCircle className="h-5 w-5" />
              Шаг 3: Проверка подписи
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Любой может проверить подпись с помощью публичного ключа. Попробуйте изменить сообщение!
            </p>
            
            <Input
              value={verifyMessage}
              onChange={(e) => {
                setVerifyMessage(e.target.value);
                setVerificationResult(null);
              }}
              placeholder="Сообщение для проверки..."
              disabled={step < 3}
            />
            
            <Button onClick={verifySignature} disabled={step < 3} className="w-full">
              Проверить подпись
            </Button>
          </CardContent>
        </Card>

        {/* Step 4: Result */}
        <Card className={step === 4 ? 'ring-2 ring-primary' : ''}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              Шаг 4: Результат
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {verificationResult !== null ? (
              <div className={`p-4 rounded-lg flex items-center gap-3 ${
                verificationResult 
                  ? 'bg-green-500/10 text-green-600 dark:text-green-400' 
                  : 'bg-destructive/10 text-destructive'
              }`}>
                {verificationResult ? (
                  <>
                    <CheckCircle className="h-8 w-8" />
                    <div>
                      <p className="font-semibold">Подпись верна!</p>
                      <p className="text-sm opacity-80">Сообщение подлинное и не изменено</p>
                    </div>
                  </>
                ) : (
                  <>
                    <XCircle className="h-8 w-8" />
                    <div>
                      <p className="font-semibold">Подпись недействительна!</p>
                      <p className="text-sm opacity-80">Сообщение было изменено</p>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="p-4 rounded-lg bg-muted text-muted-foreground text-center">
                Пройдите все шаги для получения результата
              </div>
            )}
            
            <Button onClick={reset} variant="outline" className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Начать заново
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Education callout */}
      <div className="p-4 rounded-xl bg-accent/50 border">
        <h4 className="font-semibold mb-2">💡 Что происходит?</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• <strong>Приватный ключ</strong> — секрет, которым вы подписываете</li>
          <li>• <strong>Публичный ключ</strong> — можно показать, он проверяет подпись</li>
          <li>• <strong>Подпись</strong> — математически связана с сообщением и ключом</li>
          <li>• Изменение даже одного символа делает подпись недействительной</li>
        </ul>
      </div>
    </div>
  );
}
