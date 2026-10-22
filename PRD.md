# PRD — Portfolio graficzne 2 (Tomasz Michalik)

**Dokument wymagań produktowych** · wersja 2.1 · status: live (uzupełnianie projektów)
Repo: https://github.com/michaliktomasz-071/portfolio-graficzne-2 · Live: https://portfolio-graficzne-2.vercel.app/

> Projekt jest **klonem** `portfolio-graficzne` (które samo jest kopią portfolio UI/UX, repo
> `portfolio`). Wspólny szkielet i układ; odrębne repo, własny adres na Vercelu i własny zestaw
> projektów. Służy jako niezależna odsłona portfolio graficznego, rozwijana osobno.

---

## 1. Cel produktu

Statyczna strona **portfolio** Tomasza Michalika, prezentująca realizacje z zakresu grafiki,
brandingu, digitalu i druku. Ma pokazywać wybrane prace w atrakcyjny, „surowy" wizualnie sposób,
z naciskiem na **interaktywność i animacje**, oraz umożliwiać szybki kontakt i przejście do stron
klientów. Strona jest wizytówką — prosta w utrzymaniu, edytowalna bezpośrednio w kodzie.

## 2. Założenia i ograniczenia

- **Zwykła strona informacyjna** — bez formularzy, logowania, API i panelu CMS.
- **Brak bazy danych** — treści i grafiki są plikami w repozytorium.
- **Bez build-stepu i frameworka** — czysty HTML + CSS + JavaScript (maszyna autora nie ma
  Node.js/npm). Pierwsze załadowanie wymaga internetu (fonty z Google Fonts; potem cache).
- **Dwujęzyczność** PL / EN.
- **Hosting:** GitHub (źródło) → Vercel (auto-deploy po `git push`), własny adres.
- **Estetyka:** minimalizm, „surowy" charakter — **brak zaokrągleń**, jasny błękitno-szary
  panel, delikatna siatka „papier milimetrowy", font Plus Jakarta Sans, dużo whitespace'u.
- **Źródła graficzne poza repo:** pliki `*.psd` i robocze są w `.gitignore` (nie trafiają na web).

## 3. Stos technologiczny

| Warstwa | Rozwiązanie |
|---|---|
| Frontend | HTML + CSS + vanilla JS (bez frameworka, bez builda) |
| Animacje | CSS transitions/keyframes + IntersectionObserver + `requestAnimationFrame` |
| Dane projektów | `js/projects.js` (`window.PROJECTS`, dwujęzyczne) |
| Typografia | Plus Jakarta Sans (Google Fonts) |
| Hosting | Vercel (statyczny), `vercel.json` → `cleanUrls` |
| Podgląd lokalny | `serve.ps1` (serwer statyczny w PowerShell, **port 4323**) |
| Wersjonowanie | Git/GitHub; `.gitattributes` chroni pliki binarne; `.gitignore` wyklucza `*.psd` |

## 4. Architektura informacji

| Plik | Widok | Język |
|---|---|---|
| `index.html` | Start (hero + galeria prac) | PL |
| `index-en.html` | Home | EN |
| `praca.html?id=N[&lang=en]` | Podstrona projektu (1 szablon, dane z `projects.js`) | PL/EN |
| `o-mnie.html` / `o-mnie-en.html` | O mnie / About | PL/EN |
| `kontakt.html` / `kontakt-en.html` | Kontakt / Contact | PL/EN |

Wspólne zasoby: `css/styles.css`, `js/main.js`, `js/projects.js`, `favicon.svg`,
`images/<projekt>/`, `assets/`.

## 5. System projektowy (design system)

- **Kolory** jako zmienne CSS w `:root`: `--bg`, `--green` (**#D7DCE5** — kolor panelu; nazwa
  historyczna, trzyma błękitno-szary), `--fg`, `--muted`, `--line`, `--card`, `--page`.
  Zmiana motywu = jedna zmienna.
