import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import Layout from "@/components/layout/Layout";
import ContentRenderer from "@/components/content/ContentRenderer";
import TrackBadge from "@/components/content/TrackBadge";
import MobileSectionNav from "@/components/layout/MobileSectionNav";
import ReadingProgress from "@/components/ReadingProgress";
import TextSelectionPopover from "@/components/highlights/TextSelectionPopover";
import HighlightsList from "@/components/highlights/HighlightsList";
import { Button } from "@/components/ui/button";
import { useChapterBySlug, useSections, useChaptersWithSections } from "@/hooks/useChapters";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

export default function Reader() {
  const { chapterSlug, sectionSlug } = useParams();
  const { user } = useAuth();
  const [highlightRefreshKey, setHighlightRefreshKey] = useState(0);
  
  const { data: chapter, isLoading: chapterLoading } = useChapterBySlug(chapterSlug);
  const { data: sections } = useSections(chapter?.id);
  const { data: allChapters } = useChaptersWithSections();

  const currentSection = sectionSlug 
    ? sections?.find(s => s.slug === sectionSlug)
    : sections?.[0];

  const currentSectionIndex = sections?.findIndex(s => s.id === currentSection?.id) ?? 0;
  const prevSection = sections?.[currentSectionIndex - 1];
  const nextSection = sections?.[currentSectionIndex + 1];

  // Find next/prev chapters
  const currentChapterIndex = allChapters?.findIndex(c => c.id === chapter?.id) ?? -1;
  const prevChapter = allChapters?.[currentChapterIndex - 1];
  const nextChapter = allChapters?.[currentChapterIndex + 1];

  if (chapterLoading) {
    return (
      <Layout>
        <div className="py-20 text-center">
          <div className="animate-pulse">Загрузка...</div>
        </div>
      </Layout>
    );
  }

  if (!chapter) {
    return (
      <Layout>
        <div className="py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Глава не найдена</h1>
          <Button asChild>
            <Link to="/read">Вернуться к учебнику</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout hideFooter>
      <ReadingProgress />
      {currentSection && (
        <TextSelectionPopover 
          sectionId={currentSection.id} 
          userId={user?.id}
          onSaved={() => setHighlightRefreshKey(k => k + 1)}
        />
      )}
      <div className="flex min-h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <aside className="hidden lg:block w-80 border-r bg-sidebar shrink-0">
          <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto p-6">
            <Link to="/read" className="text-sm text-muted-foreground hover:text-foreground mb-6 inline-flex items-center gap-1">
              <ChevronLeft className="h-4 w-4" />
              Все главы
            </Link>
            
            <div className="mt-4 mb-6">
              <TrackBadge track={chapter.track as 'technology' | 'wallets' | 'exchanges'} size="sm" />
            </div>
            
            <h2 className="font-semibold text-lg mb-4">{chapter.title}</h2>
            
            <nav className="space-y-1">
              {sections?.map((section, i) => (
                <Link
                  key={section.id}
                  to={`/read/${chapter.slug}/${section.slug}`}
                  className={cn(
                    "block px-3 py-2 rounded-lg text-sm transition-colors",
                    section.id === currentSection?.id
                      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  {i + 1}. {section.title}
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">
          <article className="content-width py-8 sm:py-12">
            {/* Mobile navigation */}
            <div className="lg:hidden mb-6 space-y-4">
              <Link 
                to="/read" 
                className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                Все главы
              </Link>
              
              {sections && sections.length > 1 && (
                <MobileSectionNav
                  chapter={chapter}
                  sections={sections}
                  currentSection={currentSection}
                />
              )}
            </div>

            {currentSection ? (
              <>
                <header className="mb-8 sm:mb-12">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
                    {currentSection.title}
                  </h1>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      ~{Math.ceil((currentSection.content_json?.length || 3) * 2)} мин чтения
                    </span>
                  </div>
                </header>

                <ContentRenderer blocks={currentSection.content_json || []} />

                {/* Highlights list */}
                <HighlightsList 
                  sectionId={currentSection.id} 
                  userId={user?.id}
                  refreshKey={highlightRefreshKey}
                />

                {/* Navigation */}
                <nav className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t flex flex-col sm:flex-row justify-between gap-3 sm:gap-4">
                  {prevSection ? (
                    <Button variant="outline" asChild className="flex-1 justify-start h-auto py-3">
                      <Link to={`/read/${chapter.slug}/${prevSection.slug}`}>
                        <ChevronLeft className="h-4 w-4 mr-2 shrink-0" />
                        <span className="truncate">{prevSection.title}</span>
                      </Link>
                    </Button>
                  ) : prevChapter ? (
                    <Button variant="outline" asChild className="flex-1 justify-start h-auto py-3">
                      <Link to={`/read/${prevChapter.slug}`}>
                        <ChevronLeft className="h-4 w-4 mr-2 shrink-0" />
                        <span className="truncate">{prevChapter.title}</span>
                      </Link>
                    </Button>
                  ) : <div className="hidden sm:block" />}
                  
                  {nextSection ? (
                    <Button asChild className="flex-1 justify-end h-auto py-3">
                      <Link to={`/read/${chapter.slug}/${nextSection.slug}`}>
                        <span className="truncate">{nextSection.title}</span>
                        <ChevronRight className="h-4 w-4 ml-2 shrink-0" />
                      </Link>
                    </Button>
                  ) : nextChapter ? (
                    <Button asChild className="flex-1 justify-end h-auto py-3">
                      <Link to={`/read/${nextChapter.slug}`}>
                        <span className="truncate">{nextChapter.title}</span>
                        <ChevronRight className="h-4 w-4 ml-2 shrink-0" />
                      </Link>
                    </Button>
                  ) : null}
                </nav>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Секция не найдена</p>
              </div>
            )}
          </article>
        </main>
      </div>
    </Layout>
  );
}
