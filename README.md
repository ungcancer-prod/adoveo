# adoveo

All Ung Cancers egen kod för kampanjsidorna på Adoveo (ungcancer.adoveo.com).
Koden ligger här i stället för i Adoveos admin-fält. Varje kampanj i Adoveo
har bara två rader som laddar filerna härifrån.

## Start här

Repot innehåller **två paket**. Ett paket = en CSS-fil och en JS-fil för en
sorts kampanj. Paketen delar ingenting med varandra: en ändring i det ena
påverkar inte sidorna som laddar det andra.

| Paket | Används av | Källkod | Filer som sidorna laddar |
|---|---|---|---|
| `uc-p2p` | P2P-insamlingarna (kampanj 294, 295, 297, 298, 299, 308) | `src/p2p/` | `uc-p2p.css`, `uc-p2p.js` |
| `uc-gavokort` | Gåvokortskampanjerna (kampanj 311) | `src/gavokort/` | `uc-gavokort.css`, `uc-gavokort.js` |

Filerna publiceras på `https://ungcancer-prod.github.io/adoveo/`.

Så hänger det ihop:

1. Du ändrar en fil under `src/` här på GitHub.
2. GitHub bygger om och publicerar filerna automatiskt (fliken **Actions**).
3. Sidorna på Adoveo hämtar de nya filerna inom ca 10 minuter.

Mapparna:

| Mapp | Vad |
|---|---|
| `src/p2p/` | P2P-paketets CSS och JS |
| `src/gavokort/` | Gåvokortspaketets CSS och JS |
| `src/icons/` | Ikoner (SVG) som byggs in i CSS:en, delas av paketen |
| `src/assets/` | Bilder som sidorna laddar direkt (hjärtat på P2P, julkortets bild) |
| `adoveo/kampanjer.md` | Vilka kampanjer som finns och vad som ska stå i vilket fält i Adoveo |
| `adoveo/inputfalt/` | Texterna som ligger i Adoveo, en fil per kampanj |
| `build/` | Bygget. Behöver normalt inte röras |

Ny kampanj av en sort som redan finns (t.ex. ett nytt gåvokort): använd
samma paket, se `adoveo/kampanjer.md`. Ett nytt paket behövs bara för en
helt ny sorts kampanj.

## Ändra något

1. Öppna filen under `src/` på github.com och tryck på pennan (Edit).
2. Ändra, tryck **Commit changes** och skriv kort vad du ändrat.
3. Fliken **Actions** visar bygget. Grön bock = publicerat. Röd = något
   gick fel, och det som låg ute innan ligger kvar.
4. Vänta ett par minuter (cachen) och kontrollera på kampanjens riktiga
   adress — inte i Adoveos förhandsvisning, den visar inte vår CSS.

Ändringen syns samtidigt på **alla** sidor som laddar paketet. Gör en sak i taget och
kontrollera efteråt.

## Vad som ligger var

