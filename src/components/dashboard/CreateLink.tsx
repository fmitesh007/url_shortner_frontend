import { useState } from "react";
import { urlApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Copy, Check, Loader2, Plus } from "lucide-react";

interface Props {
  onCreated: () => void;
  isDemo?: boolean;
}

export default function CreateLink({ onCreated, isDemo }: Props) {
  const [originalUrl, setOriginalUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [loading, setLoading] = useState(false);
  const [createdUrl, setCreatedUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isDemo) {
      const alias = customAlias || Math.random().toString(36).slice(2, 8);
      setCreatedUrl(`https://snip.link/${alias}`);
      toast({ title: "Demo: Link created!" });
      setOriginalUrl("");
      setCustomAlias("");
      setExpiresAt("");
      return;
    }
    setLoading(true);
    try {
      const res = await urlApi.create({
        originalUrl,
        customAlias: customAlias || undefined,
        expiresAt: expiresAt || undefined,
      });
      setCreatedUrl(res.data.shortUrl || res.data.shortCode);
      toast({ title: "Link created!" });
      setOriginalUrl("");
      setCustomAlias("");
      setExpiresAt("");
      onCreated();
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to create link";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const copyUrl = async () => {
    if (!createdUrl) return;
    await navigator.clipboard.writeText(createdUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-lg space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="originalUrl">Destination URL</Label>
          <Input
            id="originalUrl"
            type="url"
            placeholder="https://example.com/very-long-url"
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
            required
            className="rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="alias">Custom Alias (optional)</Label>
          <Input
            id="alias"
            placeholder="my-link"
            value={customAlias}
            onChange={(e) => setCustomAlias(e.target.value)}
            className="rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="expires">Expiry Date (optional)</Label>
          <Input
            id="expires"
            type="date"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
            className="rounded-xl"
            min={new Date().toISOString().split("T")[0]}
          />
        </div>
        <Button type="submit" className="w-full rounded-xl" disabled={loading}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
          Shorten URL
        </Button>
      </form>

      {createdUrl && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-xl border bg-card p-4"
        >
          <p className="mb-2 text-sm font-medium text-muted-foreground">Your short link</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 truncate rounded-lg bg-muted px-3 py-2 text-sm font-medium">
              {createdUrl}
            </code>
            <Button variant="outline" size="icon" className="rounded-xl" onClick={copyUrl}>
              {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
