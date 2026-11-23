"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { BlogPost } from "@/data/blogPosts";
import { ArrowRight, Clock, Heart, Briefcase, Sparkles } from "lucide-react";

export function BlogClientGrid({ posts }: { posts: BlogPost[] }) {
  const [audienceFilter, setAudienceFilter] = useState<"ALL" | "SPOSI" | "PROFESSIONISTI">("ALL");

  const visiblePosts = useMemo(() => {
    if (audienceFilter === "ALL") return posts;
    return posts.filter((p) => p.audience === audienceFilter || p.audience === "TUTTI");
  }, [posts, audienceFilter]);

  return (
    <div className="space-y-10">
      {/* FILTRI INTERATTIVI */}
      <div className="flex flex-wrap justify-center gap-2.5">
        <button
          type="button"
          onClick={() => setAudienceFilter("ALL")}
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold border transition-all cursor-pointer ${
            audienceFilter === "ALL"
              ? "bg-stone-900 text-white border-stone-900 shadow-md"
              : "bg-white text-stone-700 border-stone-200 hover:bg-stone-100"
          }`}
        >
          <Sparkles className="w-4 h-4 text-rose-400" />
          Tutti gli Articoli ({posts.length})
        </button>

        <button
          type="button"
          onClick={() => setAudienceFilter("SPOSI")}
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold border transition-all cursor-pointer ${
            audienceFilter === "SPOSI"
              ? "bg-rose-600 text-white border-rose-600 shadow-md"
              : "bg-white text-stone-700 border-stone-200 hover:bg-rose-50"
          }`}
        >
          <Heart className="w-4 h-4 text-rose-500" />
          Sposi &amp; Eventi
        </button>

        <button
          type="button"
          onClick={() => setAudienceFilter("PROFESSIONISTI")}
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold border transition-all cursor-pointer ${
            audienceFilter === "PROFESSIONISTI"
              ? "bg-amber-500 text-stone-950 border-amber-500 shadow-md"
              : "bg-white text-stone-700 border-stone-200 hover:bg-amber-50"
          }`}
        >
          <Briefcase className="w-4 h-4 text-amber-500" />
          Ristoranti, Partner &amp; Pro
        </button>
      </div>

      {/* GRIGLIA ARTICOLI */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {visiblePosts.map((post) => (
          <article
            key={post.slug}
            className="bg-white rounded-3xl border border-stone-200/80 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group hover:-translate-y-1"
          >
            <Link href={`/blog/${post.slug}`} className="block relative aspect-[16/9] overflow-hidden bg-stone-100">
              <img
                src={post.image}
                alt={post.imageAlt}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <span
                className={`absolute top-4 left-4 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm backdrop-blur-md ${
                  post.audience === "PROFESSIONISTI"
                    ? "bg-stone-900/90 text-amber-300"
                    : post.audience === "SPOSI"
                    ? "bg-white/95 text-rose-600"
                    : "bg-white/95 text-emerald-700"
                }`}
              >
                {post.category}
              </span>
            </Link>

            <div className="p-6 flex-1 flex flex-col justify-between gap-5">
              <div>
                <div className="flex items-center gap-3 text-xs text-stone-400 mb-2.5">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {post.readTime}
                  </span>
                  <span>•</span>
                  <time dateTime={post.publishedAt}>
                    {new Date(post.publishedAt).toLocaleDateString("it-IT", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </time>
                </div>

                <h2 className="text-xl font-serif font-bold text-stone-900 mb-3 leading-snug group-hover:text-rose-600 transition-colors">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>

                <p className="text-sm text-stone-600 leading-relaxed line-clamp-3 font-light">
                  {post.excerpt}
                </p>
              </div>

              <Link
                href={`/blog/${post.slug}`}
                className="inline-flex items-center gap-1.5 text-sm font-bold text-stone-900 group-hover:text-rose-600 transition-colors pt-3 border-t border-stone-100"
              >
                <span>Leggi l&apos;articolo</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