| Vill du ändra … | Fil |
|---|---|
| Menyn (länkar, ordning, texter) | `src/p2p/js/uc-p2p.js`, listorna `MENU_MAIN` och `MENU_MORE` högst upp |
| Färger, typsnitt, knappar, avstånd | `src/p2p/css/01-bas.css` (sektion 0–8, tokens överst) |
| Skapa-sidan | `src/p2p/css/02-koncept.css` (sektion 9) |
| Insamlingssidan (`/p/…`): rubrik, bild, summa, formulär | `src/p2p/css/02-koncept.css` (sektion 10), texterna (knappen "Gåva & hälsning", "Din gåva", "Läs mer") i `FUND_TEXT` i `src/p2p/js/uc-p2p.js`. Antal rader före "Läs mer" på mobil: `--uc-fund-lines` i sektion 10.1 |
| Hälsningsväggen på insamlingssidan | lapparnas utseende i `src/p2p/css/02-koncept.css` (sektion 11), spaltbredd och luft i `WALL` i `src/p2p/js/uc-p2p.js` |
| Header, menypanel, sök, ankare, infosidan | `src/p2p/css/03-header.css` (sektion 12) |
| Korten i Pågående insamlingar (utseende) | `src/p2p/css/04-insamlingskort.css` (sektion 13) |
| Heron och "Tillsammans har vi samlat in" överst på Summary | `src/p2p/css/05-summary-hero.css` (sektion 14), bilden `src/assets/hjarta.svg`, texterna i `HERO_CTA` och `TOTAL_TEXT` i `src/p2p/js/uc-p2p.js` (summan räknas ihop från konceptkortens belopp) |
| Konceptens färg på korten (konceptkorten på 294, etiketterna på insamlingskorten) | `src/p2p/js/uc-p2p.js`, listan `MENU_MAIN` (`id`, `bg`, `ink`). Konceptkortet hittar sitt koncept via länken (`/start/295/` osv.) |
| Footern (alla sidor): texter, adresser, logotyper, sociala medier | `src/p2p/js/uc-p2p.js`, listan `FOOTER`. Utseendet i `src/p2p/css/06-footer.css` (sektion 15). Logotyperna hämtas från ungcancer.se |
| Logga och ikoner | `src/icons/*.svg` |
| Oregelbundna kanter (formen `#shape-box`) | `src/p2p/js/uc-p2p.js`, `SHAPES`. Lägg kanten på valfritt element med `class="uc-clip"` |
| Konceptfärgerna | Adoveos färgväljare (wrapperns bakgrund) i respektive kampanj, se `adoveo/kampanjer.md` |
| Rubriker, texter, fältetiketter | ligger i Adoveo, dokumenterade i `adoveo/inputfalt/` |
| **Gåvokort:** typografi, knappar, beloppsknappar | `src/gavokort/css/01-bas.css` |
| **Gåvokort:** arket (förhandsvisning, gåvokortssida, PDF-läge), hälsningsfältet | `src/gavokort/css/02-ark.css` |
| **Gåvokort:** julkortet i 311 (bilden, hälsningens plats och typografi) | `src/gavokort/css/03-julkort.css`, bilden `src/assets/julgava-311.jpg` |
| **Gåvokort:** texter i scriptet (spökskrift, hälsningsförslag, knappar) | `KAMPANJER` i `src/gavokort/js/uc-gavokort.js` |

`dist/` skapas av bygget och ska inte ändras — den finns inte ens i repot.
Bilder i `src/assets/` kopieras av bygget och publiceras bredvid CSS:en och JS:en.

## Backa en ändring

Öppna filen → **History** → välj versionen som fungerade → kopiera
innehållet → klistra in i filen och spara igen. Eller be Claude backa.

## Bra att veta

- **Ankare:** varje rubrik (h1–h3) på en sida får ett ankare av sin text:
  "Så funkar det" → `#sa-funkar-det`, "Kontakt" → `#kontakt`. Menyns
  länkar bygger på det — byter man en rubrik i Adoveo måste länken
  följa med, eller så skriver man id:t själv på rubriken.
- **Etiketterna på insamlingskorten:** Adoveo säger inte på kortet vilket
  koncept en insamling hör till. Scriptet hämtar därför listan per koncept
  (en fråga i taget, Adoveo blandar ihop svaren vid samtidiga frågor) och
  sparar svaret i 10 minuter i besökarens webbläsare. Nytt koncept: lägg
  till det i `MENU_MAIN` med kampanjens id och etikettens färger.
- **Sök:** frågar Adoveo efter insamlingar i mappen `P2P-2026-WIP`. Byter
  mappen namn i Adoveo måste `FOLDER` i `src/p2p/js/uc-p2p.js` ändras.
- **Specificitet:** bygget lägger `:not(uc-x)` sist i varje selektor så att
  våra regler vinner över Adoveos egna. Det står inte i källfilerna och
  ska inte skrivas dit.
- **Rotfonten:** Adoveo har `html { font-size: 62.5% }`, så 1rem = 10px.
  Typografi-tokens är omräknade ×1.6 — se kommentaren i `01-bas.css`.

## Kampanjerna

Se `adoveo/kampanjer.md`: vilka kampanjer som finns, vad som ska ligga i
vilket admin-fält, och konceptfärgerna.
