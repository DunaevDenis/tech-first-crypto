import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Shield, 
  AlertTriangle, 
  Check, 
  X, 
  Infinity,
  Coins,
  Lock,
  Unlock,
  Eye,
  Trash2
} from "lucide-react";

interface Approval {
  id: string;
  token: string;
  spender: string;
  spenderName: string;
  amount: number | 'unlimited';
  risk: 'low' | 'medium' | 'high';
  timestamp: number;
}

interface Token {
  symbol: string;
  balance: number;
  name: string;
}

export default function ApprovalsSandbox() {
  const [tokens] = useState<Token[]>([
    { symbol: 'USDC', balance: 1000, name: 'USD Coin' },
    { symbol: 'WETH', balance: 5, name: 'Wrapped Ether' },
    { symbol: 'DAI', balance: 500, name: 'Dai Stablecoin' },
  ]);

  const [approvals, setApprovals] = useState<Approval[]>([
    {
      id: '1',
      token: 'USDC',
      spender: '0x1111...aaaa',
      spenderName: 'Uniswap V3',
      amount: 100,
      risk: 'low',
      timestamp: Date.now() - 86400000 * 30
    },
    {
      id: '2',
      token: 'WETH',
      spender: '0x2222...bbbb',
      spenderName: 'Unknown Contract',
      amount: 'unlimited',
      risk: 'high',
      timestamp: Date.now() - 86400000 * 7
    },
    {
      id: '3',
      token: 'DAI',
      spender: '0x3333...cccc',
      spenderName: 'Aave V3',
      amount: 'unlimited',
      risk: 'medium',
      timestamp: Date.now() - 86400000 * 14
    }
  ]);

  const [selectedToken, setSelectedToken] = useState<string>('USDC');
  const [approvalAmount, setApprovalAmount] = useState<string>('100');
  const [isUnlimited, setIsUnlimited] = useState(false);
  const [showEducation, setShowEducation] = useState(true);

  const riskColors = {
    low: 'bg-green-500/10 text-green-600 border-green-500/30',
    medium: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/30',
    high: 'bg-red-500/10 text-red-600 border-red-500/30'
  };

  const riskLabels = {
    low: 'Низкий риск',
    medium: 'Средний риск',
    high: 'Высокий риск'
  };

  const addApproval = () => {
    const amount = isUnlimited ? 'unlimited' : Number(approvalAmount);
    const risk = isUnlimited ? 'high' : Number(approvalAmount) > 500 ? 'medium' : 'low';
    
    const newApproval: Approval = {
      id: Date.now().toString(),
      token: selectedToken,
      spender: `0x${Math.random().toString(16).slice(2, 6)}...${Math.random().toString(16).slice(2, 6)}`,
      spenderName: 'Demo DApp',
      amount,
      risk,
      timestamp: Date.now()
    };
    
    setApprovals([newApproval, ...approvals]);
  };

  const revokeApproval = (id: string) => {
    setApprovals(approvals.filter(a => a.id !== id));
  };

  const revokeAll = () => {
    setApprovals([]);
  };

  const totalRisk = approvals.filter(a => a.risk === 'high').length;
  const unlimitedCount = approvals.filter(a => a.amount === 'unlimited').length;

  return (
    <div className="space-y-6">
      {/* Risk summary */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card className={totalRisk > 0 ? 'border-red-500/50 bg-red-500/5' : ''}>
          <CardContent className="pt-6 text-center">
            <AlertTriangle className={`h-8 w-8 mx-auto mb-2 ${totalRisk > 0 ? 'text-red-500' : 'text-muted-foreground'}`} />
            <p className="text-2xl font-bold">{totalRisk}</p>
            <p className="text-xs text-muted-foreground">Высокий риск</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Infinity className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
            <p className="text-2xl font-bold">{unlimitedCount}</p>
            <p className="text-xs text-muted-foreground">Безлимитных</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Coins className="h-8 w-8 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold">{approvals.length}</p>
            <p className="text-xs text-muted-foreground">Всего approvals</p>
          </CardContent>
        </Card>
      </div>

      {/* Warning */}
      {totalRisk > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Обнаружены опасные разрешения!</AlertTitle>
          <AlertDescription>
            У вас есть {totalRisk} approval(s) с высоким риском. Рекомендуем отозвать неизвестные контракты.
          </AlertDescription>
        </Alert>
      )}

      {/* Add approval demo */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Unlock className="h-5 w-5" />
            Симуляция approve()
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Попробуйте создать разрешение и посмотрите, как оценивается риск:
          </p>
          
          <div className="grid sm:grid-cols-3 gap-3">
            <div>
              <label className="text-sm font-medium mb-1 block">Токен</label>
              <div className="flex gap-2">
                {tokens.map(t => (
                  <Button
                    key={t.symbol}
                    variant={selectedToken === t.symbol ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedToken(t.symbol)}
                  >
                    {t.symbol}
                  </Button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Сумма</label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={approvalAmount}
                  onChange={(e) => setApprovalAmount(e.target.value)}
                  disabled={isUnlimited}
                  placeholder="100"
                />
                <Button
                  variant={isUnlimited ? 'destructive' : 'outline'}
                  size="sm"
                  onClick={() => setIsUnlimited(!isUnlimited)}
                  className="shrink-0"
                >
                  <Infinity className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-end">
              <Button onClick={addApproval} className="w-full">
                <Check className="h-4 w-4 mr-1" />
                Approve
              </Button>
            </div>
          </div>
          
          {isUnlimited && (
            <Alert variant="destructive" className="mt-2">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Безлимитный approve даёт контракту право потратить ВСЕ ваши токены навсегда!
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Approvals list */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Активные разрешения
            </CardTitle>
            {approvals.length > 0 && (
              <Button variant="destructive" size="sm" onClick={revokeAll}>
                <Trash2 className="h-4 w-4 mr-1" />
                Отозвать все
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {approvals.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Нет активных разрешений. Ваши токены в безопасности! 🛡️
            </p>
          ) : (
            <div className="space-y-3">
              {approvals.map(approval => (
                <div 
                  key={approval.id} 
                  className={`flex items-center justify-between p-4 rounded-lg border ${riskColors[approval.risk]}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center font-bold">
                      {approval.token.slice(0, 2)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{approval.token}</span>
                        <Badge variant="outline" className="text-xs">
                          {approval.spenderName}
                        </Badge>
                      </div>
                      <p className="text-xs opacity-70">
                        Spender: {approval.spender}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        {approval.amount === 'unlimited' ? (
                          <>
                            <Infinity className="h-4 w-4" />
                            <span className="font-medium">Unlimited</span>
                          </>
                        ) : (
                          <span className="font-medium">{approval.amount} {approval.token}</span>
                        )}
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {riskLabels[approval.risk]}
                      </Badge>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => revokeApproval(approval.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Education */}
      <div className="p-4 rounded-xl bg-accent/50 border">
        <h4 className="font-semibold mb-2 flex items-center gap-2">
          <Shield className="h-5 w-5" />
          💡 Безопасность Approvals
        </h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• <strong>Approve</strong> — разрешение контракту тратить ваши токены</li>
          <li>• <strong>Unlimited approve</strong> — максимальный риск, избегайте если возможно</li>
          <li>• Используйте <strong>revoke.cash</strong> для проверки реальных approvals</li>
          <li>• Давайте approve только на нужную сумму</li>
          <li>• Регулярно проверяйте и отзывайте старые разрешения</li>
          <li>• Неизвестный контракт + unlimited = 🚨</li>
        </ul>
      </div>
    </div>
  );
}
