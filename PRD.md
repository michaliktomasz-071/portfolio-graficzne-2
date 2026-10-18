# PRD — Portfolio graficzne (Tomasz Michalik)

**Dokument wymagań produktowych** · wersja 1.1 · status: w realizacji (uzupełnianie podstron)
Repo: https://github.com/michaliktomasz-071/portfolio-graficzne · Live: https://tm-portfolio-graficzne-2026.vercel.app/

> Projekt jest **osobną kopią** portfolio UI/UX (repo `portfolio`) postawioną pod własną
> domeną. Wspólny szkielet i układ, odrębna identyfikacja kolorystyczna i pozycjonowanie.

---

## 1. Cel produktu

Statyczna strona **portfolio** Tomasza Michalika, prezentująca ofertę hasłem:
**„Projektuję estetyczne i skuteczne rozwiązania wizualne dla firm i przedsiębiorców."**
Ma pokazywać wybrane prace w atrakcyjny, „surowy" wizualnie sposób, z naciskiem na
**interaktywność i animacje**, oraz umożliwiać szybki kontakt. Strona jest wizytówką —
prosta w utrzymaniu, edytowalna bezpośrednio w kodzie.

## 2. Założenia i ograniczenia

- **Zwykła strona informacyjna** — bez formularzy, logowania, API i panelu CMS.
- **Brak bazy danych** — treści i grafiki są plikami w repozytorium.
- **Bez build-stepu i frameworka** — czysty HTML + CSS + JavaScript (maszyna autora nie ma
  Node.js/npm). Pierwsze załadowanie wymaga internetu (fonty z Google Fonts; potem cache).
- **Dwujęzyczność** PL / EN.
- **Hosting:** GitHub (źródło) → Vercel (auto-deploy po `git push`), **osobna domena**.
- **Estetyka:** minimalizm, „surowy" charakter — **brak zaokrągleń**, jasny błękitno-szary
  panel, delikatna siatka „papier milimetrowy", font Plus Jakarta Sans, dużo whitespace'u.

## 3. Stos technologiczny

| Warstwa | Rozwiązanie |
|---|---|
| Frontend | HTML + CSS + vanilla JS (bez frameworka, bez builda) |
| Animacje | CSS transitions/keyframes + IntersectionObserver + `requestAnimationFrame` |
| Dane projektów | `js/projects.js` (`window.PROJECTS`, dwujęzyczne) |
| Typografia | Plus Jakarta Sans (Google Fonts) |
| Hosting | Vercel (statyczny), `vercel.json` → `cleanUrls` |
| Podgląd lokalny | `serve.ps1` (serwer statyczny w PowerShell, **port 4323**) |
| Wersjonowanie | Git/GitHub; `.gitattributes` chroni pliki binarne |

## 4. Architektura informacji

| Plik | Widok | Język |
|---|---|---|
| `index.html` | Start (hero + galeria prac) | PL |
| `index-en.html` | Home | EN |
| `praca.html?id=N[&lang=en]` | Podstrona projektu (1 szablon, dane z `projects.js`) | PL/EN |
| `o-mnie.html` / `o-mnie-en.html` | O mnie / About | PL/EN |
| `kontakt.html` / `kontakt-en.html` | Kontakt / Contact | PL/EN |

Wspólne zasoby: `css/styles.css`, `js/main.js`, `js/projects.js`, `favicon.svg`,
`images/`, `grafiki/`, `assets/`.

## 5. System projektowy (design system)

