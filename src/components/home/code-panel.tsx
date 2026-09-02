type Token = { text: string; type?: "keyword" | "comment" };

/**
 * A simplified version of TaskFlow's fractional-indexing insert (see the
 * "Fractional indexing for card order" highlight in src/content/projects.ts):
 * a dropped card's new position is the midpoint between its neighbours'
 * existing fractional keys, so only that one row is written.
 *
 * Real shape, not real file contents — this is decoration, not documentation,
 * so it is kept short enough to read at a glance inside a small panel.
 */
const LINES: Token[][] = [
  [{ text: "// insert between two cards", type: "comment" }],
  [
    { text: "function", type: "keyword" },
    { text: " between(a: number, b: number): number {" },
  ],
  [{ text: "  return", type: "keyword" }, { text: " a + (b - a) / 2;" }],
  [{ text: "}" }],
  [{ text: "" }],
  [
    { text: "function", type: "keyword" },
    { text: " insertAt(cards: Card[], i: number) {" },
  ],
  [
    { text: "  const", type: "keyword" },
    { text: " prev = cards[i - 1]?.pos ?? 0;" },
  ],
  [
    { text: "  const", type: "keyword" },
    { text: " next = cards[i]?.pos ?? prev + 1;" },
  ],
  [{ text: "  return", type: "keyword" }, { text: " between(prev, next);" }],
  [{ text: "}" }],
];

/**
 * Static syntax-highlighted panel for the empty band in the hero's height-
 * driven gap. Server component — the content never changes, so there is
 * nothing here that needs the browser.
 */
export function CodePanel() {
  return (
    <div className="hidden w-full max-w-md flex-col overflow-hidden rounded-xl border border-border bg-muted lg:flex">
      <div className="border-b border-border px-4 py-2">
        <span className="mono-label text-muted-foreground">position.ts</span>
      </div>
      <pre className="overflow-x-auto px-4 py-3">
        <code className="block font-mono text-small text-foreground">
          {LINES.map((line, index) => (
            <span key={index} className="block whitespace-pre">
              {line.length === 1 && line[0].text === "" ? (
                " "
              ) : (
                <>
                  {line.map((token, tokenIndex) => (
                    <span
                      key={tokenIndex}
                      className={
                        token.type === "keyword"
                          ? "text-brand"
                          : token.type === "comment"
                            ? "text-muted-foreground"
                            : undefined
                      }
                    >
                      {token.text}
                    </span>
                  ))}
                </>
              )}
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}
