import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background relative overflow-hidden">
      {/* Background Blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 top-1/4 h-[400px] w-[400px] rounded-full bg-creo-teal/10 blur-[100px] animate-pulse-slow" />
        <div className="absolute -right-20 bottom-1/4 h-[500px] w-[500px] rounded-full bg-creo-pink/10 blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 text-center glass-card p-12 rounded-3xl max-w-md mx-4">
        <h1 className="font-display text-8xl font-extrabold text-gradient-hero mb-4">404</h1>
        <p className="font-display text-2xl font-bold text-foreground mb-2">Lost in space?</p>
        <p className="font-body text-muted-foreground mb-8 font-medium">The page you're looking for has drifted beyond our orbit.</p>
        <a 
          href="/" 
          className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-gradient-hero font-display text-sm font-bold text-primary-foreground hover:shadow-glow-pink transition-all duration-300"
        >
          Return to Home Base
        </a>
      </div>
    </div>
  );
};

export default NotFound;
