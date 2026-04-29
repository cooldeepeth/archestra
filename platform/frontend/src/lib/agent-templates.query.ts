—import {
  AGENT_TEMPLATES,
  type AgentTemplate,
  type AgentTemplateCategory,
} from "@shared";
import { useQuery } from "@tanstack/react-query";

/**
 * Returns all agent templates from the catalog.
 * Templates are static data served from the shared package — no API call needed.
 * Using useQuery for consistent caching with the rest of the app.
 */
export function useAgentTemplates(params?: {
  category?: AgentTemplateCategory;
}) {
  return useQuery({
    queryKey: ["agent-templates", params?.category],
    queryFn: (): AgentTemplate[] => {
      if (params?.category) {
        return AGENT_TEMPLATES.filter((t) => t.category === params.category);
      }
      return AGENT_TEMPLATES;
    },
    staleTime: Number.POSITIVE_INFINITY, // Templates are static, never stale
  });
}

/**
 * Returns a single agent template by ID.
 */
export function useAgentTemplate(id: string | undefined) {
  return useQuery({
    queryKey: ["agent-templates", "by-id", id],
    queryFn: (): AgentTemplate | undefined => {
      return AGENT_TEMPLATES.find((t) => t.id === id);
    },
    enabled: !!id,
    staleTime: Number.POSITIVE_INFINITY,
  });
}
