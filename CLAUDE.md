Watchtower — surveillance & auto-réparation du portfolio sondes (repo GitHub `ducens-watchtower`).
Spec : `SPEC.md`. Rôles : (1) selectors.json distant servi par GitHub Pages = source de vérité des 3 extensions, (2) cron quotidien GitHub Actions = scrape fiches stores (alertes + metrics.csv), (3) claude-code-action@v1 sur label `fix-selectors` = PR de réparation (jamais de merge auto).

Règles : workflows minimaux et lisibles, aucun secret en clair, permissions Actions bornées à selectors.json+tests, tout doit tourner SANS le PC de Sebastian. Scope session = CE repo. Handoff ≤10 lignes ci-dessous (3 max).

## Économie de tokens (strict)
3-5 fichiers cibles par session, pas d'exploration au-delà. NE JAMAIS lire : logs de runs Actions en entier (grep les erreurs), `metrics.csv` complet (tail), HTML scrapé (grep). >3 fichiers → plan d'abord. Le workflow claude-code-action en CI : `model: claude-sonnet-5`, prompt minimal, outils bornés Edit/Write sur selectors.json et tests.

## État actuel
Repo vierge — à construire selon SPEC.md.

## Handoffs
