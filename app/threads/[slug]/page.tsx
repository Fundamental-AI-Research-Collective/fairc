import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Sidebar from "../../components/Sidebar";
import ScrambleText from "../../components/ScrambleText";
import threads from "../../data/threads.json";
import { getThreadPosts } from "../../lib/markdown";

export async function generateStaticParams() {
  return threads.map((thread) => ({ slug: thread.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const thread = threads.find((t) => t.slug === slug);
  if (!thread) return {};
  return {
    title: thread.cardTitle,
    description: thread.summary,
  };
}

export default async function ThreadPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const thread = threads.find((t) => t.slug === slug);
  if (!thread) notFound();

  const posts = await getThreadPosts(thread.slug, thread.posts);

  const navLinks = [
    { href: "/", label: "← Return to Index" },
    ...posts.map((post, i) => ({
      href: `#post-${i + 1}`,
      label: post.title,
    })),
  ];

  const meta: [string, string, string] = [
    thread.meta[0],
    thread.meta[1],
    thread.meta[2],
  ];

  return (
    <>
      <Sidebar navLinks={navLinks} meta={meta} />

      <main>
        <header id="hero" className="hero">
          <span className="hero-label">Thread // {thread.tag}</span>
          <h1>
            <ScrambleText text={thread.pageTitle} scrambleOnMount />
          </h1>
          <p>{thread.summary}</p>
        </header>

        <section>
          <div className="section-grid">
            <div className="section-title">
              <ScrambleText
                text={`${posts.length} POST${posts.length !== 1 ? "S" : ""}`}
                className="block"
              />
            </div>
            <div className="section-content">
              {posts.map((post, i) => (
                <article key={i} id={`post-${i + 1}`} className="thread-post">
                  <header className="thread-post-header">
                    <h3>{post.title}</h3>
                    {post.date && (
                      <span className="thread-post-date">{post.date}</span>
                    )}
                  </header>
                  <div
                    className="thread-post-body prose"
                    dangerouslySetInnerHTML={{ __html: post.html }}
                  />
                </article>
              ))}
            </div>
          </div>
        </section>

        <footer>
          <div className="footer-brand">
            <div>FAIRC © 2026</div>
            <div className="footer-sub">FUNDAMENTAL AI RESEARCH COLLECTIVE</div>
          </div>
          <div className="footer-links">
            <Link href="/">← Index</Link>
            <Link href="/#threads">All Threads</Link>
            {posts.map((post, i) => (
              <a key={i} href={`#post-${i + 1}`}>
                {post.title}
              </a>
            ))}
          </div>
          <div className="footer-meta">
            <div>{thread.meta[1]}</div>
            <div>{thread.meta[2]}</div>
          </div>
        </footer>
      </main>
    </>
  );
}
