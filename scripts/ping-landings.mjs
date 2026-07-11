// Job cron #2 (voir SPEC.md) : ping les landings ducens.io, écrit landing-down.txt
// si une URL répond en erreur ou ne répond pas. Zéro dépendance npm.
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const landings = JSON.parse(readFileSync("landings.json", "utf8"));
const down = [];

for (const landing of landings) {
  try {
    const res = await fetch(landing.url, { method: "GET", redirect: "follow" });
    if (!res.ok) down.push(`${landing.name} (${landing.url}) → HTTP ${res.status}`);
  } catch (err) {
    down.push(`${landing.name} (${landing.url}) → ${err.message}`);
  }
}

const status = existsSync("status.json") ? JSON.parse(readFileSync("status.json", "utf8")) : {};
status.landings = Object.fromEntries(
  landings.map((l) => [l.name, down.some((d) => d.startsWith(l.name)) ? "down" : "ok"]),
);
status.updatedAt = new Date().toISOString();
writeFileSync("status.json", JSON.stringify(status, null, 2) + "\n");

if (down.length > 0) {
  writeFileSync("landing-down.txt", down.join("\n"));
  console.log("Landing(s) down :\n" + down.join("\n"));
} else {
  console.log("Toutes les landings répondent.");
}
