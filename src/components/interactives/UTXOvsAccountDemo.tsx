import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { ArrowRight, Coins, Wallet, Plus, Minus } from "lucide-react";

interface UTXO {
  id: string;
  amount: number;
  spent: boolean;
}

interface AccountState {
  balance: number;
  nonce: number;
}

export default function UTXOvsAccountDemo() {
  // UTXO Model State
  const [utxos, setUtxos] = useState<UTXO[]>([
    { id: 'utxo_1', amount: 5, spent: false },
    { id: 'utxo_2', amount: 3, spent: false },
    { id: 'utxo_3', amount: 2, spent: false },
  ]);
  const [utxoSendAmount, setUtxoSendAmount] = useState(4);
  const [utxoHistory, setUtxoHistory] = useState<string[]>([]);

  // Account Model State
  const [account, setAccount] = useState<AccountState>({ balance: 10, nonce: 0 });
  const [accountSendAmount, setAccountSendAmount] = useState(4);
  const [accountHistory, setAccountHistory] = useState<string[]>([]);

  const utxoBalance = utxos.filter(u => !u.spent).reduce((sum, u) => sum + u.amount, 0);

  const sendUTXO = () => {
    if (utxoSendAmount <= 0 || utxoSendAmount > utxoBalance) return;

    // Выбираем UTXO для траты (coin selection)
    let remaining = utxoSendAmount;
    const toSpend: UTXO[] = [];
    const available = utxos.filter(u => !u.spent).sort((a, b) => b.amount - a.amount);
    
    for (const utxo of available) {
      if (remaining <= 0) break;
      toSpend.push(utxo);
      remaining -= utxo.amount;
    }

    const totalInput = toSpend.reduce((sum, u) => sum + u.amount, 0);
    const change = totalInput - utxoSendAmount;

    // Обновляем UTXO
    const newUtxos = utxos.map(u => 
      toSpend.find(s => s.id === u.id) ? { ...u, spent: true } : u
    );

    // Добавляем сдачу как новый UTXO
    if (change > 0) {
      newUtxos.push({
        id: `utxo_${Date.now()}`,
        amount: change,
        spent: false
      });
    }

    setUtxos(newUtxos);
    setUtxoHistory([
      `Отправлено ${utxoSendAmount} BTC: потрачено ${toSpend.length} UTXO (${toSpend.map(u => u.amount).join(' + ')}), сдача: ${change} BTC`,
      ...utxoHistory.slice(0, 4)
    ]);
  };

  const sendAccount = () => {
    if (accountSendAmount <= 0 || accountSendAmount > account.balance) return;

    setAccount({
      balance: account.balance - accountSendAmount,
      nonce: account.nonce + 1
    });
    setAccountHistory([
      `Nonce ${account.nonce}: отправлено ${accountSendAmount} ETH, баланс: ${account.balance} → ${account.balance - accountSendAmount}`,
      ...accountHistory.slice(0, 4)
    ]);
  };

  const addFunds = (model: 'utxo' | 'account') => {
    if (model === 'utxo') {
      const amount = Math.floor(Math.random() * 5) + 1;
      setUtxos([...utxos, { id: `utxo_${Date.now()}`, amount, spent: false }]);
      setUtxoHistory([`Получено ${amount} BTC (новый UTXO)`, ...utxoHistory.slice(0, 4)]);
    } else {
      const amount = Math.floor(Math.random() * 5) + 1;
      setAccount({ ...account, balance: account.balance + amount });
      setAccountHistory([`Получено ${amount} ETH, баланс: ${account.balance} → ${account.balance + amount}`, ...accountHistory.slice(0, 4)]);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="side-by-side" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="side-by-side">Сравнение</TabsTrigger>
          <TabsTrigger value="utxo">UTXO модель</TabsTrigger>
          <TabsTrigger value="account">Account модель</TabsTrigger>
        </TabsList>

        <TabsContent value="side-by-side" className="mt-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* UTXO Side */}
            <Card className="border-orange-500/30 bg-orange-500/5">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
                  <Coins className="h-5 w-5" />
                  UTXO (Bitcoin)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 bg-background rounded-lg">
                  <p className="text-sm text-muted-foreground">Баланс (сумма UTXO)</p>
                  <p className="text-3xl font-bold">{utxoBalance} BTC</p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Неизрасходованные выходы:</p>
                  <div className="flex flex-wrap gap-2">
                    {utxos.filter(u => !u.spent).map(utxo => (
                      <Badge key={utxo.id} variant="secondary" className="bg-orange-500/20">
                        {utxo.amount} BTC
                      </Badge>
                    ))}
                    {utxos.filter(u => !u.spent).length === 0 && (
                      <span className="text-sm text-muted-foreground">Нет UTXO</span>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Input
                    type="number"
                    min={0.1}
                    max={utxoBalance}
                    step={0.1}
                    value={utxoSendAmount}
                    onChange={(e) => setUtxoSendAmount(Number(e.target.value))}
                  />
                  <Button onClick={sendUTXO} disabled={utxoSendAmount > utxoBalance}>
                    <Minus className="h-4 w-4 mr-1" />
                    Отправить
                  </Button>
                </div>

                <Button variant="outline" size="sm" onClick={() => addFunds('utxo')} className="w-full">
                  <Plus className="h-4 w-4 mr-1" />
                  Получить BTC
                </Button>
              </CardContent>
            </Card>

            {/* Account Side */}
            <Card className="border-blue-500/30 bg-blue-500/5">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                  <Wallet className="h-5 w-5" />
                  Account (Ethereum)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 bg-background rounded-lg">
                  <p className="text-sm text-muted-foreground">Баланс</p>
                  <p className="text-3xl font-bold">{account.balance} ETH</p>
                </div>

                <div className="p-3 bg-background rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Nonce (счётчик tx)</span>
                    <Badge variant="outline">{account.nonce}</Badge>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Input
                    type="number"
                    min={0.1}
                    max={account.balance}
                    step={0.1}
                    value={accountSendAmount}
                    onChange={(e) => setAccountSendAmount(Number(e.target.value))}
                  />
                  <Button onClick={sendAccount} disabled={accountSendAmount > account.balance}>
                    <Minus className="h-4 w-4 mr-1" />
                    Отправить
                  </Button>
                </div>

                <Button variant="outline" size="sm" onClick={() => addFunds('account')} className="w-full">
                  <Plus className="h-4 w-4 mr-1" />
                  Получить ETH
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="utxo" className="mt-6">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Как работает UTXO?</h4>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• Баланс = сумма всех непотраченных "монет"</li>
                    <li>• Каждый UTXO — как купюра определённого номинала</li>
                    <li>• При отправке UTXO тратятся целиком</li>
                    <li>• Сдача создаётся как новый UTXO</li>
                    <li>• Нет понятия "баланс аккаунта" — только набор монет</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Пример</h4>
                  <div className="p-3 bg-muted rounded-lg text-sm space-y-2">
                    <p>У вас: <Badge>5 BTC</Badge> + <Badge>3 BTC</Badge> = 8 BTC</p>
                    <p>Отправить: 4 BTC</p>
                    <p>Результат: тратим <Badge className="line-through opacity-50">5 BTC</Badge> → создаём:</p>
                    <p className="pl-4">• 4 BTC получателю</p>
                    <p className="pl-4">• 1 BTC себе (сдача, новый UTXO)</p>
                  </div>
                </div>
              </div>
              
              {utxoHistory.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">История:</h4>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    {utxoHistory.map((h, i) => (
                      <p key={i} className="p-2 bg-muted/50 rounded">{h}</p>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="mt-6">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Как работает Account модель?</h4>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• Баланс хранится как число в аккаунте</li>
                    <li>• Nonce — счётчик транзакций (защита от replay)</li>
                    <li>• Транзакция просто изменяет баланс</li>
                    <li>• Проще для разработчиков и смарт-контрактов</li>
                    <li>• Меньше приватности (виден точный баланс)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Пример</h4>
                  <div className="p-3 bg-muted rounded-lg text-sm space-y-2">
                    <p>Баланс: 10 ETH, Nonce: 5</p>
                    <p>Отправить: 4 ETH</p>
                    <p>Результат:</p>
                    <p className="pl-4">• Баланс: 10 → 6 ETH</p>
                    <p className="pl-4">• Nonce: 5 → 6</p>
                    <p className="text-xs mt-2 text-muted-foreground">
                      Nonce гарантирует порядок транзакций
                    </p>
                  </div>
                </div>
              </div>
              
              {accountHistory.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">История:</h4>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    {accountHistory.map((h, i) => (
                      <p key={i} className="p-2 bg-muted/50 rounded">{h}</p>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Comparison table */}
      <div className="p-4 rounded-xl bg-accent/50 border">
        <h4 className="font-semibold mb-3">📊 Сравнение моделей</h4>
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="font-medium">Характеристика</div>
          <div className="font-medium text-orange-600 dark:text-orange-400">UTXO</div>
          <div className="font-medium text-blue-600 dark:text-blue-400">Account</div>
          
          <div className="text-muted-foreground">Приватность</div>
          <div className="text-green-600">Лучше</div>
          <div className="text-yellow-600">Хуже</div>
          
          <div className="text-muted-foreground">Параллельность</div>
          <div className="text-green-600">Легче</div>
          <div className="text-yellow-600">Сложнее</div>
          
          <div className="text-muted-foreground">Смарт-контракты</div>
          <div className="text-yellow-600">Сложнее</div>
          <div className="text-green-600">Проще</div>
          
          <div className="text-muted-foreground">Понимание</div>
          <div className="text-yellow-600">Менее интуитивно</div>
          <div className="text-green-600">Как банк.счёт</div>
        </div>
      </div>
    </div>
  );
}
