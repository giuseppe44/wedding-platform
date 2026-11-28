import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Calendar, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import { GentiLunaBrand } from "@/components/GentiLunaLogo";
import { BLOG_POSTS, getBlogPostBySlug } from "@/data/blogPosts";

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) {
    return { title: "Articolo non trovato" };
  }

  return {
    title: post.seoTitle,
    description: post.metaDescription,
    keywords: post.keywords,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      type: "article",
      locale: "it_IT",
      url: `https://www.gentiluna.com/blog/${post.slug}`,
      title: post.seoTitle,
      description: post.metaDescription,
      publishedTime: post.publishedAt,
      images: [
        {
          url: post.image,
          width: 1200,
          height: 670,
          alt: post.imageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.seoTitle,
      description: post.metaDescription,
      images: [post.image],
    },
  };
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = BLOG_POSTS.filter((p) => p.slug !== post.slug)
    .sort((a, b) => (a.audience === post.audience ? -1 : b.audience === post.audience ? 1 : 0))
    .slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: post.title,
        description: post.metaDescription,
        image: `https://www.gentiluna.com${post.image}`,
        datePublished: post.publishedAt,
        dateModified: post.publishedAt,
        inLanguage: "it-IT",
        author: {
          "@type": "Organization",
          name: "GentiLuna",
          url: "https://www.gentiluna.com",
        },
        publisher: {
          "@type": "Organization",
          name: "GentiLuna",
          url: "https://www.gentiluna.com",
          logo: {
            "@type": "ImageObject",
            url: "https://www.gentiluna.com/icons/icon-512.png",
          },
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `https://www.gentiluna.com/blog/${post.slug}`,
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://www.gentiluna.com",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Blog",
            item: "https://www.gentiluna.com/blog",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: post.title,
            item: `https://www.gentiluna.com/blog/${post.slug}`,
          },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#faf9f8] font-sans text-stone-900 flex flex-col overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-stone-200/80 px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <Link href="/" className="shrink-0">
            <GentiLunaBrand theme="light" size="md" />
          </Link>
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm font-medium">
            <Link href="/blog" className="inline-flex items-center gap-1.5 text-stone-700 hover:text-rose-600 font-semibold px-3 py-1.5 rounded-full bg-stone-100">
              <ArrowLeft className="w-3.5 h-3.5" /> Tutti gli Articoli
            </Link>
            <Link href="/funzioni-sposi" className="hidden md:inline-block text-stone-600 hover:text-stone-900">
              Funzioni Sposi
            </Link>
            <Link href="/funzioni-professionisti" className="hidden md:inline-block text-stone-600 hover:text-stone-900">
              Funzioni Pro
            </Link>
            <Link href="/login">
              <Button className="rounded-full bg-stone-900 hover:bg-stone-800 text-white font-semibold px-5 h-9 text-xs sm:text-sm">
                Accedi
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ARTICLE HEADER */}
      <article className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-10 sm:py-16">
        <div className="mb-8 space-y-4">
          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-stone-500">
            <span
              className={`px-3 py-1 rounded-full uppercase tracking-wider font-bold ${
                post.audience === "PROFESSIONISTI"
                  ? "bg-amber-100 text-amber-900"
                  : post.audience === "SPOSI"
                  ? "bg-rose-100 text-rose-700"
                  : "bg-emerald-100 text-emerald-800"
              }`}
            >
              {post.category}
            </span>
            <span className="inline-flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <time dateTime={post.publishedAt}>
                {new Date(post.publishedAt).toLocaleDateString("it-IT", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </time>
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Lettura {post.readTime}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-stone-900 leading-tight">
            {post.title}
          </h1>

          <p className="text-lg sm:text-xl text-stone-600 font-light leading-relaxed">
            {post.excerpt}
          </p>
        </div>

        {/* HERO IMAGE */}
        <div className="rounded-3xl overflow-hidden shadow-xl border border-stone-200/80 mb-12 aspect-[16/9] bg-stone-200">
          <img
            src={post.image}
            alt={post.imageAlt}
            className="w-full h-full object-cover"
          />
        </div>

        {/* BODY SECTIONS */}
        <div className="space-y-10 bg-white rounded-3xl p-6 sm:p-10 md:p-12 border border-stone-200/80 shadow-sm">
          {post.sections.map((section, idx) => (
            <section key={idx} className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 leading-snug">
                {section.heading}
              </h2>
              {section.paragraphs.map((p, pIdx) => (
                <p key={pIdx} className="text-base sm:text-lg text-stone-700 leading-relaxed font-light">
                  {p}
                </p>
              ))}
              {section.bullets && section.bullets.length > 0 && (
                <ul className="space-y-3 pt-2">
                  {section.bullets.map((bullet, bIdx) => (
                    <li key={bIdx} className="flex items-start gap-3 text-stone-700 text-sm sm:text-base">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          {/* CTA FOOTER INSIDE ARTICLE */}
          <div className="mt-10 pt-8 border-t border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-serif font-bold text-stone-900">
                Pronto a mettere in pratica questa guida?
              </h3>
              <p className="text-sm text-stone-500 mt-1">
                Scopri subito gli strumenti di GentiLuna pensati per la tua esigenza.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 w-full sm:w-auto">
              <Link href={post.ctaHref} className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto min-h-11 h-auto py-2.5 px-5 rounded-full bg-stone-900 hover:bg-stone-800 text-white font-semibold whitespace-normal text-center">
                  <span>{post.ctaLabel}</span>
                  <ArrowRight className="w-4 h-4 ml-1.5 shrink-0" />
                </Button>
              </Link>
              <Link href={post.secondaryCtaHref} className="w-full sm:w-auto">
                <Button variant="outline" className="w-full sm:w-auto min-h-11 h-auto py-2.5 px-5 rounded-full border-stone-300 whitespace-normal text-center">
                  {post.secondaryCtaLabel}
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* RELATED ARTICLES */}
        <section className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-serif font-bold text-stone-900">Altri articoli utili per te</h2>
            <Link href="/blog" className="text-sm font-semibold text-rose-600 hover:underline">
              Vedi tutti (15)
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((rel) => (
              <Link
                key={rel.slug}
                href={`/blog/${rel.slug}`}
                className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group"
              >
                <div className="aspect-[16/9] bg-stone-100 overflow-hidden">
                  <img
                    src={rel.image}
                    alt={rel.imageAlt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600">
                    {rel.category}
                  </span>
                  <h3 className="font-serif font-bold text-stone-900 text-base leading-snug group-hover:text-rose-600 transition-colors line-clamp-2">
                    {rel.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </article>

      <Footer />
    </div>
  );
}
