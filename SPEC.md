# SPEC WATCHTOWER — système de surveillance & auto-réparation (session 4)

Repo GitHub `ducens-watchtower` (public). Trois fonctions :

## 1. Source de vérité des sélecteurs
`selectors.json` versionné (sections : google-aio, chatgpt, perplexity, etsy) servi par GitHub Pages. Les 3 extensions le fetchent quotidiennement. Éditer + merger = fix instantané pour tous les users sans re-review store. Inclure page `status.html` statique (état par sonde, lue par le bandeau d'erreur des extensions).

## 2. Détection quotidienne (GitHub Actions cron, tourne dans le cloud — indépendant du PC de Sebastian)
Job quotidien : scrape les 3 fiches publiques Chrome Web Store → extrait note, nombre d'installs, derniers avis. Si avis contenant broken/stopped/not working/doesn't work OU chute de note ≥0,3 → crée une issue ALERT (notification email automatique). Dans tous les cas : append installs+note dans `metrics.csv` = **journal automatique des métriques pour le verdict de juillet 2027**. Deuxième job : ping des landings ducens.io, issue si down.

## 3. Réparation semi-automatique (claude-code-action@v1, officiel Anthropic)
Workflow déclenché par le label `fix-selectors` sur une issue : Claude lit l'issue (HTML de la page cassée collé dedans), met à jour `selectors.json` + les fixtures/tests, ouvre une PR. Secret `ANTHROPIC_API_KEY` (budget ~5 €/mois max). Permissions du workflow bornées : Edit/Write sur selectors.json et tests UNIQUEMENT — jamais de merge auto, jamais d'accès aux stores.

## Protocole incident (total ~10 min, faisable un dimanche depuis le téléphone + 1 PC)
Email d'alerte → ouvrir la page cassée, copier le HTML pertinent (bookmarklet `copy-dom.js` fourni dans le repo), coller dans l'issue, ajouter le label `fix-selectors` → relire et merger la PR de Claude.

## Limite honnête (documentée, pas contournable)
Pas de canary live sur Google/ChatGPT/Etsy depuis les runners CI (IP datacenter bloquées/captcha). La détection repose sur : avis stores (scrapés) + bouton Report des users + les 10 min hebdo de Sebastian. C'est suffisant : une casse se voit dans les avis en <48 h.

## Done
Repo créé + Pages actif + selectors.json initial rempli par les 3 sondes + les 2 crons verts 2 jours de suite + workflow claude-code-action testé sur une fausse issue + bookmarklet + `/install-github-app` exécuté.
