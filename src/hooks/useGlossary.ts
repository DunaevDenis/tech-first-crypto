import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { GlossaryTerm } from "@/lib/types";

export function useGlossaryTerms() {
  return useQuery({
    queryKey: ['glossary-terms'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('glossary_terms')
        .select('*')
        .order('term');
      
      if (error) throw error;
      
      return (data || []).map(term => ({
        ...term,
        related_terms: (term.related_terms as string[]) || [],
        linked_sections: (term.linked_sections as string[]) || []
      })) as GlossaryTerm[];
    }
  });
}

export function useGlossaryTermBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: ['glossary-term', slug],
    queryFn: async () => {
      if (!slug) return null;
      
      const { data, error } = await supabase
        .from('glossary_terms')
        .select('*')
        .eq('slug', slug)
        .single();
      
      if (error) throw error;
      
      return {
        ...data,
        related_terms: (data.related_terms as string[]) || [],
        linked_sections: (data.linked_sections as string[]) || []
      } as GlossaryTerm;
    },
    enabled: !!slug
  });
}

export function useGlossaryCategories() {
  return useQuery({
    queryKey: ['glossary-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('glossary_terms')
        .select('category');
      
      if (error) throw error;
      
      const categories = [...new Set((data || []).map(t => t.category))];
      return categories.sort();
    }
  });
}
