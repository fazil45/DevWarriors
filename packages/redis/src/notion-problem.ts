import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_API_KEY });

export async function getProblem(notionDocId: string): Promise<string> {
  const blocks = await notion.blocks.children.list({ block_id: notionDocId });

  const text = blocks.results
    .map((block: any) => {
      const type = block.type;
      const richText = block[type]?.rich_text;
      if (!richText || richText.length === 0) return "";

      const plainText = richText.map((t: any) => t.plain_text).join("");

      if (type === "heading_1") return `# ${plainText}`;
      if (type === "heading_2") return `## ${plainText}`;
      if (type === "heading_3") return `### ${plainText}`;
      if (type === "bulleted_list_item") return `- ${plainText}`;
      if (type === "numbered_list_item") return `1. ${plainText}`;
      if (type === "code") return `\`\`\`\n${plainText}\n\`\`\``;

      return plainText;
    })
    .filter(Boolean)
    .join("\n\n");

  return text;
}