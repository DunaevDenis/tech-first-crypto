import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Interactive } from "@/lib/types";

export function useInteractives() {
  return useQuery({
    queryKey: ['interactives'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('interactives')
        .select('*')
        .order('title');
      
      if (error) throw error;
      
      return (data || []).map(item => ({
        ...item,
        tags: (item.tags as string[]) || [],
        linked_sections: (item.linked_sections as string[]) || []
      })) as Interactive[];
    }
  });
}

export function useInteractiveBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: ['interactive', slug],
    queryFn: async () => {
      if (!slug) return null;
      
      const { data, error } = await supabase
        .from('interactives')
        .select('*')
        .eq('slug', slug)
        .single();
      
      if (error) throw error;
      
      return {
        ...data,
        tags: (data.tags as string[]) || [],
        linked_sections: (data.linked_sections as string[]) || []
      } as Interactive;
    },
    enabled: !!slug
  });
}
