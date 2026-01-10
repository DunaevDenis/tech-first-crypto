import { useParams, Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import Layout from "@/components/layout/Layout";
import ContentRenderer from "@/components/content/ContentRenderer";
import TrackBadge from "@/components/content/TrackBadge";
import { Button } from "@/components/ui/button";
import { useChapterBySlug, useSections, useChaptersWithSections } from "@/hooks/useChapters";
import { cn } from "@/lib/utils";

export default function Reader() {
  const { chapterSlug, sectionSlug } = useParams();
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
          <article className="content-width py-12">
            {/* Breadcrumb mobile */}
            <div className="lg:hidden mb-6">
              <Link to="/read" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
                <ChevronLeft className="h-4 w-4" />
                {chapter.title}
              </Link>
            </div>

            {currentSection ? (
              <>
                <header className="mb-12">
                  <h1 className="text-3xl md:text-4xl font-bold mb-4">
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

                {/* Navigation */}
                <nav className="mt-16 pt-8 border-t flex justify-between gap-4">
                  {prevSection ? (
                    <Button variant="outline" asChild className="flex-1 justify-start">
                      <Link to={`/read/${chapter.slug}/${prevSection.slug}`}>
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        {prevSection.title}
                      </Link>
                    </Button>
                  ) : prevChapter ? (
                    <Button variant="outline" asChild className="flex-1 justify-start">
                      <Link to={`/read/${prevChapter.slug}`}>
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        {prevChapter.title}
                      </Link>
                    </Button>
                  ) : <div />}
                  
                  {nextSection ? (
                    <Button asChild className="flex-1 justify-end">
                      <Link to={`/read/${chapter.slug}/${nextSection.slug}`}>
                        {nextSection.title}
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  ) : nextChapter ? (
                    <Button asChild className="flex-1 justify-end">
                      <Link to={`/read/${nextChapter.slug}`}>
                        {nextChapter.title}
                        <ChevronRight className="h-4 w-4 ml-2" />
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
