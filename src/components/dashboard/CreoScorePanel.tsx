import { useState } from "react";
import { motion } from "framer-motion";
import { Share2, Trophy, ChevronRight } from "lucide-react";
import CreoScoreBadge from "@/components/ui/CreoScoreBadge";
import ShareModal from "@/components/shared/ShareModal";
import { Button } from "@/components/ui/button";

type TierNumber = 0 | 1 | 2 | 3;

interface TierMeta {
  name: string;
  start: number;
  end: number;
  barColor: string;
}

const TIERS: Record<TierNumber, TierMeta> = {
  0: { name: "Newcomer",    start: 0,   end: 99,  barColor: "bg-muted-foreground" },
  1: { name: "Established", start: 100, end: 299, barColor: "bg-creo-teal" },
  2: { name: "Trusted",     start: 300, end: 599, barColor: "bg-creo-teal" },
  3: { name: "Elite",       start: 600, end: 999, barColor: "bg-creo-yellow" },
};

const NEXT_TIER: Record<TierNumber, TierNumber | null> = {
  0: 1,
  1: 2,
  2: 3,
  3: null,
};

const EARN_POINTS = [
  { label: "Complete current offering",    pts: "+50 pts" },
  { label: "Each month above floor yield", pts: "+5 pts/mo" },
  { label: "Zero missed settlements",      pts: "+20 pts" },
  { label: "Strong investor ROI bonus",    pts: "+15 pts" },
];

const ELITE_UNLOCKS = [
  "Settlement fee: 1% instead of 3%",
  "Gold Elite badge on marketplace",
  "Featured placement on homepage",
  "Institutional investor introductions",
];

const AVG_POINTS_PER_OFFERING = 80;
const AVG_OFFERING_MONTHS = 6;

interface CreoScorePanelProps {
  score?: number;
  creatorAddress?: string;
}

const CreoScorePanel = ({ score = 347, creatorAddress = "" }: CreoScorePanelProps) => {
  const [shareOpen, setShareOpen] = useState(false);

  // Determine current tier
  const tier: TierNumber =
    score >= 600 ? 3 :
    score >= 300 ? 2 :
    score >= 100 ? 1 : 0;

  const tierMeta = TIERS[tier];
  const nextTierNum = NEXT_TIER[tier];
  const nextTierMeta = nextTierNum !== null ? TIERS[nextTierNum] : null;

  const progressPct =
    tier === 3
      ? 100
      : Math.min(
          100,
          Math.round(
            ((score - tierMeta.start) / (tierMeta.end - tierMeta.start + 1)) *
              100
          )
        );

  const pointsNeeded = nextTierMeta ? nextTierMeta.start - score : 0;
  const estimatedMonths =
    pointsNeeded > 0
      ? Math.ceil((pointsNeeded / AVG_POINTS_PER_OFFERING) * AVG_OFFERING_MONTHS)
      : 0;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="rounded-xl border border-border bg-card p-6"
      >
        {/* Title row */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-lg font-semibold text-foreground">
            Your CreoScore
          </h2>
          <CreoScoreBadge tier={tier} size="md" />
        </div>

        {/* Score + tier label */}
        <div className="flex items-end gap-3 mb-5">
          <span className="font-display text-5xl font-bold text-foreground leading-none">
            {score}
          </span>
          <span className="font-body text-base text-muted-foreground mb-1">
            {tierMeta.name} Creator
          </span>
        </div>

        {/* Progress bar */}
        {tier < 3 ? (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="font-body text-xs text-muted-foreground">
                {tierMeta.name} → {nextTierMeta?.name}
              </span>
              <span className="font-body text-xs text-muted-foreground">
                {pointsNeeded} pts to go
              </span>
            </div>
            <div
              role="progressbar"
              aria-valuenow={progressPct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`CreoScore progress: ${progressPct}% toward ${nextTierMeta?.name}`}
              className="h-2.5 rounded-full bg-muted overflow-hidden"
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
                className={`h-full rounded-full ${tierMeta.barColor}`}
              />
            </div>
            <div className="flex justify-between mt-1.5">
              <span className="font-body text-xs text-muted-foreground">
                {score}
              </span>
              <span className="font-body text-xs text-muted-foreground">
                {nextTierMeta?.start}
              </span>
            </div>
          </div>
        ) : (
          <div className="mb-6 flex items-center gap-2 rounded-lg bg-creo-yellow/10 border border-creo-yellow/20 px-4 py-3">
            <Trophy className="h-4 w-4 text-creo-yellow shrink-0" />
            <span className="font-body text-sm font-medium text-creo-yellow">
              Maximum tier reached
            </span>
          </div>
        )}

        <div className="space-y-5">
          {/* How to earn points */}
          <div>
            <p className="font-display text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              How to Earn Points
            </p>
            <ul className="space-y-2">
              {EARN_POINTS.map(({ label, pts }) => (
                <li
                  key={label}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-creo-teal text-sm">✓</span>
                    <span className="font-body text-sm text-foreground">
                      {label}
                    </span>
                  </div>
                  <span className="font-body text-xs font-medium text-creo-teal ml-4 shrink-0">
                    {pts}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* What unlocks at Elite */}
          {tier < 3 && (
            <div>
              <p className="font-display text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                What Unlocks at Elite (600+)
              </p>
              <ul className="space-y-2">
                {ELITE_UNLOCKS.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <ChevronRight className="h-3.5 w-3.5 text-creo-yellow shrink-0 mt-0.5" />
                    <span className="font-body text-sm text-muted-foreground">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Estimated timeline */}
          {tier < 3 && estimatedMonths > 0 && (
            <div className="rounded-lg bg-muted/60 border border-border px-4 py-3">
              <p className="font-body text-sm text-foreground">
                <span className="font-semibold">
                  Estimated timeline: ~{estimatedMonths} months
                </span>
              </p>
              <p className="font-body text-xs text-muted-foreground mt-0.5">
                Based on current offering performance
              </p>
            </div>
          )}

          {/* Share button */}
          <Button
            variant="outline"
            className="w-full border-border hover:border-creo-pink/40 hover:text-creo-pink gap-2"
            onClick={() => setShareOpen(true)}
          >
            <Share2 className="h-4 w-4" />
            <span className="font-body text-sm">Share my CreoScore</span>
          </Button>
        </div>
      </motion.div>

      <ShareModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        score={score}
        tier={tier}
        tierName={tierMeta.name}
        creatorAddress={creatorAddress}
      />
    </>
  );
};

export default CreoScorePanel;
