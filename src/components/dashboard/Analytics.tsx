import { useState, useEffect } from "react";
import { urlApi, AnalyticsData, ShortUrl } from "@/lib/api";
import { DEMO_ANALYTICS } from "@/lib/demo-data";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { BarChart3, Globe, Smartphone } from "lucide-react";

const COLORS = [
  "hsl(340, 60%, 65%)",
  "hsl(340, 40%, 50%)",
  "hsl(200, 60%, 55%)",
  "hsl(145, 50%, 45%)",
  "hsl(35, 80%, 55%)",
  "hsl(270, 50%, 60%)",
];

interface Props {
  urls: ShortUrl[];
  initialShortCode?: string;
  isDemo?: boolean;
}

export default function AnalyticsTab({ urls, initialShortCode, isDemo }: Props) {
  const [selectedCode, setSelectedCode] = useState(initialShortCode || "");
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (initialShortCode) setSelectedCode(initialShortCode);
  }, [initialShortCode]);

  useEffect(() => {
    if (!selectedCode) return;
    if (isDemo) {
      setData(DEMO_ANALYTICS[selectedCode] || { totalClicks: 0, devices: [], countries: [] });
      return;
    }
    setLoading(true);
    urlApi
      .analytics(selectedCode)
      .then((res) => setData(res.data))
      .catch(() => toast({ title: "Error", description: "Failed to load analytics", variant: "destructive" }))
      .finally(() => setLoading(false));
  }, [selectedCode, isDemo]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="max-w-xs">
        <Select value={selectedCode} onValueChange={setSelectedCode}>
          <SelectTrigger className="rounded-xl">
            <SelectValue placeholder="Select a link" />
          </SelectTrigger>
          <SelectContent>
            {urls.map((u) => (
              <SelectItem key={u._id} value={u.shortCode}>
                {u.shortCode}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {!selectedCode && (
        <div className="flex flex-col items-center py-16 text-center text-muted-foreground">
          <BarChart3 className="mb-3 h-10 w-10" />
          <p>Select a link to view its analytics</p>
        </div>
      )}

      {loading && (
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      )}

      {data && !loading && (
        <>
          <div className="rounded-xl border bg-card p-6 text-center">
            <p className="text-sm text-muted-foreground">Total Clicks</p>
            <p className="text-4xl font-bold">{data.totalClicks}</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Devices */}
            <div className="rounded-xl border bg-card p-4">
              <div className="mb-4 flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-semibold">Devices</h3>
              </div>
              {data.devices.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={data.devices}>
                    <XAxis dataKey="device" tick={{ fontSize: 12 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                      {data.devices.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="py-10 text-center text-sm text-muted-foreground">No device data</p>
              )}
            </div>

            {/* Countries */}
            <div className="rounded-xl border bg-card p-4">
              <div className="mb-4 flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-semibold">Countries</h3>
              </div>
              {data.countries.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={data.countries} dataKey="count" nameKey="country" cx="50%" cy="50%" outerRadius={80} label>
                      {data.countries.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="py-10 text-center text-sm text-muted-foreground">No country data</p>
              )}
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}
