import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Layers, 
  ArrowDown, 
  ArrowUp, 
  Box, 
  Zap, 
  Clock,
  DollarSign,
  Shield,
  Plus
} from "lucide-react";

interface L2Transaction {
  id: string;
  from: string;
  to: string;
  amount: number;
  timestamp: number;
}

interface Batch {
  id: number;
  transactions: L2Transaction[];
  status: 'pending' | 'submitted' | 'finalized';
  proof?: string;
}

export default function RollupL2Demo() {
  const [l2Transactions, setL2Transactions] = useState<L2Transaction[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [l1Balance, setL1Balance] = useState(10);
  const [l2Balance, setL2Balance] = useState(0);
  const [batchProgress, setBatchProgress] = useState(0);
  const [stats, setStats] = useState({ l1TxCount: 0, l2TxCount: 0, saved: 0 });

  const L1_TX_COST = 5; // Условные единицы
  const L2_TX_COST = 0.1;
  const BATCH_SIZE = 5;

  // Автоматическое создание батчей
  useEffect(() => {
    if (l2Transactions.length > 0 && l2Transactions.length % BATCH_SIZE === 0) {
      const unbatchedTxs = l2Transactions.slice(-BATCH_SIZE);
      const newBatch: Batch = {
        id: batches.length + 1,
        transactions: unbatchedTxs,
        status: 'pending'
      };
      setBatches([...batches, newBatch]);
      
      // Симуляция отправки на L1
      setTimeout(() => {
        setBatches(prev => prev.map(b => 
          b.id === newBatch.id ? { ...b, status: 'submitted', proof: `0x${Math.random().toString(16).slice(2, 10)}` } : b
        ));
      }, 2000);
      
      // Симуляция финализации
      setTimeout(() => {
        setBatches(prev => prev.map(b => 
          b.id === newBatch.id ? { ...b, status: 'finalized' } : b
        ));
      }, 5000);
    }
  }, [l2Transactions.length]);

  // Прогресс до следующего батча
  useEffect(() => {
    const pending = l2Transactions.length % BATCH_SIZE;
    setBatchProgress((pending / BATCH_SIZE) * 100);
  }, [l2Transactions.length]);

  const depositToL2 = () => {
    if (l1Balance < 1) return;
    setL1Balance(l1Balance - 1);
    setL2Balance(l2Balance + 1);
    setStats({ ...stats, l1TxCount: stats.l1TxCount + 1 });
  };

  const withdrawToL1 = () => {
    if (l2Balance < 1) return;
    setL2Balance(l2Balance - 1);
    // Задержка вывода (как в реальных роллапах)
    setTimeout(() => {
      setL1Balance(l1Balance + 1);
    }, 3000);
    setStats({ ...stats, l1TxCount: stats.l1TxCount + 1 });
  };

  const makeL2Transaction = () => {
    if (l2Balance < 0.01) return;
    
    const tx: L2Transaction = {
      id: `tx_${Date.now()}`,
      from: '0x7a3b...',
      to: `0x${Math.random().toString(16).slice(2, 6)}...`,
      amount: 0.01,
      timestamp: Date.now()
    };
    
    setL2Transactions([...l2Transactions, tx]);
    setStats({ 
      ...stats, 
      l2TxCount: stats.l2TxCount + 1,
      saved: stats.saved + (L1_TX_COST - L2_TX_COST)
    });
  };

  return (
    <div className="space-y-6">
      {/* Balances */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="bg-blue-500/5 border-blue-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Layers className="h-4 w-4" />
              L1 (Ethereum Mainnet)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold">{l1Balance} ETH</p>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  Комиссия: ~{L1_TX_COST}$ / tx
                </p>
              </div>
              <Button onClick={depositToL2} disabled={l1Balance < 1} size="sm">
                <ArrowDown className="h-4 w-4 mr-1" />
                Депозит
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-500/5 border-purple-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Zap className="h-4 w-4" />
              L2 (Rollup)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold">{l2Balance.toFixed(2)} ETH</p>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  Комиссия: ~{L2_TX_COST}$ / tx
                </p>
              </div>
              <div className="flex gap-2">
                <Button onClick={makeL2Transaction} disabled={l2Balance < 0.01} size="sm" variant="secondary">
                  <Plus className="h-4 w-4 mr-1" />
                  Tx
                </Button>
                <Button onClick={withdrawToL1} disabled={l2Balance < 1} size="sm" variant="outline">
                  <ArrowUp className="h-4 w-4 mr-1" />
                  Вывод
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Batch progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm">До следующего батча: {l2Transactions.length % BATCH_SIZE} / {BATCH_SIZE}</span>
            <Badge variant="outline">{batches.length} батчей</Badge>
          </div>
          <Progress value={batchProgress} className="h-3" />
        </CardContent>
      </Card>

      {/* L2 Transactions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Box className="h-5 w-5" />
            L2 Транзакции
            <Badge variant="secondary">{l2Transactions.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {l2Transactions.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Сделайте транзакцию на L2, чтобы увидеть как работает батчинг
            </p>
          ) : (
            <div className="max-h-40 overflow-y-auto space-y-1">
              {l2Transactions.slice(-10).reverse().map((tx, i) => (
                <div key={tx.id} className="flex items-center justify-between p-2 bg-muted/50 rounded text-sm">
                  <span className="font-mono text-xs">{tx.from} → {tx.to}</span>
                  <Badge variant="outline">{tx.amount} ETH</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Batches */}
      {batches.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Батчи на L1
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {batches.slice(-5).reverse().map(batch => (
                <div key={batch.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div>
                    <span className="font-medium">Batch #{batch.id}</span>
                    <p className="text-xs text-muted-foreground">
                      {batch.transactions.length} транзакций
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {batch.proof && (
                      <Badge variant="outline" className="font-mono text-xs">
                        proof: {batch.proof}
                      </Badge>
                    )}
                    <Badge className={
                      batch.status === 'finalized' 
                        ? 'bg-green-500' 
                        : batch.status === 'submitted' 
                          ? 'bg-yellow-500' 
                          : 'bg-muted'
                    }>
                      {batch.status === 'finalized' ? 'Финализирован' : 
                       batch.status === 'submitted' ? 'На L1' : 'Ожидание'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="text-center">
          <CardContent className="pt-6">
            <p className="text-2xl font-bold text-blue-500">{stats.l1TxCount}</p>
            <p className="text-xs text-muted-foreground">L1 транзакций</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <p className="text-2xl font-bold text-purple-500">{stats.l2TxCount}</p>
            <p className="text-xs text-muted-foreground">L2 транзакций</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <p className="text-2xl font-bold text-green-500">${stats.saved.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground">Сэкономлено</p>
          </CardContent>
        </Card>
      </div>

      {/* Education */}
      <div className="p-4 rounded-xl bg-accent/50 border">
        <h4 className="font-semibold mb-2">💡 Как работают Rollups?</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• <strong>L2</strong> — быстрый слой для транзакций (низкие комиссии)</li>
          <li>• Транзакции группируются в <strong>батчи</strong></li>
          <li>• Батч + доказательство отправляются на <strong>L1</strong></li>
          <li>• <strong>Безопасность L1</strong> гарантирует данные L2</li>
          <li>• <strong>Вывод</strong> занимает время (challenge period)</li>
        </ul>
      </div>
    </div>
  );
}
