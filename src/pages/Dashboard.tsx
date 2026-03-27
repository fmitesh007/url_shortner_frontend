import { useState, useEffect, useCallback } from "react";
import { urlApi, ShortUrl } from "@/lib/api";
import { DEMO_URLS, isDemo } from "@/lib/demo-data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import MyLinks from "@/components/dashboard/MyLinks";
import CreateLink from "@/components/dashboard/CreateLink";
import AnalyticsTab from "@/components/dashboard/Analytics";
import { motion } from "framer-motion";
import { Link2, Plus, BarChart3 } from "lucide-react";

export default function Dashboard() {
  const [urls, setUrls] = useState<ShortUrl[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("links");
  const [analyticsCode, setAnalyticsCode] = useState<string>("");
  const demo = isDemo();

  const fetchUrls = useCallback(async () => {
    setLoading(true);
    if (demo) {
      setUrls(DEMO_URLS);
      setLoading(false);
      return;
    }
    try {
      const res = await urlApi.getAll();
      setUrls(Array.isArray(res.data) ? res.data : []);
    } catch {
      setUrls([]);
    } finally {
      setLoading(false);
    }
  }, [demo]);

  useEffect(() => {
    fetchUrls();
  }, [fetchUrls]);

  const handleViewAnalytics = (shortCode: string) => {
    setAnalyticsCode(shortCode);
    setActiveTab("analytics");
  };

  return (
    <div className="container max-w-4xl py-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-6 flex items-center gap-3">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          {demo && (
            <Badge variant="secondary" className="text-xs">
              Demo Mode
            </Badge>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 w-full justify-start rounded-xl bg-muted p-1">
            <TabsTrigger value="links" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">
              <Link2 className="mr-2 h-4 w-4" /> My Links
            </TabsTrigger>
            <TabsTrigger value="create" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">
              <Plus className="mr-2 h-4 w-4" /> Create New
            </TabsTrigger>
            <TabsTrigger value="analytics" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">
              <BarChart3 className="mr-2 h-4 w-4" /> Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="links">
            <MyLinks urls={urls} loading={loading} onRefresh={fetchUrls} onViewAnalytics={handleViewAnalytics} isDemo={demo} />
          </TabsContent>
          <TabsContent value="create">
            <CreateLink onCreated={fetchUrls} isDemo={demo} />
          </TabsContent>
          <TabsContent value="analytics">
            <AnalyticsTab urls={urls} initialShortCode={analyticsCode} isDemo={demo} />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
