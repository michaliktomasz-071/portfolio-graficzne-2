# Portfolio — Tomasz Michalik

Statyczne portfolio (UI / UX Designer). Czysty **HTML + CSS + JavaScript**, bez builda,
bez frameworka, bez bazy danych. Dane (treści i grafiki) trzymane w tym repozytorium,
hosting na **Vercel**.

## Struktura

```
index.html      Start — hero + wybrane projekty
projekty.html   Siatka projektów + lightbox
o-mnie.html     O mnie
kontakt.html    Kontakt (linki)
css/styles.css  Style współdzielone (zmienne CSS, animacje)
js/main.js      Nawigacja, scroll-reveal, lightbox
images/         Grafiki (placeholdery w images/projects/)
serve.ps1       Lokalny serwer statyczny (PowerShell, port 4322)
vercel.json     cleanUrls — ładne adresy bez .html
```

## Podgląd lokalny

Otwórz `index.html` w przeglądarce **albo** uruchom serwer:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File serve.ps1
# http://localhost:4322
```

## Podmiana treści i grafik

- **Grafiki projektów:** wrzuć pliki do `images/projects/` (np. `p1.jpg`) i podmień
  ścieżki w `projekty.html` / `index.html` (atrybuty `src` oraz `data-full`).
- **Teksty:** edytuj bezpośrednio w plikach `.html`.
- **Dane kontaktowe / linki social:** podmień placeholdery (`hello@example.com`, `#`)
  w `kontakt.html` oraz w stopkach.

## Publikacja na Vercel

1. Wypchnij repo na GitHub.
2. Na [vercel.com](https://vercel.com) → **Add New → Project → Import** repozytorium.
3. Framework Preset: **Other** (strona statyczna), Root Directory: `/`.
4. **Deploy.** Każdy `git push` = automatyczny re-deploy.

Baza danych nie jest potrzebna. Jeśli w przyszłości pojawi się formularz kontaktowy,
można użyć usługi typu Formspree — również bez bazy.
