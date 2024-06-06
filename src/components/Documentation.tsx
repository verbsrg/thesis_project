import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function Documentation({
  markdown,
}: {
  markdown: string | null;
}) {
  return markdown ? (
    <Markdown className="markdown" remarkPlugins={[remarkGfm]}>
      {markdown}
    </Markdown>
  ) : (
    <p className="text-center">Není nalezena dokumentace</p>
  );
}
