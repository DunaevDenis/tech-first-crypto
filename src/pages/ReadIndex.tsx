import { Link } from "react-router-dom";
import { Clock, ChevronRight } from "lucide-react";
import Layout from "@/components/layout/Layout";
import TrackBadge from "@/components/content/TrackBadge";
import { useChaptersWithSections } from "@/hooks/useChapters";
import { TRACKS } from "@/lib/types";

export default function ReadIndex() {
  const { data: chapters, isLoading } = useChaptersWithSections();

  const groupedChapters = {
    technology: chapters?.filter(c => c.track === 'technology') || [],
    wallets: chapters?.filter(c => c.track === 'wallets') || [],
    exchanges: chapters?.filter(c => c.track === 'exchanges') || []
  };

  return (
    <Layout>
      <div className="py-12 md:py-20">
        <div className="wide-content">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Учебник</h1>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl">
            Полное руководство по технологии криптовалют — от основ блокчейна до безопасности кошельков
          </p>

          {isLoading ? (
            <div className="space-y-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-48 rounded-xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="space-y-16">
              {(Object.keys(TRACKS) as Array<keyof typeof TRACKS>).map(trackId => {
                const track = TRACKS[trackId];
                const trackChapters = groupedChapters[trackId];
                
                if (trackChapters.length === 0) return null;
                
                return (
                  <section key={trackId}>
                    <div className="flex items-center gap-3 mb-6">
                      <TrackBadge track={trackId} />
                      <span className="text-muted-foreground">—</span>
                      <span className="text-muted-foreground">{track.description}</span>
                    </div>
                    
                    <div className="grid gap-4">
                      {trackChapters.map(chapter => (
                        <Link
                          key={chapter.id}
                          to={`/read/${chapter.slug}`}
                          className="group p-6 rounded-xl border bg-card hover-lift"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                                {chapter.title}
                              </h3>
                              {chapter.summary && (
                                <p className="text-muted-foreground mb-3">
                                  {chapter.summary}
                                </p>
                              )}
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {chapter.reading_time} мин
                                </span>
                                <span>{chapter.sections?.length || 0} секций</span>
                              </div>
                            </div>
                            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
