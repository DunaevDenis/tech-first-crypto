import { Link } from "react-router-dom";
import { ChevronDown, List } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import TrackBadge from "@/components/content/TrackBadge";

interface Section {
  id: string;
  slug: string;
  title: string;
}

interface Chapter {
  slug: string;
  title: string;
  track: string;
}

interface MobileSectionNavProps {
  chapter: Chapter;
  sections: Section[];
  currentSection?: Section;
}

export default function MobileSectionNav({
  chapter,
  sections,
  currentSection,
}: MobileSectionNavProps) {
  const currentIndex = sections.findIndex((s) => s.id === currentSection?.id);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between h-auto py-3 px-4 text-left"
        >
          <div className="flex items-center gap-3 min-w-0">
            <List className="h-4 w-4 shrink-0 text-muted-foreground" />
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">
                Раздел {currentIndex + 1} из {sections.length}
              </p>
              <p className="font-medium truncate">{currentSection?.title}</p>
            </div>
          </div>
          <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[70vh] safe-bottom">
        <SheetHeader className="text-left pb-4 border-b">
          <div className="mb-2">
            <TrackBadge
              track={chapter.track as "technology" | "wallets" | "exchanges"}
              size="sm"
            />
          </div>
          <SheetTitle className="text-lg">{chapter.title}</SheetTitle>
        </SheetHeader>
        <nav className="py-4 overflow-y-auto max-h-[calc(70vh-120px)]">
          <div className="space-y-1">
            {sections.map((section, i) => (
              <Link
                key={section.id}
                to={`/read/${chapter.slug}/${section.slug}`}
                className={cn(
                  "flex items-start gap-3 px-3 py-3 rounded-xl text-sm transition-all active:scale-[0.98]",
                  section.id === currentSection?.id
                    ? "bg-accent text-accent-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted active:bg-muted"
                )}
              >
                <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs shrink-0">
                  {i + 1}
                </span>
                <span className="pt-0.5">{section.title}</span>
              </Link>
            ))}
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
