mport {
  AGENT_TEMPLATES,
      type AgentTemplate,
      getTemplateById,
      RouteId,
    } from "@shared";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

import { hasAnyAgentTypeReadPermission } from "@/auth";
import { ApiError, constructResponseSchema } from "@/types";

// ===== Exported route plugin =====

const agentTemplateRoutes: FastifyPluginAsyncZod = async (fastify) => {
    fastify.get(
          "/api/agent-templates",
      {
              schema: {
                        operationId: RouteId.GetAgentTemplates,
                        description:
                                    "Get all pre-built agent templates from the template catalog",
                        tags: ["Agent Templates"],
                        querystring: z.object({
                                    category: z
                                      .string()
                                      .optional()
                                      .describe(
                                                      "Filter templates by category (e.g. engineering, research, data)",
                                                    ),
                        }),
                        response: constructResponseSchema(z.array(AgentTemplateSchema)),
              },
      },
          async ({ query: { category }, user, organizationId }, reply) => {
                  const hasRead = await hasAnyAgentTypeReadPermission({
                            userId: user.id,
                            organizationId,
                  });
                  if (!hasRead) {
                            throw new ApiError(403, "Forbidden");
                  }

            const templates = category
                    ? AGENT_TEMPLATES.filter((t) => t.category === category)
                      : AGENT_TEMPLATES;

            return reply.send(templates);
          },
        );

    fastify.get(
          "/api/agent-templates/:id",
      {
              schema: {
                        operationId: RouteId.GetAgentTemplateById,
                        description: "Get a specific agent template by its ID",
                        tags: ["Agent Templates"],
                        params: z.object({
                                    id: z.string().describe("The template ID"),
                        }),
                        response: constructResponseSchema(AgentTemplateSchema),
              },
      },
          async ({ params: { id }, user, organizationId }, reply) => {
                  const hasRead = await hasAnyAgentTypeReadPermission({
                            userId: user.id,
                            organizationId,
                  });
                  if (!hasRead) {
                            throw new ApiError(403, "Forbidden");
                  }

            const template = getTemplateById(id);
                  if (!template) {
                            throw new ApiError(404, "Agent template not found");
                  }

            return reply.send(template);
          },
        );
};

export default agentTemplateRoutes;

// ===== Internal helpers =====

const AgentTemplateMcpServerSchema = z.object({
    name: z.string(),
    packageName: z.string().optional(),
    description: z.string(),
});

const AgentTemplateSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    longDescription: z.string().optional(),
    category: z.enum([
          "productivity",
          "engineering",
          "research",
          "data",
          "security",
          "communication",
          "devops",
        ]),
    icon: z.string(),
    systemPrompt: z.string(),
    recommendedModel: z.string().optional(),
    suggestedMcpServers: z.array(AgentTemplateMcpServerSchema),
    suggestedPrompts: z.array(
          z.object({
                  title: z.string(),
                  text: z.string(),
          }),
        ),
    tags: z.array(z.string()),
}) satisfies z.ZodType<AgentTemplate>;
