"use client";

import {
    AGENT_TEMPLATE_CATEGORIES,
    AGENT_TEMPLATES,
    type AgentTemplate,
    type AgentTemplateCategory,
} from "@shared";
import { Bot, ChevronRight, Package, Search, Sparkles, X } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";

import { useCreateProfile } from "@/lib/agent.query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";

interface AgentTemplateCatalogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onCreated?: (agentId: string) => void;
}

export function AgentTemplateCatalog({
    open,
    onOpenChange,
    onCreated,
}: AgentTemplateCatalogProps) {
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] =
          useState<AgentTemplateCategory | null>(null);
    const [previewTemplate, setPreviewTemplate] =
          useState<AgentTemplate | null>(null);

  const templates = selectedCategory
      ? AGENT_TEMPLATES.filter((t) => t.category === selectedCategory)
        : AGENT_TEMPLATES;

  const filteredTemplates = templates.filter((t) => {
        if (!search) return true;
        const q = search.toLowerCase();
        return (
                t.name.toLowerCase().includes(q) ||
                t.description.toLowerCase().includes(q) ||
                t.tags.some((tag) => tag.toLowerCase().includes(q))
              );
  });

  const handleClose = useCallback(() => {
        setSearch("");
        setSelectedCategory(null);
        setPreviewTemplate(null);
        onOpenChange(false);
  }, [onOpenChange]);

  return (
        <>
              <Dialog open={open} onOpenChange={handleClose}>
                      <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0 gap-0">
                                <DialogHeader className="px-6 pt-6 pb-4 border-b">
                                            <div className="flex items-center gap-2">
                                                          <Sparkles className="h-5 w-5 text-primary" />
                                                          <DialogTitle>Agent Template Catalog</DialogTitle>DialogTitle>
                                            </div>div>
                                            <DialogDescription>
                                                          Browse pre-built agent templates and spin up a fully-configured
                                                          agent in one click.
                                            </DialogDescription>DialogDescription>
                                </DialogHeader>DialogHeader>
                      
                                <div className="flex flex-1 overflow-hidden">
                                            <div className="w-48 border-r flex flex-col py-3 shrink-0">
                                                          <p className="px-4 pb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                                          Categories
                                                          </p>p>
                                                          <CategoryButton
                                                                            label="All templates"
                                                                            active={selectedCategory === null}
                                                                            onClick={() => setSelectedCategory(null)}
                                                                          />
                                              {(
                          Object.keys(
                                              AGENT_TEMPLATE_CATEGORIES,
                                            ) as AgentTemplateCategory[]
                        ).map((cat) => (
                                          <CategoryButton
                                                              key={cat}
                                                              label={AGENT_TEMPLATE_CATEGORIES[cat]}
                                                              active={selectedCategory === cat}
                                                              onClick={() => setSelectedCategory(cat)}
                                                            />
                                        ))}
                                            </div>div>
                                
                                            <div className="flex flex-col flex-1 overflow-hidden">
                                                          <div className="p-4 border-b">
                                                                          <div className="relative">
                                                                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                                                            <Input
                                                                                                                  placeholder="Search templates..."
                                                                                                                  value={search}
                                                                                                                  onChange={(e) => setSearch(e.target.value)}
                                                                                                                  className="pl-9"
                                                                                                                />
                                                                            {search && (
                              <button
                                                      type="button"
                                                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                                      onClick={() => setSearch("")}
                                                    >
                                                    <X className="h-4 w-4" />
                              </button>button>
                                                                                            )}
                                                                          </div>div>
                                                          </div>div>
                                            
                                                          <ScrollArea className="flex-1">
                                                                          <div className="grid grid-cols-2 gap-3 p-4">
                                                                            {filteredTemplates.length === 0 && (
                              <div className="col-span-2 flex flex-col items-center justify-center py-16 text-muted-foreground">
                                                    <Bot className="h-12 w-12 mb-3 opacity-30" />
                                                    <p className="font-medium">No templates found</p>p>
                                                    <p className="text-sm">
                                                                            Try adjusting your search or category filter
                                                    </p>p>
                              </div>div>
                                                                                            )}
                                                                            {filteredTemplates.map((template) => (
                              <TemplateCard
                                                      key={template.id}
                                                      template={template}
                                                      onPreview={() => setPreviewTemplate(template)}
                                                      onCreated={(agentId) => {
                                                                                handleClose();
                                                                                onCreated?.(agentId);
                                                      }}
                                                    />
                            ))}
                                                                          </div>div>
                                                          </ScrollArea>ScrollArea>
                                            </div>div>
                                </div>div>
                      </DialogContent>DialogContent>
              </Dialog>Dialog>
        
          {previewTemplate && (
                  <TemplateDetailSheet
                              template={previewTemplate}
                              open={!!previewTemplate}
                              onOpenChange={(open) => {
                                            if (!open) setPreviewTemplate(null);
                              }}
                              onCreated={(agentId) => {
                                            setPreviewTemplate(null);
                                            handleClose();
                                            onCreated?.(agentId);
                              }}
                            />
                )}
        </>>
      );
}

