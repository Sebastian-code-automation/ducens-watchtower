// Tests de forme (pas de canary live — voir "Limite honnête" dans SPEC.md).
// Valident que les 3 fichiers selectors.json restent bien formés après une
// réparation automatique par claude-code-action, avant que Sebastian ne merge.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

function loadJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

test("sonde-a-visibility/selectors.json — chaque target a au moins une strategy avec kind+value", () => {
  const doc = loadJson("sonde-a-visibility/selectors.json");
  assert.equal(typeof doc.version, "number");
  const targets = Object.values(doc.targets);
  assert.ok(targets.length > 0);
  for (const target of targets) {
    assert.ok(Array.isArray(target.strategies) && target.strategies.length > 0);
    for (const strategy of target.strategies) {
      assert.ok(strategy.kind, "strategy sans kind");
      assert.ok(strategy.value, "strategy sans value");
    }
  }
});

test("sonde-b-geo-audit/selectors.json — chaque target a un tableau selectors non vide", () => {
  const doc = loadJson("sonde-b-geo-audit/selectors.json");
  assert.equal(typeof doc.version, "number");
  const targets = Object.values(doc.targets);
  assert.ok(targets.length > 0);
  for (const target of targets) {
    assert.ok(Array.isArray(target.selectors) && target.selectors.length > 0);
    for (const selector of target.selectors) {
      assert.equal(typeof selector, "string");
      assert.ok(selector.length > 0);
    }
  }
});

test("selectors.json (racine, sonde-c-ecom) — section etsy présente avec strategies valides", () => {
  const doc = loadJson("selectors.json");
  assert.ok(doc.etsy && typeof doc.etsy === "object");
  const targets = Object.values(doc.etsy);
  assert.ok(targets.length > 0);
  for (const target of targets) {
    assert.ok(Array.isArray(target.strategies) && target.strategies.length > 0);
    for (const strategy of target.strategies) {
      assert.ok(strategy.kind, "strategy sans kind");
    }
  }
});

test("stores.json et landings.json restent des tableaux valides", () => {
  const stores = loadJson("stores.json");
  const landings = loadJson("landings.json");
  assert.ok(Array.isArray(stores) && stores.length === 3);
  for (const store of stores) {
    assert.ok(store.id && store.name);
  }
  assert.ok(Array.isArray(landings));
  for (const landing of landings) {
    assert.ok(landing.url.startsWith("https://"));
  }
});
