import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Chapter, Section, ContentBlock } from "@/lib/types";

export function useChapters() {
  return useQuery({
    queryKey: ['chapters'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('chapters')
        .select('*')
        .order('order_num');
      
      if (error) throw error;
      return data as Chapter[];
    }
  });
}

export function useChapterBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: ['chapter', slug],
    queryFn: async () => {
      if (!slug) return null;
      
      const { data, error } = await supabase
        .from('chapters')
        .select('*')
        .eq('slug', slug)
        .single();
      
      if (error) throw error;
      return data as Chapter;
    },
    enabled: !!slug
  });
}

export function useSections(chapterId: string | undefined) {
  return useQuery({
    queryKey: ['sections', chapterId],
    queryFn: async () => {
      if (!chapterId) return [];
      
      const { data, error } = await supabase
        .from('sections')
        .select('*')
        .eq('chapter_id', chapterId)
        .order('order_num');
      
      if (error) throw error;
      
      // Parse content_json properly
      return (data || []).map(section => ({
        ...section,
        content_json: (section.content_json as unknown as ContentBlock[]) || []
      })) as Section[];
    },
    enabled: !!chapterId
  });
}

export function useSectionBySlug(chapterSlug: string | undefined, sectionSlug: string | undefined) {
  return useQuery({
    queryKey: ['section', chapterSlug, sectionSlug],
    queryFn: async () => {
      if (!chapterSlug || !sectionSlug) return null;
      
      // First get the chapter
      const { data: chapter, error: chapterError } = await supabase
        .from('chapters')
        .select('id')
        .eq('slug', chapterSlug)
        .single();
      
      if (chapterError) throw chapterError;
      
      // Then get the section
      const { data: section, error: sectionError } = await supabase
        .from('sections')
        .select('*')
        .eq('chapter_id', chapter.id)
        .eq('slug', sectionSlug)
        .single();
      
      if (sectionError) throw sectionError;
      
      return {
        ...section,
        content_json: (section.content_json as unknown as ContentBlock[]) || []
      } as Section;
    },
    enabled: !!chapterSlug && !!sectionSlug
  });
}

export function useChaptersWithSections() {
  return useQuery({
    queryKey: ['chapters-with-sections'],
    queryFn: async () => {
      const { data: chapters, error: chaptersError } = await supabase
        .from('chapters')
        .select('*')
        .order('order_num');
      
      if (chaptersError) throw chaptersError;
      
      const { data: sections, error: sectionsError } = await supabase
        .from('sections')
        .select('*')
        .order('order_num');
      
      if (sectionsError) throw sectionsError;
      
      // Group sections by chapter
      const chaptersWithSections = (chapters || []).map(chapter => ({
        ...chapter,
        sections: (sections || [])
          .filter(s => s.chapter_id === chapter.id)
          .map(s => ({
            ...s,
            content_json: (s.content_json as unknown as ContentBlock[]) || []
          }))
      }));
      
      return chaptersWithSections as (Chapter & { sections: Section[] })[];
    }
  });
}
