import { Client } from "@notionhq/client";
import { NOTION_API_KEY } from ".";

const notionClient = new Client({ auth: NOTION_API_KEY });

export const getProblem = async (notionDocId: string) => {
  const blocks = await notionClient.blocks.children.list({
    block_id: notionDocId,
  });

  const text = blocks.results
    .map((block: any) => {
      const type = block.type;
      const richText = block[type]?.rich_text;
      if (!richText) return "";
      return richText.map((t: any) => t.plain_text).join("");
    })
    .filter(Boolean)
    .join("\n");

  return text;
};