- **Kolory** jako zmienne CSS w `:root`: `--bg` (biały #ffffff), `--green` (**#D7DCE5** —
  kolor panelu strony głównej; zmienna zachowała historyczną nazwę, ale trzyma błękitno-szary),
  `--fg` (#333), `--muted`, `--line`, `--card`, `--bg-soft`. Zmiana motywu = jedna zmienna.
- **Siatka tła** („papier milimetrowy"): linie/kropki w kolorze **#F0F5FF** na **białym** tle
  (`body.home / .project / .about`), 24 px raster; na panelu dodatkowo biała siatka
  odsłaniana pod kursorem (ślad z bezwładnością).
- **`--frame: 48px`** — ramka dookoła panelu (na wszystkich widokach).
- **`--radius: 0`** — brak zaokrągleń (surowy charakter), dotyczy też przycisków i tagów.
- **Układ bazowy (wszystkie widoki):** pełny ekran (`100svh`), ramka 48 px,
  **panel po lewej** (przyklejony) + **treść po prawej** (przewija się tylko prawa kolumna).
  Na mobile (≤ 860 px) układ przechodzi w jedną kolumnę i normalne przewijanie.
- **Font:** Plus Jakarta Sans (wagi 300–800).

## 6. Funkcjonalności

### 6.1 Strona główna (`index.html` / `index-en.html`)
- Lewy panel: **ikony narzędzi** w kolejności **Adobe → Figma → SketchUp → V-Ray → Claude**,
  **przełącznik języka** („Portfolio 2026 EN/PL" z animowaną kreską na hover), „Tomasz Michalik",
  podpis **„Projektuję estetyczne i skuteczne rozwiązania wizualne dla firm i przedsiębiorców."**,
  na dole nawigacja **O mnie / Kontakt / Pobierz CV**.
- Prawa kolumna: **pionowa galeria kafelków** prac (przewijana wewnątrz).
- Kafelek: domyślnie **czarno-biały → kolor na hover**, podgląd opisu + przycisk
  **„Zobacz więcej"**; klik → dedykowana podstrona projektu. Na mobile kafelki od razu w kolorze.

### 6.2 Podstrona projektu (`praca.html`)
- Lewy panel jako **spis treści projektu**: nawigacja między projektami (poprzednia / następna),
  „Tomasz Michalik" (link do home), **nazwa projektu**, krótki opis, oraz **menu kategorii**
  (kotwice) dociągnięte do dołu panelu.
- Klik kategorii → **płynne przewinięcie** prawej kolumny + **podświetlenie aktywnej**
  (IntersectionObserver).
- Prawa kolumna: **cover** + sekcje (placeholdery pod treść/grafiki).
- **Mockup urządzenia** (laptop — wektorowy, HTML/CSS) jako cover, z opcjonalnym **slideshow**
  ekranów (crossfade, auto-zmiana co ~3,5 s, kropki, pauza na hover). Konfiguracja w
  `projects.js`: `device: "laptop"`, `screens: [...]`.

### 6.3 O mnie (`o-mnie.html` / `o-mnie-en.html`)
- Lewy panel: menu (Start / Kontakt), „Tomasz Michalik", **tagi umiejętności**, **fakty**
  (lata doświadczenia / projekty / klienci) dociągnięte do dołu.
- Prawa kolumna: **zdjęcie + opis** (bio).

### 6.4 Kontakt (`kontakt.html` / `kontakt-en.html`)
- Lewy panel: menu (Start / O mnie), nagłówek, **lista kontaktowa** (e-mail, LinkedIn,
  Behance, Dribbble), notka o czasie odpowiedzi.
- Prawa kolumna: opis + **duże CTA** z adresem e-mail.

### 6.5 Komponenty i efekty współdzielone
- **Przełącznik języka** PL ↔ EN (na home; na podstronach przez parametr/linki).
- **Reflektor / siatka pod kursorem** — efekt podążający za myszką na panelach
  (`--mx`/`--my`, throttling `rAF`).
- **Animacje wejścia** (fade-up) i **scroll-reveal** sekcji.
- **Mockup urządzenia** (laptop) + **slideshow** — komponent reużywalny.
- Wszystkie efekty respektują **`prefers-reduced-motion`**.

## 7. Dwujęzyczność (PL / EN)

- Osobne pliki dla stron statycznych (`*-en.html`).
- Podstrony projektów: **jeden szablon** `praca.html` + parametr `?lang=en`; teksty z pól
  `*_en` w `projects.js`; kategorie tłumaczone w skrypcie strony.
- Przełącznik na stronie głównej; na podstronach linki prowadzą do właściwej wersji językowej.

## 8. Treści i zasoby (stan: placeholdery → w trakcie podmiany)

- `images/projects/…` — atrapy kafelków (do podmiany na realne grafiki prac).
- `images/projects/portret.svg` — atrapa zdjęcia (O mnie).
- `grafiki/` — realne screeny prac (sukcesywnie dodawane).
- `assets/cv.pdf` — placeholder CV (do podmiany).
- Dane kontaktowe i linki social — placeholdery (`hello@example.com`, `#`).

## 9. Dostępność i wydajność

- Semantyczny HTML, `aria-label`, alternatywne teksty obrazów.
- Respektowanie `prefers-reduced-motion` (wyłączenie animacji/efektów).
- Brak ciężkich zależności; grafiki wektorowe tam, gdzie to możliwe; `loading="lazy"`.
- Mobile-first fallback (układ jednokolumnowy ≤ 860 px).

## 10. Hosting i wdrożenie

- Repozytorium GitHub (prywatne) `portfolio-graficzne` → Vercel (import, framework „Other", katalog `/`).
- **Każdy `git push` = automatyczny re-deploy.**
- `vercel.json` → `cleanUrls` (adresy bez `.html`).
- **Osobna domena** (inna niż oryginalne portfolio) — podpięta w Settings → Domains.

## 11. Status — co już działa

✅ Osobne repo + wdrożenie na Vercel (auto-deploy) pod własną domeną
✅ Komplet widoków (Start, Projekt, O mnie, Kontakt) w PL i EN ze spójnym układem
✅ Nowa identyfikacja kolorystyczna: panel `#D7DCE5`, siatka `#F0F5FF` na białym tle
✅ Ikony narzędzi (Adobe → Figma → SketchUp → V-Ray → Claude) i nowy tagline
✅ Galeria prac z hover · spis treści projektu z kotwicami · mockup laptopa + slideshow
✅ Reflektor/siatka pod kursorem · przełącznik języka

## 12. Dalsze kroki (roadmapa)

- 🖼️ **Uzupełnianie podstron** realnymi grafikami prac i treścią sekcji (priorytet bieżący).
- 📷 **Zdjęcie** autora (O mnie) i **CV** (`assets/cv.pdf`).
- ✉️ **Prawdziwe dane kontaktowe** i linki social.
- 🖥️ Dodatkowe ramki urządzeń (**przeglądarka**, **telefon**) do innych projektów.
- 🌐 Opcjonalnie: tryb ciemny, formularz kontaktowy (np. Formspree — bez bazy).
- 🧹 Porządki: rozważyć przemianowanie zmiennej `--green` → `--panel` (nazwa historyczna).

## 13. Kryteria akceptacji (skrót)

- [ ] Każdy widok renderuje się poprawnie na desktopie i mobile, bez błędów w konsoli.
- [ ] Panel ma **identyczne odstępy (48 px)** na wszystkich widokach i jest przyklejony.
- [ ] Kafelek na home prowadzi do właściwej podstrony projektu; hover zmienia b&w → kolor.
- [ ] Kotwice kategorii płynnie przewijają treść i podświetlają aktywną sekcję.
- [ ] Mockup laptopa wyświetla screen; przy ≥ 2 ekranach działa slideshow (kropki, auto-zmiana).
- [ ] Przełącznik języka prowadzi do spójnie przetłumaczonych treści.
- [ ] Efekty animacji są wyłączone przy `prefers-reduced-motion`.
- [ ] `git push` skutkuje aktualizacją wersji live na Vercelu (osobna domena).
