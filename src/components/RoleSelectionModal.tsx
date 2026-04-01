import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { TrendingUp, Paintbrush, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/store/authStore";
import type { UserRole } from "@/types";

interface RoleSelectionModalProps {
  open: boolean;
  onClose: () => void;
}

const ROLES = [
  {
    id: "creator" as UserRole,
    title: "Creator",
    description:
      "Tokenize your creative work, build your community, and attract investors who believe in your vision.",
    icon: Paintbrush,
    requirements: ["Sumsub identity KYC", "Connect Stripe or AdSense"],
    badge: "Standard KYC",
    gradient: "from-creo-pink/20 to-violet-500/10",
    ring: "ring-creo-pink/50",
    border: "border-creo-pink/20 hover:border-creo-pink/50",
  },
  {
    id: "investor" as UserRole,
    title: "Investor",
    description:
      "Discover and invest in high-potential creators. Earn yield-backed returns from creator tokens.",
    icon: TrendingUp,
    requirements: ["Sumsub identity KYC", "Accreditation verification"],
    badge: "Accredited",
    gradient: "from-creo-teal/20 to-emerald-500/10",
    ring: "ring-creo-teal/50",
    border: "border-creo-teal/20 hover:border-creo-teal/50",
  },
  {
    id: "both" as UserRole,
    title: "Creator + Investor",
    description:
      "Unlock the full Kreo experience — create your own offerings while investing in others.",
    icon: Sparkles,
    requirements: ["All creator requirements", "All investor requirements"],
    badge: "Full Access",
    gradient: "from-creo-yellow/20 to-orange-500/10",
    ring: "ring-creo-yellow/50",
    border: "border-creo-yellow/20 hover:border-creo-yellow/50",
  },
] as const;

export function RoleSelectionModal({ open, onClose }: RoleSelectionModalProps) {
  const navigate = useNavigate();
  const { setSelectedRole } = useAuthStore();
  const [selected, setSelected] = useState<UserRole | null>(null);

  const handleContinue = () => {
    if (!selected) return;
    setSelectedRole(selected);
    onClose();
    // Investor path first — accreditation takes longer
    if (selected === "creator") {
      navigate("/onboarding/creator");
    } else {
      navigate("/onboarding/investor");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl bg-background/95 backdrop-blur-xl border-white/10">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-2xl font-display font-bold">
            Choose your role
          </DialogTitle>
          <DialogDescription className="font-body text-muted-foreground">
            Select how you want to participate on Kreo. You can unlock additional roles later.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 mt-2">
          {ROLES.map((role) => {
            const Icon = role.icon;
            const isSelected = selected === role.id;
            return (
              <motion.button
                key={role.id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => setSelected(role.id)}
                className={`relative w-full text-left rounded-xl border p-4 transition-all bg-gradient-to-r ${role.gradient} ${role.border} ${
                  isSelected ? `ring-2 ${role.ring}` : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-lg bg-white/5 p-2 flex-shrink-0">
                    <Icon className="h-4 w-4 text-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-display font-semibold text-sm text-foreground">
                        {role.title}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {role.badge}
                      </Badge>
                    </div>
                    <p className="font-body text-xs text-muted-foreground leading-relaxed mb-2">
                      {role.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {role.requirements.map((req) => (
                        <span
                          key={req}
                          className="text-xs text-muted-foreground bg-white/5 rounded px-2 py-0.5 border border-white/10"
                        >
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div
                    className={`mt-1 h-4 w-4 rounded-full border-2 flex-shrink-0 transition-all ${
                      isSelected ? "border-primary bg-primary" : "border-border"
                    }`}
                  />
                </div>
              </motion.button>
            );
          })}
        </div>

        <div className="flex justify-end gap-3 mt-2">
          <Button variant="ghost" onClick={onClose} className="font-body text-sm">
            Cancel
          </Button>
          <Button
            onClick={handleContinue}
            disabled={!selected}
            className="bg-gradient-hero font-body text-sm font-semibold text-primary-foreground hover:opacity-90 px-6"
          >
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
