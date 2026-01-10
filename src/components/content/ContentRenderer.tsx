import { Link } from "react-router-dom";
import type { ContentBlock } from "@/lib/types";
import Callout from "./Callout";
import { cn } from "@/lib/utils";

interface ContentRendererProps {
  blocks: ContentBlock[];
}

export default function ContentRenderer({ blocks }: ContentRendererProps) {
  return (
    <div className="prose-crypto">
      {blocks.map((block, index) => (
        <ContentBlockComponent key={index} block={block} />
      ))}
    </div>
  );
}

function ContentBlockComponent({ block }: { block: ContentBlock }) {
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
