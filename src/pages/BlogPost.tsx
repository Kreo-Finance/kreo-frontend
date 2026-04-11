import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Tag, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import blogs from "@/data/blogs.json";

type ContentBlock =
  | { type: "paragraph"; content: string }
  | { type: "heading"; content: string }
  | { type: "list"; items: string[] }
  | { type: "callout"; content: string };

const categoryColors: Record<string, string> = {
  "Creator Finance": "bg-creo-pink/10 text-creo-pink border-creo-pink/20",
  "Protocol Deep Dive": "bg-creo-teal/10 text-creo-teal border-creo-teal/20",
  Industry: "bg-creo-yellow/10 text-creo-yellow border-creo-yellow/20",
};

const gradientBorderColors: Record<string, string> = {
  "Creator Finance": "border-creo-pink/50",
  "Protocol Deep Dive": "border-creo-teal/50",
  Industry: "border-creo-yellow/50",
};

const ContentRenderer = ({ block }: { block: ContentBlock }) => {
  switch (block.type) {
    case "paragraph":
      return (
        <p className="font-body text-base leading-relaxed text-foreground/85">
          {block.content}
        </p>
      );
    case "heading":
      return (
        <h2 className="font-display text-xl font-bold text-foreground md:text-2xl">
          {block.content}
        </h2>
      );
    case "list":
      return (
        <ul className="space-y-2">
          {block.items.map((item, i) => (
            <li
              key={i}
              className="flex gap-3 font-body text-base text-foreground/85"
            >
              <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-creo-pink" />
              {item}
            </li>
          ))}
        </ul>
      );
    case "callout":
      return (
        <blockquote className="rounded-xl border-l-4 border-creo-pink bg-creo-pink/5 px-6 py-4">
          <p className="font-display text-base font-semibold italic text-foreground">
            {block.content}
          </p>
        </blockquote>
      );
    default:
      return null;
  }
};

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = blogs.find((b) => b.slug === slug);

  if (!post) return <Navigate to="/blog" replace />;

  const currentIndex = blogs.findIndex((b) => b.slug === slug);
  const nextPost = blogs[currentIndex + 1] ?? blogs[0];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero banner */}
      <div
        className={`w-full h-64 md:h-80 bg-gradient-to-br ${post.gradient} relative overflow-hidden`}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-8 right-8 w-48 h-48 rounded-full border-2 border-white" />
          <div className="absolute bottom-8 left-8 w-32 h-32 rounded-full border border-white" />
          <div className="absolute top-1/3 left-1/3 w-16 h-16 rounded-full border border-white" />
        </div>
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 pb-8">
            <Link
              to="/blog"
              className="mb-4 inline-flex items-center gap-1.5 font-body text-sm text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Blog
            </Link>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 pb-24">
        <div className="mx-auto max-w-2xl">
          {/* Article header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="-mt-8 relative z-10"
          >
            <div className="glass-card rounded-2xl border border-border p-8 md:p-10">
              <div className="flex flex-wrap items-center gap-3 mb-5">
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
                <span className="font-body text-xs text-muted-foreground">
                  {new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>

              <h1 className="font-display text-2xl font-bold leading-snug md:text-4xl">
                {post.title}
              </h1>
              <p className="mt-4 font-body text-base text-muted-foreground leading-relaxed">
                {post.excerpt}
              </p>

              <div className="mt-6 flex items-center gap-3 border-t border-border pt-6">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-creo-pink to-creo-teal font-display text-sm font-bold text-white">
                  K
                </div>
                <div>
                  <p className="font-display text-sm font-semibold text-foreground">
                    {post.author.name}
                  </p>
                  <p className="font-body text-xs text-muted-foreground">
                    {post.author.role}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Article body */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-10 space-y-6"
          >
            {(post.content as ContentBlock[]).map((block, i) => (
              <ContentRenderer key={i} block={block} />
            ))}
          </motion.div>

          {/* Next post CTA */}
          {nextPost && nextPost.slug !== slug && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-16"
            >
              <p className="mb-3 font-body text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Read next
              </p>
              <Link to={`/blog/${nextPost.slug}`} className="group block">
                <div
                  className={`glass-card rounded-2xl border ${
                    gradientBorderColors[nextPost.category] ?? "border-border"
                  } p-6 hover:opacity-90 transition-opacity`}
                >
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-body text-xs font-semibold mb-3 ${
                      categoryColors[nextPost.category] ??
                      "bg-muted text-muted-foreground border-border"
                    }`}
                  >
                    <Tag className="h-3 w-3" />
                    {nextPost.category}
                  </span>
                  <h3 className="font-display text-lg font-bold leading-snug group-hover:text-gradient-hero transition-all">
                    {nextPost.title}
                  </h3>
                  <div className="mt-3 flex items-center gap-1.5 font-body text-sm font-semibold text-creo-pink group-hover:gap-3 transition-all">
                    Read article <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            </motion.div>
          )}
        </div>
      </main>

      <FooterSection />
    </div>
  );
};

export default BlogPost;