- **Siatka tła** („papier milimetrowy"): subtelne linie/kropki na białym tle; na panelu
  dodatkowo biała siatka odsłaniana pod kursorem (ślad z bezwładnością).
- **Brak zaokrągleń** (surowy charakter) — dotyczy też przycisków i tagów.
- **Układ bazowy (wszystkie widoki):** pełny ekran, ramka dookoła, **panel po lewej**
  (przyklejony) + **treść po prawej** (przewija się tylko prawa kolumna). Na mobile (≤ 860 px)
  układ przechodzi w jedną kolumnę i normalne przewijanie.
- **Font:** Plus Jakarta Sans (wagi 300–800).

## 6. Funkcjonalności

### 6.1 Strona główna (`index.html` / `index-en.html`)
- Lewy panel: **ikony narzędzi** (Adobe → Figma → SketchUp → Claude), **przełącznik języka**,
  „Tomasz Michalik", krótki wstęp, na dole nawigacja **O mnie / Kontakt / Pobierz CV**.
- Prawa kolumna: **pionowa galeria kafelków** prac (przewijana wewnątrz).
- Kafelek: miniatura + tytuł + podpis (tag) + **„Zobacz więcej"**; klik → podstrona projektu
  (`praca.html?id=N`). Jeden kafelek jest linkiem zewnętrznym do portfolio UI/UX.

### 6.2 Podstrona projektu (`praca.html`)
- Lewy panel jako **spis treści projektu**: nawigacja poprzednia/następna, „Tomasz Michalik"
  (link do home), **nazwa projektu**, opis, opcjonalny **aktywny link do strony klienta**
  (pole `link` → odnośnik `.ps-link`, otwiera się w nowym oknie) i **menu kategorii** (kotwice).
- Dwa tryby renderowania (zależnie od danych w `projects.js`):
  - **Tryb galerii** (pole `gallery`): siatka grafik z układem per-projekt
    (`layout` → klasa `.proj-gallery--<layout>`). Komórki kwadratowe (wysokość = szerokość
    kolumny, liczona w JS) — chyba że układ sam definiuje proporcje (np. `salon`).
  - **Tryb cover+sekcje** (brak `gallery`): **mockup urządzenia** (laptop/telefon, HTML/CSS)
    z opcjonalnym **slideshow** ekranów + sekcje kategorii (placeholdery pod treść).
- **Film w galerii:** element `gallery` z rozszerzeniem `.mp4/.webm/.mov/.m4v` renderuje się
  jako `<video>` w **szarym boxie** (`.gal-video`, `object-fit: contain` — klip pod social media
  bez przycinania, z szarymi marginesami). Autoodtwarzanie, wyciszony, w pętli, `playsinline`,
  z kontrolkami. Gdy pliku brak — box pokazuje etykietę „Film — wkrótce" (obsłużony błąd).
- **Ukrywanie projektów:** `praca.html` filtruje listę przez `!p.hidden`, więc projekt z flagą
  `hidden: true` w `projects.js` znika z nawigacji prev/next, a bezpośredni URL `?id=N` robi
  fallback na pierwszy widoczny projekt. Do pełnego ukrycia dochodzi usunięcie kafelka ze strony
  głównej (PL + EN). Dane projektu zostają w pliku — odwracalne (usuń flagę + przywróć kafelek).
  Starszy wariant (Gray Lama) ukryto przez **zakomentowanie** wpisu — oba sposoby współistnieją.

### 6.3 O mnie / Kontakt
- `o-mnie.*`: lewy panel (menu, tagi umiejętności, fakty) + prawa kolumna (zdjęcie + bio).
- `kontakt.*`: lewy panel (menu, lista kontaktowa) + prawa kolumna (opis + duże CTA e-mail).

### 6.4 Komponenty i efekty współdzielone
- Przełącznik języka PL ↔ EN; reflektor/siatka pod kursorem; animacje wejścia i scroll-reveal;
  mockup urządzenia + slideshow; **box filmu** (`.gal-video`); **aktywny link projektu**
  (`.ps-link`). Wszystkie efekty respektują **`prefers-reduced-motion`**.

## 7. Projekty (dane w `js/projects.js`)

Każdy projekt: `id`, `img` (miniatura), `year`, `layout`, `gallery[]` lub tryb cover,
dwujęzyczne `title/tag/role/klient/desc` (+ `*_en`), opcjonalnie `link` + `linkLabel(_en)`.

Kolejność w pliku ≠ kolejność id — kafelki na stronie głównej i nawigacja biorą projekty
z tablicy w kolejności jej zapisu.

| id | Projekt | Tag | Tryb / układ | Uwagi |
|---|---|---|---|---|
| 1 | ruminta | Identyfikacja wizualna | galeria `ruminta` | 14 grafik |
| 2 | trans.eu | Materiały targowe i DTP | galeria `trans` | 12 kafli + baner |
| 3 | PITD | Raporty i publikacje | galeria `pitd` | 15 grafik |
| 4 | ~~Gray Lama~~ | — | — | **UKRYTY** (zakomentowany wpis, brak kafelka) |
| 7 | **malamut** | Social media i film AI | galeria `malamut` (6 el.) | **film** w boxie #4; klej polimerowy |
| 8 | **salon masażu** | Identyfikacja i strona www | galeria `salon` (6 el.) | **link** do masazbartoszburcon.pl |
| 9 | ~~eneon~~ | Identyfikacja i strona www | galeria `eneon` (5 el.) | **UKRYTY** (flaga `hidden`) |
| 10 | **podnośnik koszowy** | Identyfikacja i one-pager | galeria `podnosnik` (5 el.) | marka BOCIEK (wynajem podnośników, Wrocław) |
| 5 | ~~VetAnima~~ | Identyfikacja i opakowania | galeria `vetanima` | **UKRYTY** (flaga `hidden`) |
| 6 | Logotypy | Projektowanie logo | galeria `logo` (bento) | **24 kafle**, ikona→logo na hover |

- **malamut** — kampania social media kleju polimerowego: film reklamowy (narzędzia AI) +
  posty/grafiki. Na potrzeby kampanii stworzono bohatera marki (pies-budowlaniec / złota rączka)
  jako spójną bazę wizualną dla materiałów AI. Układ 6 kafli (jak początek `trans`): #1/#2
  w słupku, #3 i film (#4) jako duże pola 2×2, #5/#6 mniejsze.
- **salon masażu** — identyfikacja studia masażu Bartosz Burcon: logo, materiały drukowane,
  strona www (z użyciem AI). Układ: #1 (logo) + #2 (voucher) + #7 (ulotki) jako małe kwadraty
  w lewej kolumnie; sekcje strony www (#3–#5) jako kolumna dociągnięta do prawej. Aktywny link.
- **eneon** *(ukryty)* — identyfikacja i strona www firmy z branży inteligentnej energetyki
  (logo, opakowania, branding, mockupy strony). Układ `eneon` (klon salon, 5 el.).
- **podnośnik koszowy** — identyfikacja marki **BOCIEK** (wynajem podnośników koszowych):
  logo, materiały drukowane (ulotki) i serwis www w formie **one-pagera**. Układ `podnosnik`
  (klon salon, 5 el.): #1/#2 małe kwadraty (logo, ulotki), #3 duży (hero), #4/#5 pełna szerokość
  (sekcje strony). Źródła `*.psd` trzymane w folderze (gitignore).

## 8. Dwujęzyczność (PL / EN)

- Osobne pliki dla stron statycznych (`*-en.html`).
- Podstrony projektów: **jeden szablon** `praca.html` + parametr `?lang=en`; teksty z pól `*_en`
  w `projects.js` (w tym `linkLabel_en`); kategorie tłumaczone w skrypcie strony.

## 9. Zasoby graficzne

- `images/<projekt>/` — miniatura + grafiki galerii (np. `images/malamut/`, `images/salon-masazu/`,
  `images/eneon/`, `images/podnosnik-koszowy/`, `images/logo/ikona/` + `images/logo/logo/`).
- Film: `images/malamut/4.mp4` (klip pionowy 9:16, ~30 MB — kandydat do kompresji).
- Źródła `*.psd` i pliki robocze: w `.gitignore`, nie publikowane (np. `podnosnik-koszowy/*.psd`).
- `assets/` — CV (`CV Tomasz Michalik.pdf`).

## 10. Dostępność i wydajność

- Semantyczny HTML, `aria-label`, alternatywne teksty obrazów.
- Respektowanie `prefers-reduced-motion`.
- `loading="lazy"` dla grafik; wektory tam, gdzie możliwe.
- Mobile-first fallback (układ jednokolumnowy ≤ 860 px).
- **Uwaga wydajnościowa:** `4.mp4` (~30 MB) — warto skompresować dla szybszego ładowania.

## 11. Hosting i wdrożenie

- Repo GitHub (publiczne) `portfolio-graficzne-2` → Vercel (framework „Other", katalog `/`).
- **Każdy `git push` do `main` = automatyczny re-deploy.**
- `vercel.json` → `cleanUrls` (adresy bez `.html`).
- Live: https://portfolio-graficzne-2.vercel.app/ (opcjonalnie: własna domena w Settings → Domains).
- ⚠️ **Znany problem:** Vercel bywa, że **pomija deploy** niektórych commitów. Przyczyna:
  Settings → Build and Deployment → Root Directory → **„Skip deployments when there are no changes
  to the root directory"** = Enabled. Zalecane: **wyłączyć** tę opcję (wtedy każdy push się wdraża).
  Doraźny workaround: pusty commit re-trigger (`git commit --allow-empty` + push).

## 12. Status — co już działa

✅ Osobne publiczne repo + wdrożenie na Vercel (auto-deploy), własny adres
✅ Komplet widoków (Start, Projekt, O mnie, Kontakt) w PL i EN
✅ Projekty **malamut** (film AI), **salon masażu** (link) i **podnośnik koszowy / BOCIEK** (one-pager)
✅ Mechanizm ukrywania projektów (flaga `hidden` + filtr): ukryte Gray Lama, VetAnima, eneon
✅ Nowe układy galerii per-projekt (klony: `malamut`, `salon`, `eneon`, `podnosnik`); logo = 24 kafle
✅ Obsługa **filmu w galerii** (box na szarym tle) i **aktywnego linku** projektu
✅ Galeria prac z hover · spis treści projektu z kotwicami · mockup laptopa + slideshow
✅ Reflektor/siatka pod kursorem · przełącznik języka

## 13. Dalsze kroki (roadmapa)

- 🖼️ Uzupełnianie projektów realnymi grafikami (np. podnośnik koszowy #6 — jest `6.psd`).
- ⚙️ **Wyłączyć na Vercelu** „Skip deployments when there are no changes…" (sekcja 11).
- 🎬 **Kompresja `4.mp4`** (~30 MB) dla szybszego ładowania malamut.
- 🔗 Opcjonalnie: aktywne linki (`link`) także w innych projektach (np. malamut).
- 🌐 Opcjonalnie: własna domena, tryb ciemny, formularz kontaktowy (bez bazy).
- 🧹 Porządki: rozważyć przemianowanie zmiennej `--green` → `--panel` (nazwa historyczna).

## 14. Kryteria akceptacji (skrót)

- [ ] Każdy widok renderuje się poprawnie na desktopie i mobile, bez błędów w konsoli.
- [ ] Panel ma spójne odstępy na wszystkich widokach i jest przyklejony.
- [ ] Kafelek na home prowadzi do właściwej podstrony projektu.
- [ ] Kotwice kategorii płynnie przewijają treść i podświetlają aktywną sekcję.
- [ ] Galeria renderuje właściwy układ per-projekt; film wyświetla się w szarym boxie i działa.
- [ ] Aktywny link projektu otwiera stronę klienta w nowym oknie.
- [ ] Przełącznik języka prowadzi do spójnie przetłumaczonych treści.
- [ ] Efekty animacji są wyłączone przy `prefers-reduced-motion`.
- [ ] `git push` skutkuje aktualizacją wersji live na Vercelu.
