import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, Tag } from "lucide-react";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import blogs from "@/data/blogs.json";

const categoryColors: Record<string, string> = {
  "Creator Finance": "bg-creo-pink/10 text-creo-pink border-creo-pink/20",
  "Protocol Deep Dive": "bg-creo-teal/10 text-creo-teal border-creo-teal/20",
  Industry: "bg-creo-yellow/10 text-creo-yellow border-creo-yellow/20",
};

const CoverIllustration = ({
  icon,
  gradient,
}: {
  icon: string;
  gradient: string;
}) => {
  const icons: Record<string, JSX.Element> = {
    bank: (
      <svg viewBox="0 0 80 80" className="w-16 h-16 opacity-90" fill="none">
        <rect
          x="10"
          y="35"
          width="60"
          height="30"
          rx="3"
          fill="white"
          fillOpacity="0.25"
        />
        <rect
          x="18"
          y="42"
          width="8"
          height="16"
          rx="1"
          fill="white"
          fillOpacity="0.5"
        />
        <rect
          x="36"
          y="42"
          width="8"
          height="16"
          rx="1"
          fill="white"
          fillOpacity="0.5"
        />
        <rect
          x="54"
          y="42"
          width="8"
          height="16"
          rx="1"
          fill="white"
          fillOpacity="0.5"
        />
        <polygon points="40,10 70,35 10,35" fill="white" fillOpacity="0.4" />
        <rect
          x="8"
          y="65"
          width="64"
          height="5"
          rx="2"
          fill="white"
          fillOpacity="0.5"
        />
        <circle cx="40" cy="22" r="4" fill="white" fillOpacity="0.8" />
      </svg>
    ),
    chart: (
      <svg viewBox="0 0 80 80" className="w-16 h-16 opacity-90" fill="none">
        <polyline
          points="10,60 22,40 34,50 46,25 58,35 70,15"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeOpacity="0.8"
        />
        <circle cx="10" cy="60" r="3" fill="white" fillOpacity="0.9" />
        <circle cx="22" cy="40" r="3" fill="white" fillOpacity="0.9" />
        <circle cx="34" cy="50" r="3" fill="white" fillOpacity="0.9" />
        <circle cx="46" cy="25" r="3" fill="white" fillOpacity="0.9" />
        <circle cx="58" cy="35" r="3" fill="white" fillOpacity="0.9" />
        <circle cx="70" cy="15" r="3" fill="white" fillOpacity="0.9" />
        <line
          x1="10"
          y1="65"
          x2="70"
          y2="65"
          stroke="white"
          strokeWidth="2"
          strokeOpacity="0.4"
        />
        <line
          x1="10"
          y1="15"
          x2="10"
          y2="65"
          stroke="white"
          strokeWidth="2"
          strokeOpacity="0.4"
        />
      </svg>
    ),
    globe: (
      <svg viewBox="0 0 80 80" className="w-16 h-16 opacity-90" fill="none">
        <circle
          cx="40"
          cy="40"
          r="28"
          stroke="white"
          strokeWidth="2.5"
          strokeOpacity="0.6"
        />
        <ellipse
          cx="40"
          cy="40"
          rx="14"
          ry="28"
          stroke="white"
          strokeWidth="2"
          strokeOpacity="0.5"
        />
        <line
          x1="12"
          y1="40"
          x2="68"
          y2="40"
          stroke="white"
          strokeWidth="2"
          strokeOpacity="0.4"
        />
        <line
          x1="16"
          y1="28"
          x2="64"
          y2="28"
          stroke="white"
          strokeWidth="1.5"
          strokeOpacity="0.3"
        />
        <line
          x1="16"
          y1="52"
          x2="64"
          y2="52"
          stroke="white"
          strokeWidth="1.5"
          strokeOpacity="0.3"
        />
        <circle cx="40" cy="40" r="4" fill="white" fillOpacity="0.8" />
      </svg>
    ),
  };

  return (
    <div
      className={`w-full h-48 bg-gradient-to-br ${gradient} flex items-center justify-center relative overflow-hidden`}
    >
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 right-4 w-24 h-24 rounded-full border border-white" />
        <div className="absolute bottom-4 left-4 w-16 h-16 rounded-full border border-white" />
        <div className="absolute top-1/2 left-1/4 w-8 h-8 rounded-full border border-white" />
      </div>
      {icons[icon]}
    </div>
  );
};

