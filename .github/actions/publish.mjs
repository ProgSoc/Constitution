import { readFile } from "node:fs/promises";
import { Octokit } from "@octokit/action";
import GhostAdminAPI from '@tryghost/admin-api'

const octokit = new Octokit();
const ghost = new GhostAdminAPI({
  url: "https://progsoc.org",
  key: process.env.GHOST_ADMIN_API_KEY,
  version: "v5.0",
});

const { data } = await octokit.request("POST /markdown", {
  headers: { accept: "text/html" },
  text: await readFile("CONSTITUTION.md", { encoding: "utf-8" }),
});

const html = data
  .replace(/<h1.*?<\/h1>/g, "")
  .replace(/>(\d+(?:\.\d+)*)\.?/g, "><b>$1.</b>");

const { updated_at } = await ghost.pages.read({ id: "65d0046b07a6e4000144c4d2" });

await ghost.pages.edit(
  { id: "65d0046b07a6e4000144c4d2", updated_at, html, },
  { source: "html" },
);
