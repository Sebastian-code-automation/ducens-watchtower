Watchtower — surveillance & auto-réparation du portfolio sondes (repo GitHub `ducens-watchtower`).
Spec : `SPEC.md`. Rôles : (1) selectors.json distant servi par GitHub Pages = source de vérité des 3 extensions, (2) cron quotidien GitHub Actions = scrape fiches stores (alertes + metrics.csv), (3) claude-code-action@v1 sur label `fix-selectors` = PR de réparation (jamais de merge auto).

Règles : workflows minimaux et lisibles, aucun secret en clair, permissions Actions bornées à selectors.json+tests, tout doit tourner SANS le PC de Sebastian. Scope session = CE repo. Handoff ≤10 lignes ci-dessous (3 max).

## Économie de tokens (strict)
3-5 fichiers cibles par session, pas d'exploration au-delà. NE JAMAIS lire : logs de runs Actions en entier (grep les erreurs), `metrics.csv` complet (tail), HTML scrapé (grep). >3 fichiers → plan d'abord. Le workflow claude-code-action en CI : `model: claude-sonnet-5`, prompt minimal, outils bornés Edit/Write sur selectors.json et tests.

## État actuel
Watchtower opérationnel de bout en bout : repo public + Pages actif, cron `detect.yml` vert, workflow `fix-selectors.yml` validé sur un cas réel (issue #1 → PR #2 → mergée à la main → fix live sur Pages en <1 min). Critère de done du sprint atteint. Reste : laisser tourner le cron 2 jours consécutifs (critère SPEC.md), committer les fixes d'URL selectors.json dans les 3 repos sondes (faits hors scope, non commités).

## Handoffs
## #2 — 2026-07-11 — fix-selectors validé de bout en bout (PR #2 mergée)
**Done :** 4 bugs de config trouvés et corrigés sur des runs réels (id-token OIDC, app GitHub Claude non installée, allowedTools sans Bash git/gh, prompt sans contenu d'issue → Claude tentait `gh issue view` jamais autorisé). PR #2 ouverte automatiquement, diff minimal et correct (+3/-2 sur `sonde-a-visibility/selectors.json`), mergée à la main sur confirmation explicite. Fix vérifié live sur GitHub Pages.
**Fichiers :** `.github/workflows/fix-selectors.yml` (prompt injecte désormais `github.event.issue.title`/`.body`).
**Reste / bloquant :** aucun bloquant. Cron à observer 2 jours de suite ; fixes d'URL dans les 3 repos sondes à committer par leurs sessions respectives.
**Commit(s) :** voir `git log` (session complète, ~14 commits). PR #2 mergée en squash sur `main`.

## #1 — 2026-07-11 — Construction initiale + debug fix-selectors (bloqué sur solde API à l'époque, résolu en #2)
**Done :** repo public créé + Pages + 3 selectors.json initiaux + cron detect.yml vert + workflow fix-selectors configuré (id-token, app GitHub, Bash scopé, model sonnet-5).
**Fichiers :** `.github/workflows/detect.yml`, `.github/workflows/fix-selectors.yml`, `selectors.json`, `sonde-a-visibility/selectors.json`, `sonde-b-geo-audit/selectors.json`, `stores.json`, `status.html`.
**Commit(s) :** 93ddcf5.
