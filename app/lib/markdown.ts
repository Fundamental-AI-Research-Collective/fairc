import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkRehype from "remark-rehype";
import rehypeKatex from "rehype-katex";
import rehypeStringify from "rehype-stringify";

const threadsDir = path.join(process.cwd(), "app/data/threads");

export type Post = {
  title: string;
  date: string | null;
  html: string;
};

export async function getThreadPosts(
  slug: string,
  postFiles: string[]
): Promise<Post[]> {
  return Promise.all(
    postFiles.map(async (filename) => {
      const filePath = path.join(threadsDir, slug, filename);
      const raw = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(raw);
      const processed = await remark()
        .use(remarkGfm)
        .use(remarkMath)
        .use(remarkRehype, { allowDangerousHtml: true })
        .use(rehypeKatex)
        .use(rehypeStringify, { allowDangerousHtml: true })
        .process(content);
      return {
        title: (data.title as string) ?? filename,
        date: data.date
          ? data.date instanceof Date
            ? data.date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
            : String(data.date)
          : null,
        html: processed.toString(),
      };
    })
  );
}
