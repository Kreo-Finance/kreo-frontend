import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Coins, TrendingUp, ShieldCheck, BarChart3,
  Store, Wallet, Settings, LogOut, User
} from "lucide-react";

const creatorLinks = [
  { label: "Overview", href: "/creator/dashboard", icon: LayoutDashboard },
  { label: "My Offerings", href: "/creator/offerings", icon: Coins },
  { label: "Analytics", href: "/creator/analytics", icon: BarChart3 },
  { label: "Bond Status", href: "/creator/bond", icon: ShieldCheck },
];

const investorLinks = [
  { label: "Portfolio", href: "/investor/portfolio", icon: TrendingUp },
  { label: "Marketplace", href: "/marketplace", icon: Store },
  { label: "Earnings", href: "/investor/earnings", icon: Wallet },
];

const DashboardSidebar = ({ type }: { type: "creator" | "investor" }) => {
  const location = useLocation();
  const links = type === "creator" ? creatorLinks : investorLinks;

  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-white/10 bg-card/30 glass-morphism min-h-screen pt-16 sticky top-0">
      <div className="p-6 border-b border-white/10">
        <Link to="/" className="font-display text-2xl font-bold text-gradient-hero">CREO</Link>
        <p className="mt-1 font-body text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{type} WORKSPACE</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {links.map((link) => {
          const active = location.pathname === link.href;
          return (
            <Link
              key={link.href}
              to={link.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 font-body text-sm transition-all duration-300 group ${
                active
                  ? "bg-creo-pink/10 text-creo-pink font-bold shadow-[0_0_20px_rgba(255,51,153,0.1)] border border-creo-pink/20"
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground border border-transparent"
              }`}
            >
              <link.icon className={`h-4 w-4 transition-transform duration-300 group-hover:scale-110 ${active ? "text-creo-pink" : "text-muted-foreground group-hover:text-creo-teal"}`} />
              <span className="tracking-wide">{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10 space-y-1">
        <Link
          to="/settings"
          className="flex items-center gap-3 rounded-xl px-4 py-3 font-body text-sm text-muted-foreground hover:bg-white/5 hover:text-foreground transition-all group"
        >
          <Settings className="h-4 w-4 group-hover:rotate-45 transition-transform duration-500" />
          Settings
        </Link>
        <button className="flex items-center gap-3 rounded-xl px-4 py-3 font-body text-sm text-muted-foreground hover:bg-white/5 hover:text-creo-pink transition-all w-full group">
          <LogOut className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Disconnect
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
