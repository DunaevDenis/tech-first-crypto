import { ReactNode } from "react";
import { Lightbulb, AlertTriangle, Shield, Lock, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { CALLOUT_TYPES } from "@/lib/types";

type CalloutType = keyof typeof CALLOUT_TYPES;

interface CalloutProps {
  type: CalloutType;
  title?: string;
  children: ReactNode;
}

const icons = {
  keyidea: Lightbulb,
  misconception: AlertTriangle,
  threatmodel: Shield,
  securitynote: Lock,
  tryit: Play
};

export default function Callout({ type, title, children }: CalloutProps) {
  const config = CALLOUT_TYPES[type];
  const Icon = icons[type];

  return (
    <div className={cn("callout", config.className)}>
      <div className="flex items-start gap-3">
        <Icon className="h-5 w-5 mt-0.5 shrink-0" />
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold mb-1.5">
            {title || config.title}
          </h4>
          <div className="text-sm leading-relaxed opacity-90">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
