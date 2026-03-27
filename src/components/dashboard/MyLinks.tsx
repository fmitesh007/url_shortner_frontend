import { useState } from "react";
import { ShortUrl, urlApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  Copy, Trash2, BarChart3, ExternalLink, Search, ArrowUpDown, Link2Off,
} from "lucide-react";

interface Props {
  urls: ShortUrl[];
  loading: boolean;
  onRefresh: () => void;
  onViewAnalytics: (shortCode: string) => void;
  isDemo?: boolean;
}

export default function MyLinks({ urls, loading, onRefresh, onViewAnalytics, isDemo }: Props) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"newest" | "clicks">("newest");
  const { toast } = useToast();

  const isExpired = (url: ShortUrl) =>
    url.expiresAt ? new Date(url.expiresAt) < new Date() : false;

  const filtered = urls
    .filter(
      (u) =>
        u.originalUrl.toLowerCase().includes(search.toLowerCase()) ||
        u.shortCode.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) =>
      sort === "newest"
        ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        : b.clicks - a.clicks
    );

  const copyUrl = async (url: string) => {
    await navigator.clipboard.writeText(url);
    toast({ title: "Copied!", description: "Short URL copied to clipboard" });
  };

  const deleteUrl = async (shortCode: string) => {
    if (isDemo) {
      toast({ title: "Demo mode", description: "Delete is disabled in demo", variant: "destructive" });
      return;
    }
    try {
      await urlApi.delete(shortCode);
      toast({ title: "Deleted", description: "Link removed successfully" });
      onRefresh();
    } catch {
      toast({ title: "Error", description: "Failed to delete link", variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-28 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (urls.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-20 text-center"
      >
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
          <Link2Off className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold">No links yet</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Create your first short link to get started
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search links..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-xl pl-9"
          />
        </div>
        <Button
          variant="outline"
          className="rounded-xl"
          onClick={() => setSort(sort === "newest" ? "clicks" : "newest")}
        >
          <ArrowUpDown className="mr-2 h-4 w-4" />
          {sort === "newest" ? "Newest" : "Most clicks"}
        </Button>
      </div>

      <AnimatePresence>
        {filtered.map((url) => (
          <motion.div
            key={url._id}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`rounded-xl border bg-card p-4 transition-shadow hover:shadow-md ${
              isExpired(url) ? "opacity-60" : ""
            }`}
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <a
                    href={url.shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-primary hover:underline"
                  >
                    {url.shortUrl}
                  </a>
                  <ExternalLink className="h-3 w-3 text-muted-foreground" />
                  <Badge variant={isExpired(url) ? "destructive" : "secondary"} className="text-xs">
                    {isExpired(url) ? "Expired" : "Active"}
                  </Badge>
                </div>
                <p className="truncate text-sm text-muted-foreground">{url.originalUrl}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{url.clicks} clicks</span>
                  <span>•</span>
                  <span>{new Date(url.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="rounded-full" onClick={() => copyUrl(url.shortUrl)}>
                  <Copy className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full" onClick={() => onViewAnalytics(url.shortCode)}>
                  <BarChart3 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full text-destructive" onClick={() => deleteUrl(url.shortCode)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
