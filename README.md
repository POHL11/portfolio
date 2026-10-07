# Portfolio — BTS SIO SISR

```
portfolio/
├── index.html      Tout le site (accueil, APs, stages, veille, CV)
├── style.css       Tout le style
├── script.js       Tout le JavaScript
└── documents/      Tous les PDF (et rapports .txt)
```

- Une seule page HTML : chaque rubrique est une `<section>` affichée selon l'adresse.
- Adresses : `index.html#accueil`, `#ap`, `#stages`, `#veille`, `#cv`. Lien direct vers une AP : `#ap03`.
- Pour ajouter un document : le déposer dans `documents/` puis créer le lien `href="documents/nom-exact.pdf"` (la casse compte).
