# ducens-watchtower

Surveillance & auto-réparation du portfolio de 3 sondes (extensions Chrome). Voir [`SPEC.md`](SPEC.md).

**Statut live :** https://sebastian-code-automation.github.io/ducens-watchtower/status.html

## Protocole incident (~10 min)
1. Email d'alerte reçu (issue `ALERT` créée par le cron quotidien).
2. Ouvrir la page cassée, utiliser le bookmarklet [`tools/copy-dom.js`](tools/copy-dom.js) pour copier le HTML pertinent.
3. Coller le HTML dans une nouvelle issue, ajouter le label `fix-selectors`.
4. `claude-code-action` ouvre une PR corrigeant le bon `selectors.json`. Relire et **merger à la main** — jamais de merge automatique.

## Fichiers de sélecteurs (source de vérité, servis par GitHub Pages)
- `sonde-a-visibility/selectors.json`
- `sonde-b-geo-audit/selectors.json`
- `selectors.json` (racine, pour `sonde-c-ecom`)
