import { Link } from "react-router-dom";
import { useMemo } from "react";
import type { ContentBlock, GlossaryTerm } from "@/lib/types";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import Callout from "./Callout";
import { cn } from "@/lib/utils";
import { useGlossaryTerms } from "@/hooks/useGlossary";

interface ContentRendererProps {
  blocks: ContentBlock[];
}

export default function ContentRenderer({ blocks }: ContentRendererProps) {
  const { data: glossaryTerms } = useGlossaryTerms();
  const glossaryBySlug = useMemo(() => {
    return new Map((glossaryTerms || []).map(term => [term.slug, term]));
  }, [glossaryTerms]);

  return (
    <div className="prose-crypto">
      {blocks.map((block, index) => (
        <ContentBlockComponent key={index} block={block} glossaryBySlug={glossaryBySlug} />
      ))}
    </div>
  );
}

function ContentBlockComponent({
  block,
  glossaryBySlug
}: {
  block: ContentBlock;
  glossaryBySlug: Map<string, GlossaryTerm>;
}) {
  switch (block.type) {
    case 'heading':
      const HeadingTag = `h${block.level}` as 'h1' | 'h2' | 'h3';
      return (
        <HeadingTag className={cn(
          block.level === 2 && "text-2xl font-semibold mt-12 mb-6",
          block.level === 3 && "text-xl font-semibold mt-8 mb-4"
        )}>
          {block.text}
        </HeadingTag>
      );

    case 'paragraph':
      if (block.glossaryTermRefs?.length) {
        const glossaryTerms = block.glossaryTermRefs
          .map(slug => glossaryBySlug.get(slug))
          .filter((term): term is GlossaryTerm => Boolean(term));

        return (
          <p className="text-lg leading-8 mb-6 text-foreground/90">
            {renderGlossaryText(block.text, glossaryTerms)}
          </p>
        );
      }

      return (
        <p className="text-lg leading-8 mb-6 text-foreground/90">
          {block.text}
        </p>
      );

    case 'callout':
      return (
        <Callout type={block.calloutType}>
          {block.body}
        </Callout>
      );

    case 'figure':
      if (block.figureType === 'interactive' && block.refSlug) {
        return (
          <div className="my-8 rounded-xl border bg-muted/30 p-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-3">Интерактивная демонстрация</p>
              <Link 
                to={`/interactives/${block.refSlug}`}
                className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
              >
                Открыть интерактив →
              </Link>
            </div>
            {block.caption && (
              <p className="text-sm text-muted-foreground text-center mt-4">{block.caption}</p>
            )}
          </div>
        );
      }

      if (block.figureType === 'image' && block.src) {
        return (
          <figure className="my-8">
            <img 
              src={block.src} 
              alt={block.caption || ''} 
              className="rounded-xl w-full"
              loading="lazy"
            />
            {block.caption && (
              <figcaption className="text-sm text-muted-foreground text-center mt-3">
                {block.caption}
              </figcaption>
            )}
          </figure>
        );
      }

      // Placeholder for SVG/diagram
      return (
        <div className="my-8 rounded-xl border bg-muted/30 p-8 text-center">
          <div className="text-muted-foreground text-sm">
            [Иллюстрация: {block.caption || 'Диаграмма'}]
          </div>
        </div>
      );

    case 'list':
      const ListTag = block.ordered ? 'ol' : 'ul';
      return (
        <ListTag className={cn(
          "my-6 ml-6 space-y-2",
          block.ordered ? "list-decimal" : "list-disc"
        )}>
          {block.items.map((item, i) => (
            <li key={i} className="text-lg leading-relaxed text-foreground/90 pl-2">
              {item}
            </li>
          ))}
        </ListTag>
      );

    default:
      return null;
  }
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function renderGlossaryText(text: string, terms: GlossaryTerm[]) {
  if (!terms.length) return text;

  const termMap = new Map(terms.map(term => [term.term.toLowerCase(), term]));
  const pattern = terms
    .map(term => term.term)
    .sort((a, b) => b.length - a.length)
    .map(escapeRegExp)
    .join("|");

  if (!pattern) return text;

  const regex = new RegExp(`(${pattern})`, "gi");
  const parts = text.split(regex);

  return parts.map((part, index) => {
    const term = termMap.get(part.toLowerCase());
    if (!term) return part;

    return (
      <Tooltip key={`${term.slug}-${index}`}>
        <TooltipTrigger asChild>
          <span className="glossary-term">{part}</span>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <div className="space-y-2">
            <p className="font-semibold">{term.term}</p>
            <p className="text-xs text-muted-foreground">{term.short_def}</p>
            <Link to={`/glossary/${term.slug}`} className="text-xs text-primary hover:underline">
              Открыть термин
            </Link>
          </div>
        </TooltipContent>
      </Tooltip>
    );
  });
}
