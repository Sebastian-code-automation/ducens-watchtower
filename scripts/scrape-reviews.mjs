// Job cron #1 (voir SPEC.md) : scrape les fiches Chrome Web Store des 3 sondes,
// append les métriques dans metrics.csv, met à jour status.json, et écrit
// alert-body.txt si un avis "broken/stopped/not working/doesn't work" ou une
// chute de note >= 0.3 est détectée. Zéro dépendance npm (fetch natif Node 20+).
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const ALERT_KEYWORDS = ["broken", "stopped", "not working", "doesn't work"];
const RATING_DROP_THRESHOLD = 0.3;

const stores = JSON.parse(readFileSync("stores.json", "utf8"));
const today = new Date().toISOString().slice(0, 10);

const existingCsv = existsSync("metrics.csv") ? readFileSync("metrics.csv", "utf8") : "date,sonde,cws_id,status,rating,installs,alert_flag\n";
const existingLines = existingCsv.trim().split("\n").slice(1); // drop header

function lastRatingFor(sondeId) {
  for (let i = existingLines.length - 1; i >= 0; i -= 1) {
    const [, sonde, , status, rating] = existingLines[i].split(",");
    if (sonde === sondeId && status === "ok" && rating) return parseFloat(rating);
  }
  return null;
}

const newRows = [];
const alerts = [];
const status = { updatedAt: new Date().toISOString(), sondes: {} };

for (const store of stores) {
  if (!store.cwsId) {
    newRows.push([today, store.id, "", "not_published", "", "", "0"].join(","));
    status.sondes[store.id] = { status: "not_published", lastCheck: today, rating: null, installs: null };
    continue;
  }

  try {
    const url = `https://chromewebstore.google.com/detail/${store.cwsId}`;
    const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (watchtower-bot)" } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();

    const ratingMatch = html.match(/"ratingValue"\s*:\s*"?([\d.]+)"?/);
    const installsMatch = html.match(/([\d,]+)\+?\s*users/i);
    const rating = ratingMatch ? parseFloat(ratingMatch[1]) : null;
    const installs = installsMatch ? installsMatch[1].replace(/,/g, "") : "";

    const lower = html.toLowerCase();
    const keywordHit = ALERT_KEYWORDS.some((k) => lower.includes(k));
    const prevRating = lastRatingFor(store.id);
    const ratingDrop = prevRating !== null && rating !== null && prevRating - rating >= RATING_DROP_THRESHOLD;

    if (keywordHit) alerts.push(`${store.name} (${store.id}) : avis contenant un mot-clé de casse ("broken/stopped/not working/doesn't work").`);
    if (ratingDrop) alerts.push(`${store.name} (${store.id}) : chute de note ${prevRating} → ${rating} (>= ${RATING_DROP_THRESHOLD}).`);

    newRows.push([today, store.id, store.cwsId, "ok", rating ?? "", installs, keywordHit || ratingDrop ? "1" : "0"].join(","));
    status.sondes[store.id] = { status: keywordHit || ratingDrop ? "alert" : "ok", lastCheck: today, rating, installs: installs || null };
  } catch (err) {
    newRows.push([today, store.id, store.cwsId, "fetch_error", "", "", "0"].join(","));
    status.sondes[store.id] = { status: "fetch_error", lastCheck: today, rating: null, installs: null };
    alerts.push(`${store.name} (${store.id}) : échec de scraping de la fiche store (${err.message}).`);
  }
}

writeFileSync("metrics.csv", existingCsv.trimEnd() + "\n" + newRows.join("\n") + "\n");

const prevStatus = existsSync("status.json") ? JSON.parse(readFileSync("status.json", "utf8")) : {};
writeFileSync("status.json", JSON.stringify({ ...prevStatus, ...status }, null, 2) + "\n");

if (alerts.length > 0) {
  writeFileSync("alert-body.txt", alerts.join("\n"));
  console.log("ALERT détectée :\n" + alerts.join("\n"));
} else {
  console.log("Aucune alerte. Métriques journalisées pour", today);
}
