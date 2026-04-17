# 3. Markdown Formatting

## Headings
- One H1 (`#`) per file
- Number H2s: `## 1. Overview`
- Keep under 60 characters

## Text
- One blank line between paragraphs; max 3 sentences per paragraph
- Line width: 120 characters (code blocks can exceed for clarity)
- `**Bold**` for key terms, `*italic*` for emphasis, `` `code` `` for identifiers

## Lists
- Use `-` for unordered, `1.` for ordered
- Indent nested items with 2 spaces
- Keep parallel structure

## Links
- Descriptive labels with relative paths: `[Section](./sections/01-core-principles.md)`
- No bare URLs

## Separators
- Use `---` for major transitions (header, changelog, appendices)

## Visuals
- **Mermaid:** For flows, diagrams, timelines—validate before committing
- **ASCII:** Only for simple layouts (≤80 chars wide)
- Store diagram files with markdown; add alt text; keep under 500 KB

## Code
- Inline: `` `variable` `` for names, files, short commands
- Fenced blocks: Always specify language (` ```bash`, ` ```typescript`)
- Use realistic snippets with meaningful names
- Add inline comments for complex sequences

---
[« Previous](02-structure-and-organization.md) | [Next »](04-content-types.md)