function CategoryButton({
    label,
    active,
    onClick,
}: {
    label: string;
    active: boolean;
    onClick: () => void;
}) {
    return (
          <button
                  type="button"
                  className={`text-left px-4 py-1.5 text-sm rounded-sm mx-2 ${
                            active
                              ? "bg-primary/10 text-primary font-medium"
                              : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                  onClick={onClick}
                >
            {label}
          </button>button>
        );
}

function TemplateCard({
    template,
    onPreview,
    onCreated,
}: {
    template: AgentTemplate;
    onPreview: () => void;
    onCreated: (agentId: string) => void;
}) {
    const createAgent = useCreateProfile();
    const [isCreating, setIsCreating] = useState(false);
  
    const handleCreate = useCallback(
          async (e: React.MouseEvent) => {
                  e.stopPropagation();
                  setIsCreating(true);
                  try {
                            const agent = await createAgent.mutateAsync({
                                        name: template.name,
                                        description: template.description,
                                        systemPrompt: template.systemPrompt,
                                        agentType: "agent",
                                        scope: "personal",
                                        teams: [],
                                        knowledgeBaseIds: [],
                                        connectorIds: [],
                                        ...(template.icon && { icon: template.icon }),
                                        ...(template.suggestedPrompts?.length && {
                                                      suggestedPrompts: template.suggestedPrompts.slice(0, 3),
                                        }),
                            });
                            if (agent?.id) {
                                        toast.success(`"${template.name}" agent created successfully!`);
                                        onCreated(agent.id);
                            }
                  } catch {
                            // Errors handled in mutation callbacks
                  } finally {
                            setIsCreating(false);
                  }
          },
          [template, createAgent, onCreated],
        );
  
    return (
          <button
                  type="button"
                  className="flex flex-col text-left p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-accent/50 transition-colors"
                  onClick={onPreview}
                >
                <div className="flex items-start gap-3 mb-2">
                        <span className="text-2xl shrink-0 mt-0.5">{template.icon}</span>span>
                        <div className="flex-1 min-w-0">
                                  <h3 className="font-semibold text-sm leading-tight truncate">
                                    {template.name}
                                  </h3>h3>
                                  <Badge variant="secondary" className="mt-1 text-xs font-normal">
                                    {AGENT_TEMPLATE_CATEGORIES[template.category]}
                                  </Badge>Badge>
                        </div>div>
                </div>div>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                  {template.description}
                </p>p>
            {template.suggestedMcpServers.length > 0 && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                                    <Package className="h-3 w-3 shrink-0" />
                                    <span className="truncate">
                                      {template.suggestedMcpServers
                                                      .slice(0, 2)
                                                      .map((s) => s.name)
                                                      .join(", ")}
                                      {template.suggestedMcpServers.length > 2 &&
                                                      ` +${template.suggestedMcpServers.length - 2}`}
                                    </span>span>
                          </div>div>
                )}
                <div className="flex items-center gap-2 mt-auto pt-1">
                        <Button
                                    size="sm"
                                    className="h-7 text-xs flex-1"
                                    onClick={handleCreate}
                                    disabled={isCreating}
                                  >
                          {isCreating ? "Creating..." : "Use template"}
                        </Button>Button>
                        <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-7 text-xs px-2"
                                    onClick={(e) => {
                                                  e.stopPropagation();
                                                  onPreview();
                                    }}
                                  >
                                  <ChevronRight className="h-3 w-3" />
                        </Button>Button>
                </div>div>
          </button>button>
        );
}

function TemplateDetailSheet({
    template,
    open,
    onOpenChange,
    onCreated,
}: {
    template: AgentTemplate;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onCreated: (agentId: string) => void;
}) {
    const createAgent = useCreateProfile();
    const [isCreating, setIsCreating] = useState(false);
  
    const handleCreate = useCallback(async () => {
          setIsCreating(true);
          try {
                  const agent = await createAgent.mutateAsync({
                            name: template.name,
                            description: template.description,
                            systemPrompt: template.systemPrompt,
                            agentType: "agent",
                            scope: "personal",
                            teams: [],
                            knowledgeBaseIds: [],
                            connectorIds: [],
                            ...(template.icon && { icon: template.icon }),
                            ...(template.suggestedPrompts?.length && {
                                        suggestedPrompts: template.suggestedPrompts.slice(0, 3),
                            }),
                  });
                  if (agent?.id) {
                            toast.success(`"${template.name}" agent created successfully!`);
                            onCreated(agent.id);
                  }
          } catch {
                  // Errors handled in mutation callbacks
          } finally {
                  setIsCreating(false);
          }
    }, [template, createAgent, onCreated]);
  
    return (
          <Sheet open={open} onOpenChange={onOpenChange}>
                <SheetContent className="w-[480px] sm:max-w-[480px] flex flex-col">
                        <SheetHeader>
                                  <div className="flex items-center gap-3">
                                              <span className="text-3xl">{template.icon}</span>span>
                                              <div>
                                                            <SheetTitle>{template.name}</SheetTitle>SheetTitle>
                                                            <Badge variant="secondary" className="mt-1">
                                                              {AGENT_TEMPLATE_CATEGORIES[template.category]}
                                                            </Badge>Badge>
                                              </div>div>
                                  </div>div>
                                  <SheetDescription className="text-left">
                                    {template.longDescription ?? template.description}
                                  </SheetDescription>SheetDescription>
                        </SheetHeader>SheetHeader>
                
                        <ScrollArea className="flex-1 -mx-6 px-6">
                                  <div className="space-y-6 py-4">
                                              <div>
                                                            <h4 className="text-sm font-medium mb-2">System Prompt</h4>h4>
                                                            <pre className="text-xs text-muted-foreground bg-muted/50 rounded-md p-3 whitespace-pre-wrap font-mono leading-relaxed max-h-48 overflow-auto">
                                                              {template.systemPrompt}
                                                            </pre>pre>
                                              </div>div>
                                  
                                    {template.suggestedMcpServers.length > 0 && (
                          <div>
                                          <h4 className="text-sm font-medium mb-2">
                                                            Suggested MCP Servers
                                          </h4>h4>
                                          <div className="space-y-2">
                                            {template.suggestedMcpServers.map((server) => (
                                                <div
                                                                        key={server.name}
                                                                        className="flex items-start gap-2 p-2 rounded-md bg-muted/30 border"
                                                                      >
                                                                      <Package className="h-4 w-4 shrink-0 mt-0.5 text-muted-foreground" />
                                                                      <div>
                                                                                              <p className="text-sm font-medium">{server.name}</p>p>
                                                                                              <p className="text-xs text-muted-foreground">
                                                                                                {server.description}
                                                                                                </p>p>
                                                                        {server.packageName && (
                                                                                                  <code className="text-xs text-muted-foreground font-mono">
                                                                                                    {server.packageName}
                                                                                                    </code>code>
                                                                                              )}
                                                                      </div>div>
                                                </div>div>
                                              ))}
                                          </div>div>
                          </div>div>
                                              )}
                                  
                                    {template.suggestedPrompts.length > 0 && (
                          <div>
                                          <h4 className="text-sm font-medium mb-2">Example Prompts</h4>h4>
                                          <div className="space-y-2">
                                            {template.suggestedPrompts.map((prompt) => (
                                                <div
                                                                        key={prompt.title}
                                                                        className="p-2 rounded-md border bg-muted/20"
                                                                      >
                                                                      <p className="text-xs font-medium">{prompt.title}</p>p>
                                                                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                                                        {prompt.text}
                                                                      </p>p>
                                                </div>div>
                                              ))}
                                          </div>div>
                          </div>div>
                                              )}
                                  
                                    {template.tags.length > 0 && (
                          <div>
                                          <h4 className="text-sm font-medium mb-2">Tags</h4>h4>
                                          <div className="flex flex-wrap gap-1">
                                            {template.tags.map((tag) => (
                                                <Badge key={tag} variant="outline" className="text-xs">
                                                  {tag}
                                                </Badge>Badge>
                                              ))}
                                          </div>div>
                          </div>div>
                                              )}
                                  </div>div>
                        </ScrollArea>ScrollArea>
                
                        <div className="border-t pt-4">
                                  <Button
                                                className="w-full"
                                                onClick={handleCreate}
                                                disabled={isCreating}
                                              >
                                    {isCreating ? "Creating agent..." : "Use this template"}
                                  </Button>Button>
                                  <p className="text-xs text-muted-foreground text-center mt-2">
                                              Creates a personal agent. You can customize it afterwards.
                                  </p>p>
                        </div>div>
                </SheetContent>SheetContent>
          </Sheet>Sheet>
        );
}</>