const Blog = () => {
  const featured = blogs[blogs.length - 1];
  const rest = blogs.slice(0, blogs.length - 1);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 pt-28 pb-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-14 text-center"
        >
          <span className="inline-block mb-3 rounded-full border border-creo-pink/30 bg-creo-pink/10 px-4 py-1 font-body text-xs font-semibold uppercase tracking-widest text-creo-pink">
            Kreo Blog
          </span>
          <h1 className="font-display text-4xl font-bold md:text-5xl">
            Insights for the{" "}
            <span className="text-gradient-hero">Creator Economy</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl font-body text-base text-muted-foreground">
            Deep dives on creator finance, protocol mechanics, and the future of
            on-chain revenue sharing.
          </p>
        </motion.div>

        {/* Featured post */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-12"
        >
          <Link to={`/blog/${featured.slug}`} className="group block">
            <div className="glass-card overflow-hidden rounded-2xl border border-border hover:border-creo-pink/40 transition-colors duration-300">
              <div className="grid md:grid-cols-2">
                <div
                  className={`h-64 md:h-auto bg-gradient-to-br ${featured.gradient} flex items-center justify-center relative overflow-hidden`}
                >
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-6 right-6 w-32 h-32 rounded-full border border-white" />
                    <div className="absolute bottom-6 left-6 w-20 h-20 rounded-full border border-white" />
                  </div>
                  <svg
                    viewBox="0 0 80 80"
                    className="w-20 h-20 opacity-90"
                    fill="none"
                  >
                    <circle
                      cx="40"
                      cy="40"
                      r="28"
                      stroke="white"
                      strokeWidth="2.5"
                      strokeOpacity="0.6"
                    />
                    <ellipse
                      cx="40"
                      cy="40"
                      rx="14"
                      ry="28"
                      stroke="white"
                      strokeWidth="2"
                      strokeOpacity="0.5"
                    />
                    <line
                      x1="12"
                      y1="40"
                      x2="68"
                      y2="40"
                      stroke="white"
                      strokeWidth="2"
                      strokeOpacity="0.4"
                    />
                    <line
                      x1="16"
                      y1="28"
                      x2="64"
                      y2="28"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeOpacity="0.3"
                    />
                    <line
                      x1="16"
                      y1="52"
                      x2="64"
                      y2="52"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeOpacity="0.3"
                    />
                    <circle
                      cx="40"
                      cy="40"
                      r="4"
                      fill="white"
                      fillOpacity="0.8"
                    />
                  </svg>
                  <div className="absolute top-4 left-4">
                    <span className="rounded-full bg-white/20 backdrop-blur-sm px-3 py-1 font-body text-xs font-semibold text-white">
                      Latest
                    </span>
                  </div>
                </div>
                <div className="flex flex-col justify-center p-8 md:p-10">
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-body text-xs font-semibold ${
                        categoryColors[featured.category] ??
                        "bg-muted text-muted-foreground border-border"
                      }`}
                    >
                      <Tag className="h-3 w-3" />
                      {featured.category}
                    </span>
                    <span className="flex items-center gap-1 font-body text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {featured.readTime}
                    </span>
                  </div>
                  <h2 className="font-display text-2xl font-bold leading-snug group-hover:text-gradient-hero transition-all duration-300 md:text-3xl">
                    {featured.title}
                  </h2>
                  <p className="mt-3 font-body text-sm text-muted-foreground line-clamp-3">
                    {featured.excerpt}
                  </p>
                  <div className="mt-6 flex items-center justify-between">
                    <span className="font-body text-xs text-muted-foreground">
                      {new Date(featured.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                    <span className="flex items-center gap-1.5 font-body text-sm font-semibold text-creo-pink group-hover:gap-2.5 transition-all duration-200">
                      Read article <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Post grid */}
        <div className="grid gap-6 sm:grid-cols-2">
          {rest.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.08 }}
            >
              <Link to={`/blog/${post.slug}`} className="group block h-full">
                <div className="glass-card flex h-full flex-col overflow-hidden rounded-2xl border border-border hover:border-creo-teal/40 transition-colors duration-300">
                  <CoverIllustration
                    icon={post.coverIcon}
                    gradient={post.gradient}
                  />
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-body text-xs font-semibold ${
                          categoryColors[post.category] ??
                          "bg-muted text-muted-foreground border-border"
                        }`}
                      >
                        <Tag className="h-3 w-3" />
                        {post.category}
                      </span>
                      <span className="flex items-center gap-1 font-body text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {post.readTime}
                      </span>
                    </div>
                    <h2 className="font-display text-lg font-bold leading-snug group-hover:text-gradient-hero transition-all duration-300">
                      {post.title}
                    </h2>
                    <p className="mt-2 flex-1 font-body text-sm text-muted-foreground line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                      <span className="font-body text-xs text-muted-foreground">
                        {new Date(post.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                      <span className="flex items-center gap-1.5 font-body text-sm font-semibold text-creo-teal group-hover:gap-2.5 transition-all duration-200">
                        Read <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </main>

      <FooterSection />
    </div>
  );
};

export default Blog;
