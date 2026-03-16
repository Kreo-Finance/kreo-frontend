import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Coins, TrendingUp, ShieldCheck, BarChart3,
  Store, Wallet, Settings, LogOut, Menu
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

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

const SidebarContent = ({ type, onNavigate }: { type: "creator" | "investor", onNavigate?: () => void }) => {
  const location = useLocation();
  const links = type === "creator" ? creatorLinks : investorLinks;

  return (
    <>
      <div className="p-6 border-b border-border">
        <Link to="/" className="font-display text-xl font-bold text-gradient-hero" onClick={onNavigate}>CREO</Link>
        <p className="mt-1 font-body text-xs text-muted-foreground capitalize">{type} Dashboard</p>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const active = location.pathname === link.href;
          return (
            <Link
              key={link.href}
              to={link.href}
              onClick={onNavigate}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 font-body text-sm transition-colors ${active
                  ? "bg-creo-pink/10 text-creo-pink font-medium"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border space-y-1">
        <Link
          to="/settings"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 font-body text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <Settings className="h-4 w-4" />
          Settings
        </Link>
        <button className="flex items-center gap-3 rounded-lg px-3 py-2.5 font-body text-sm text-muted-foreground hover:bg-muted hover:text-foreground w-full">
          <LogOut className="h-4 w-4" />
          Disconnect
        </button>
      </div>
    </>
  );
};

const DashboardSidebar = ({ type }: { type: "creator" | "investor" }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile Top Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 border-b border-border bg-background/80 backdrop-blur-md z-50 flex items-center justify-between px-4">
        <Link to="/" className="font-display text-xl font-bold text-gradient-hero">CREO</Link>
        
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-foreground">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0 bg-sidebar-background border-r border-border flex flex-col">
            <SidebarContent type={type} onNavigate={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-border bg-card min-h-screen sticky top-0">
        <SidebarContent type={type} />
      </aside>
    </>
  );
};

export default DashboardSidebar;
