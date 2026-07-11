Watchtower — surveillance & auto-réparation du portfolio sondes (repo GitHub `ducens-watchtower`).
Spec : `SPEC.md`. Rôles : (1) selectors.json distant servi par GitHub Pages = source de vérité des 3 extensions, (2) cron quotidien GitHub Actions = scrape fiches stores (alertes + metrics.csv), (3) claude-code-action@v1 sur label `fix-selectors` = PR de réparation (jamais de merge auto).

Règles : workflows minimaux et lisibles, aucun secret en clair, permissions Actions bornées à selectors.json+tests, tout doit tourner SANS le PC de Sebastian. Scope session = CE repo. Handoff ≤10 lignes ci-dessous (3 max).

## Économie de tokens (strict)
3-5 fichiers cibles par session, pas d'exploration au-delà. NE JAMAIS lire : logs de runs Actions en entier (grep les erreurs), `metrics.csv` complet (tail), HTML scrapé (grep). >3 fichiers → plan d'abord. Le workflow claude-code-action en CI : `model: claude-sonnet-5`, prompt minimal, outils bornés Edit/Write sur selectors.json et tests.

## État actuel
Repo construit et poussé (public, Pages actif). Cron `detect.yml` testé vert. Workflow `fix-selectors.yml` configuré et debuggé (auth OIDC, app GitHub Claude, Bash git/gh scopé, model claude-sonnet-5) mais **jamais vu ouvrir une PR avec succès** : bloqué par un solde ANTHROPIC_API_KEY insuffisant. Reste à faire : recharger le solde, relabelliser l'issue de test #1, merger la PR à la main.

## Handoffs
## #1 — 2026-07-11 — Construction initiale + debug fix-selectors (bloqué sur solde API)
**Done :** repo public créé + Pages + 3 selectors.json initiaux + cron detect.yml vert + workflow fix-selectors configuré et corrigé (id-token, app GitHub, Bash scopé, model sonnet-5).
**Fichiers :** `.github/workflows/detect.yml`, `.github/workflows/fix-selectors.yml`, `selectors.json`, `sonde-a-visibility/selectors.json`, `sonde-b-geo-audit/selectors.json`, `stores.json`, `status.html`.
**Reste / bloquant :** ANTHROPIC_API_KEY à recharger (console.anthropic.com) → relabelliser issue #1 (`fix-selectors`) → vérifier PR → merger à la main. Détail complet dans `Cerveau/04_RAW/inbox/watchtower-2026-07-11.md`.
**Commit(s) :** 93ddcf5 (HEAD), voir `git log` pour l'historique complet de la session (~10 commits, itérations sur le workflow).
