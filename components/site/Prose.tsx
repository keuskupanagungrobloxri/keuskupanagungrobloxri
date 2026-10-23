import { cn } from "@/lib/utils";

function inlineFormat(text: string) {
  const escaped = text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
  return escaped
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noreferrer">$1</a>',
    );
}

export function Prose({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  const blocks = content.split(/\n\s*\n/);
  return (
    <div className={cn("prose-kar", className)}>
      {blocks.map((block, index) => {
        const value = block.trim();
        if (!value) return null;
        if (value.startsWith("## ")) {
          return (
            <h2 key={index} dangerouslySetInnerHTML={{ __html: inlineFormat(value.slice(3)) }} />
          );
        }
        if (value.startsWith("### ")) {
          return (
            <h3 key={index} dangerouslySetInnerHTML={{ __html: inlineFormat(value.slice(4)) }} />
          );
        }
        if (value.startsWith("> ")) {
          return (
            <blockquote
              key={index}
              dangerouslySetInnerHTML={{
                __html: inlineFormat(
                  value
                    .split("\n")
                    .map((line) => line.replace(/^>\s?/, ""))
                    .join(" "),
                ),
              }}
            />
          );
        }
        if (value.startsWith("- ")) {
          const items = value.split("\n").map((line) => line.replace(/^-\s?/, ""));
          return (
            <ul key={index}>
              {items.map((item, itemIndex) => (
                <li
                  key={itemIndex}
                  dangerouslySetInnerHTML={{ __html: inlineFormat(item) }}
                />
              ))}
            </ul>
          );
        }
        return (
          <p
            key={index}
            dangerouslySetInnerHTML={{
              __html: inlineFormat(value.replace(/\n/g, " ")),
            }}
          />
        );
      })}
    </div>
  );
}
