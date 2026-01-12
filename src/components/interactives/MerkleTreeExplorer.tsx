import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Search, CheckCircle } from "lucide-react";

// Простая хэш-функция для демонстрации
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(8, '0').slice(0, 8);
}

interface TreeNode {
  hash: string;
  left?: TreeNode;
  right?: TreeNode;
  data?: string;
  isHighlighted?: boolean;
}

export default function MerkleTreeExplorer() {
  const [transactions, setTransactions] = useState<string[]>([
    "Alice → Bob: 10 BTC",
    "Bob → Charlie: 5 BTC",
    "Charlie → Dave: 3 BTC",
    "Dave → Alice: 2 BTC"
  ]);
  const [newTx, setNewTx] = useState("");
  const [proofIndex, setProofIndex] = useState<number | null>(null);

  // Строим Merkle дерево
  const merkleTree = useMemo(() => {
    if (transactions.length === 0) return null;

    // Создаём листья
    let level: TreeNode[] = transactions.map(tx => ({
      hash: simpleHash(tx),
      data: tx
    }));

    // Если нечётное количество, дублируем последний
    if (level.length % 2 !== 0 && level.length > 1) {
      level.push({ ...level[level.length - 1] });
    }

    const tree: TreeNode[][] = [level];

    // Строим дерево снизу вверх
    while (level.length > 1) {
      const newLevel: TreeNode[] = [];
      for (let i = 0; i < level.length; i += 2) {
        const left = level[i];
        const right = level[i + 1] || left;
        newLevel.push({
          hash: simpleHash(left.hash + right.hash),
          left,
          right
        });
      }
      tree.push(newLevel);
      level = newLevel;
    }

    return tree;
  }, [transactions]);

  // Вычисляем путь доказательства
  const proofPath = useMemo(() => {
    if (proofIndex === null || !merkleTree) return [];
    
    const path: { hash: string; position: 'left' | 'right' }[] = [];
    let idx = proofIndex;
    
    for (let i = 0; i < merkleTree.length - 1; i++) {
      const level = merkleTree[i];
      const siblingIdx = idx % 2 === 0 ? idx + 1 : idx - 1;
      
      if (siblingIdx < level.length) {
        path.push({
          hash: level[siblingIdx].hash,
          position: idx % 2 === 0 ? 'right' : 'left'
        });
      }
      
      idx = Math.floor(idx / 2);
    }
    
    return path;
  }, [proofIndex, merkleTree]);

  const addTransaction = () => {
    if (newTx.trim()) {
      setTransactions([...transactions, newTx.trim()]);
      setNewTx("");
      setProofIndex(null);
    }
  };

  const removeTransaction = (index: number) => {
    setTransactions(transactions.filter((_, i) => i !== index));
    setProofIndex(null);
  };

  const isInProofPath = (hash: string) => {
    if (proofIndex === null) return false;
    return proofPath.some(p => p.hash === hash);
  };

  const isSelectedLeaf = (index: number) => proofIndex === index;

  return (
    <div className="space-y-6">
      {/* Input section */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-2 mb-4">
            <Input
              value={newTx}
              onChange={(e) => setNewTx(e.target.value)}
              placeholder="Новая транзакция (например: Eve → Frank: 1 BTC)"
              onKeyPress={(e) => e.key === 'Enter' && addTransaction()}
            />
            <Button onClick={addTransaction} disabled={!newTx.trim()}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {transactions.map((tx, i) => (
              <Badge 
                key={i} 
                variant={isSelectedLeaf(i) ? "default" : "secondary"}
                className="cursor-pointer py-1.5 px-3"
                onClick={() => setProofIndex(proofIndex === i ? null : i)}
              >
                {tx}
                <button 
                  onClick={(e) => { e.stopPropagation(); removeTransaction(i); }}
                  className="ml-2 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Merkle Tree visualization */}
      {merkleTree && (
        <div className="overflow-x-auto">
          <div className="flex flex-col items-center gap-4 min-w-[600px] py-4">
            {[...merkleTree].reverse().map((level, levelIdx) => (
              <div key={levelIdx} className="flex justify-center gap-4 w-full">
                {level.map((node, nodeIdx) => {
                  const isRoot = levelIdx === 0;
                  const isLeaf = levelIdx === merkleTree.length - 1;
                  const isHighlighted = isInProofPath(node.hash) || (isLeaf && isSelectedLeaf(nodeIdx));
                  
                  return (
                    <div
                      key={nodeIdx}
                      className={`flex flex-col items-center p-3 rounded-lg border-2 transition-all ${
                        isRoot 
                          ? 'bg-primary/10 border-primary' 
                          : isHighlighted
                            ? 'bg-yellow-500/20 border-yellow-500'
                            : 'bg-card border-border'
                      }`}
                      style={{ minWidth: isLeaf ? 160 : 100 }}
                    >
                      {isRoot && (
                        <Badge className="mb-2 bg-primary">Merkle Root</Badge>
                      )}
                      <code className={`text-xs font-mono ${isRoot ? 'text-primary font-bold' : ''}`}>
                        {node.hash}
                      </code>
                      {node.data && (
                        <p className="text-xs text-muted-foreground mt-1 text-center truncate max-w-[150px]">
                          {node.data}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Proof section */}
      {proofIndex !== null && (
        <Card className="bg-accent/30">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-4">
              <Search className="h-5 w-5 text-primary" />
              <h4 className="font-semibold">Merkle Proof для: {transactions[proofIndex]}</h4>
            </div>
            
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Чтобы доказать, что транзакция включена в блок, нужны только эти хэши:
              </p>
              
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="font-mono">
                  Лист: {simpleHash(transactions[proofIndex])}
                </Badge>
                {proofPath.map((p, i) => (
                  <Badge key={i} variant="secondary" className="font-mono bg-yellow-500/20">
                    {p.position === 'left' ? '←' : '→'} {p.hash}
                  </Badge>
                ))}
              </div>
              
              <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                <CheckCircle className="h-4 w-4" />
                <span>Proof размер: {proofPath.length + 1} хэшей из {transactions.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Education callout */}
      <div className="p-4 rounded-xl bg-accent/50 border">
        <h4 className="font-semibold mb-2">💡 Как это работает?</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Каждая транзакция хэшируется (лист дерева)</li>
          <li>• Пары хэшей объединяются и хэшируются → новый уровень</li>
          <li>• <strong>Merkle Root</strong> — единственный хэш, представляющий все транзакции</li>
          <li>• Для доказательства нужно log₂(N) хэшей, а не все N транзакций</li>
          <li>• Нажмите на транзакцию, чтобы увидеть её Merkle Proof</li>
        </ul>
      </div>
    </div>
  );
}
