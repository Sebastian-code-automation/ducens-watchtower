// Bookmarklet — protocole incident (voir SPEC.md "Protocole incident").
// Usage : glisser ce lien dans la barre de favoris (créer un favori, coller
// tout le contenu ci-dessous préfixé de "javascript:" dans l'URL du favori),
// puis cliquer dessus sur la page cassée pour copier le HTML pertinent dans
// le presse-papier, prêt à coller dans une issue GitHub.
javascript:(function () {
  var target =
    document.querySelector("main") ||
    document.querySelector("[role='main']") ||
    document.body;
  var html = target.outerHTML.slice(0, 20000); // borne la taille pour rester lisible dans une issue
  navigator.clipboard.writeText(html).then(
    function () {
      alert(
        "HTML copié (" +
          html.length +
          " caractères). Colle-le dans une nouvelle issue GitHub sur ducens-watchtower, ajoute le label fix-selectors."
      );
    },
    function () {
      prompt("Copie manuelle nécessaire (Ctrl+C) :", html);
    }
  );
})();
