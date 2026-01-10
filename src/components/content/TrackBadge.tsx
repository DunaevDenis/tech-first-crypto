import { Cpu, Wallet, ArrowLeftRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { TRACKS } from "@/lib/types";

type TrackId = keyof typeof TRACKS;

interface TrackBadgeProps {
  track: TrackId;
  size?: 'sm' | 'md';
}

const icons = {
  technology: Cpu,
  wallets: Wallet,
  exchanges: ArrowLeftRight
};

export default function TrackBadge({ track, size = 'md' }: TrackBadgeProps) {
  const config = TRACKS[track];
  const Icon = icons[track];

  return (
    <Badge 
      variant="outline" 
      className={cn(
        `track-badge-${track}`,
        size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1'
      )}
    >
      <Icon className={cn("mr-1.5", size === 'sm' ? 'h-3 w-3' : 'h-4 w-4')} />
      {config.name}
    </Badge>
  );
}
