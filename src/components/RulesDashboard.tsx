import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Search,
  Shield,
  ChevronDown,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import CreateRuleForm from "./CreateRuleForm";

interface Rule {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  status: "active" | "inactive";
  priority: "high" | "medium" | "low";
}

const mockRules: Rule[] = [
  {
    id: "1",
    name: "Data Privacy Policy",
    description: "Ensure all customer data is handled according to GDPR and privacy regulations.",
    icon: Shield,
    status: "active",
    priority: "high",
  },
  {
    id: "2",
    name: "Content Moderation",
    description: "Filter inappropriate content and maintain community guidelines compliance.",
    icon: Shield,
    status: "active",
    priority: "high",
  },
  {
    id: "3",
    name: "Rate Limiting",
    description: "Prevent API abuse by limiting requests per user within specified time windows.",
    icon: Shield,
    status: "inactive",
    priority: "medium",
  },
];

export default function RulesDashboard() {
  const navigate = useNavigate();
  const [rules, setRules] = useState<Rule[]>(mockRules);
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "form">("list");

  const filteredRules = rules.filter(
    (r) =>
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateRule = (ruleData: { name: string; description: string }) => {
    const newRule: Rule = {
      id: Date.now().toString(),
      name: ruleData.name,
      description: ruleData.description,
      icon: Shield,
      status: "active",
      priority: "medium",
    };
    setRules([...rules, newRule]);
    setShowForm(false);
    setViewMode("list");
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "medium":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "low":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="h-full bg-background overflow-auto">
      {viewMode === "form" ? (
        <div className="container mx-auto px-6 py-8">
          <CreateRuleForm
            onClose={() => setViewMode("list")}
            onComplete={handleCreateRule}
          />
        </div>
      ) : (
        <>
          {showForm && (
            <CreateRuleForm
              onClose={() => setShowForm(false)}
              onComplete={handleCreateRule}
            />
          )}

          <main className="container mx-auto px-6 py-8">
            <div className="space-y-6">
              <div className="flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search rules..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    Sort by <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                  <Button onClick={() => setViewMode("form")}>
                    <Plus className="w-4 h-4 mr-2" />
                    New Rule
                  </Button>
                </div>
              </div>

              {filteredRules.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-6">
                    <Shield className="w-12 h-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No rules yet</h3>
                  <p className="text-muted-foreground max-w-md mb-6">
                    Create rules to govern AI behavior and enforce policies
                  </p>
                  <Button onClick={() => setShowForm(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Rule
                  </Button>
                </div>
              )}

              {filteredRules.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Your Rules</h2>
                    <p className="text-sm text-muted-foreground">
                      {filteredRules.length} rule{filteredRules.length !== 1 && "s"}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredRules.map((rule) => (
                      <Card
                        key={rule.id}
                        className="hover:shadow-hover transition-shadow"
                      >
                        <CardHeader>
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                              <rule.icon className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex gap-2">
                              <Badge variant="outline" className={getPriorityColor(rule.priority)}>
                                {rule.priority}
                              </Badge>
                              <Badge variant={rule.status === "active" ? "default" : "secondary"}>
                                {rule.status}
                              </Badge>
                            </div>
                          </div>
                          <CardTitle className="text-lg">{rule.name}</CardTitle>
                          <CardDescription className="line-clamp-2">
                            {rule.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1"
                              onClick={() => {
                                console.log("Edit rule:", rule.id);
                              }}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                setRules(rules.filter(r => r.id !== rule.id));
                              }}
                            >
                              Delete
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </main>
        </>
      )}
    </div>
  );
}
