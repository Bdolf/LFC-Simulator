# LFC RO Simulaatiomallipohja — suunnitelma

**Työtila:** LFC RO visualization · **Kohde:** Norjan kalankasvatus, Live Fish Carrier -alukset (LFC)
**Tavoite:** Visuaalinen simulaatiomallipohja, joka tunnistaa vedentuotantoon parhaiten soveltuvat merialueet, hälyttää miehistöä huonommilla alueilla tuotettaessa ja antaa ennaltaehkäisevän huollon ohjeet (CIP / pidennetty makeavesihuuhtelu / muut toimenpiteet).
**Visuaalinen referenssi:** Lamor Sim — selainpohjainen SCADA/HMI: animoitu prosessikaavio, reaaliaikaiset mittarit, hälytyshallinta, skenaariot.

---

## 1. Domain-malli (lähtöoletukset, korjattavissa)

LFC tuottaa makeaa vettä merivedestä käänteisosmoosilla (RO). Syöttöveden laatu riippuu
aluksen sijainnista, mikä määrää kalvojen likaantumisriskin:

| Tekijä | Vaikutus RO-linjastoon |
|---|---|
| **Kalankasvatushäkkien läheisyys** | Orgaaninen kuorma (rehu, uloste, hoitokemikaalit) → bioulikaantuminen; **merkataan epäsuotuisaksi** |
| **Matalikko (syvyys < 10 m)** | Aalto resuspensioi pohjasedimenttiä → sameus/kiintoaine kohoaa, esisuodattimet tukkeutuvat; **merkataan epäsuotuisaksi** |
| Sameus / kiintoaine (turbidity) | Esisuodattimet tukkeutuvat, ΔP nousee |
| Leväkukinta (orgaaninen kuorma) | Bioulikaantuminen → CIP tarvitaan |
| Suolapitoisuus | Painetaso ja saanto (recovery) muuttuvat |
| Lämpötila | Viskositeetti → pumpputeho/saanto |
| Saastuminen (teollisuus, elimellinen kuorma) | Kalvojen kemiallinen stressi |

Huoltologiikan peruskaava:

| Altistus | Suositus |
|---|---|
| Vihreä alue, lyhyt sessio | Normaali huuhtelu (tavallinen pysäytys) |
| **Kalankasvatushäkkialueella tai sen vaikutussäteellä** | **Epäsuotuisa** — CIP-huuhtelu + pidennetty makeavesihuuhtelu, esisuodattimien tiheä tarkistus |
| **Matalikko (syvyys < 10 m)** | **Epäsuotuisa** — pidennetty makeavesihuuhtelu + esisuodattimien vaihto (sameuskuorma), CIP jos ΔP raja ylittyy |
| Keltainen, sameus/pitoisuudet koholla | **Pidennetty makeavesihuuhtelu** + esisuodattimen tarkistus |
| Punainen, levä/orgaaninen kuorma | **CIP-huuhtelu** (emäs + happo) + pidennetty makeavesihuuhtelu |
| Punainen, kiintoaine koholla | Esisuodattimien vaihto + pidennetty huuhtelu, CIP jos ΔP raja ylittyy |
| Pitkä sessio (t > X h) huonommalla alueella | Edellinen + kalvojen tarkastus |

---

## 2. Työtilan rakenne (Hailer)

| # | Nimi | Tyyppi | Arkketyyppi | Sisältö |
|---|------|--------|-------------|---------|
| 1 | 🗺️ Operating Areas | dataset | Register | merialue: nimi, koodi, keskipiste (+säde), suolapitoisuus, lämpötila, sameus, leväriski, saaste, keskisyvyys, **häkkietäisyys (m, lähimpään)**, **matalikko-osuus (% < 10 m)**, huomiot. **Sopivuus = function** (painotettu pisteytys; häkki- ja matalikkorangaistukset kovat) |
| 2 | 🚫 Risk Zones | dataset | Register | epäsuotuisat vyöhykkeet: **tyyppi (kalankasvatushäkki / matalikko)**, geometria (keskipiste+säde tai polygoni), nimimerkintä, tietolähde (Fiskeridir / EMODnet), aktiivisuus |
| 3 | 📘 Maintenance Instructions | dataset | Register | toimenpidetyyppi (CIP / makeavesihuuhtelu / esisuodatin / kalvotarkastus), laukaisin, vaiheet, kesto, kemikaalit, turvallisuus |
| 4 | 💧 Production Sessions | workflow | Pipeline | Suunniteltu → Käynnissä → Päättynyt → Huolto → Suljettu. Kentät: aluelinkki, **aloituskoordinaatti (lat, lng — tuotantopiste kartalle)**, aikaväli, tilavuus m³, syöttöpaine, ΔP, permeaatin sähkönjohtavuus, **likaantumisriski (function)**, **huoltosuositus (function)** |
| 5 | ⚠️ Alerts | workflow | Pipeline | Aktiivinen → Kuittattu → Suljettu. Tyyppi (häkkiläheisyys / matalikko / likaantuminen / muu), vakavuus, viesti, linkit alueeseen + sessioon, kuittaaja |
| 6 | 🔧 Maintenance Actions | workflow | Pipeline | Avoin → Tehty → Suljettu. Tyyppi (dropdown), ohjelinkki, sessiolinkki, tekijä, merkinnät |
| 7 | 📟 PLC Tag Map | dataset | Register | tag-tunnus, S7-osoite, kuvaus, yksikkö, normal/warning/alarm-rajat, min/max — viiterajat ja integraatio DATANA |

Funktiokentät (isolated-vm, deklaroitujen muuttujien kautta):
- `Areas.suitability` — painotettu summa tekijäkentistä → 0–100; jos `häkkietäisyys < 1500 m` TAI `matalikko-osuus > 40 %` → kova rangaistus (piste < 40 = epäsuotuisa)
- `Areas.limitingFactor` — hallitseva syy (häkki / matalikko / levä / sameus / saaste) → oranssi vs punainen värikoodaus kartalla
- `Sessions.foulingRisk` — `>` linkin kautta alueen tekijät × tilavuus/kesto → 0–100
- `Sessions.maintenanceRecommendation` — sääntötaulu (yllä) riskin + hallitsevan tekijän mukaan → teksti + linkattavat ohjeet

Alueiden häkkietäisyys ja matalikko-osuus lasketaan siemenprosessissa (build time)
Risk Zones -aineistosta ja EMODnet-syvyyksistä; sovellus päivittää ne, jos vyöhykkeitä muokataan.

Roolit ja oikeudet (workflow- JA vaihetasolla):
- **Crew** (miehistö): näkee kaiken, kuittaa hälytyksiä, merkitsee toimenpiteet tehdyiksi — ei muokkaa kirjastoa/alueita
- **Chief** (päällikkö): kaikki + sulkee sessiot/hälytykset
- **Tech** (tekniikka): ylläpitää ohjekirjastoa ja alueita

---

## 3. Sovellus (yksi Hailer-app, Lamor Sim -tyyli)

**PÄÄNÄKYMÄ = prosessimalli (Lamor Sim -henki):** animoitu SVG-prosessikaavio
ottamaanotto → karkeasuodatin → kartiovisuodattimet → suurpaineputki → RO-kalvot (2 linjaa) →
makeavesisäiliö. Animoitu virtaus (partikkelit), live-mittarit (paine, ΔP, virtaama m³/h,
sähkönjohtavuus), START/STOP. Likaantumisindeksi kasvaa alueen sopivuuden mukaan;
ΔP nousee nopeammin huonossa vedessä. Pysäytys → huoltosuositus. Koontinäytön KPI:t ja
hälytysbanneri integroituna samaan näkymään (SCADA-layout).

**Ohjauspaneeli:**
- **Tuotantokapasiteetin slider 50–200 m³/h** — tuotanto käynnistyy sliderista asetetulla
  kapasiteetilla (START/STOP + valittu arvo näkyvissä)
- Linjan 1/2 valinta (kumpi RO-linja tuottaa)

**Mittanäytöt ja viiterajat:** jokainen mitattu arvo näytetään värikoodattuna:
🟢 normal (viitealueella) · 🟡 warning (lähellä rajaa) · 🔴 alarm (raja ylitetty) —
rajat data-ajettuna (PLC Tag Map -rekisteri), joten käyttäjä näkee yhdellä silmäyksellä
mitä mittaukset tarkoittavat. Värien selite paneelissa.

**View 2 — Aluekartta:** Leaflet, Norjan rannikko, ≥8 aluetta värikoodattuna sopivuuden mukaan
(vihreä ≥ 70, keltainen 40–69, **oranssi < 40 kun syy = häkki tai matalikko**, punainen < 40 muusta
syystä), klikattavat. **Epäsuotuisat vyöhykkeet omalla kerroksellaan oranssina** aivan kuten
merikorttien matalikkomerkinnät: kalankasvatushäkkien ympyrät (🐟-merkki + 500 m vaikutussäde)
ja matalikkoalueet (syvyys < 10 m, EMODnet-aineistosta viipaloituna). **Tuotantopisteet:**
jokaisen tuotantosession aloitussijainti omaksi pisteekseen (🚢-merkki) — pisteen väri =
sopivuus siinä kohdassa (vihreä/oranssi/punainen). Aluksen simuloitu sijainti/liike;
aluepaneeli näyttää tekijät ja "mitä jos tuotan täällä" -ennusteen.

**Tuotantopisteen logiikka:** kun tuotanto käynnistetään, kirjataan aloituskoordinaatti →
lasketaan: häkkietäisyys < 500 m? syvyys < 10 m? muut aluetekijät? →
- piste suotuisalla alueella → normaali kirjaus
- **piste epäsuotuisalla alueella → heti ennaltaehkäisevän huollon HUOMIO käyttäjälle**
  (banneri + Alerts-tietue + suositus: CIP / pidennetty makeavesihuuhtelu / esisuodattimet)

**View 4 — Huolto-ohjeet:** nykyinen suositus + vaiheittaiset ohjeet ohjekirjastosta
(CI-vaiheet, kemikaalit, kestot, turvallisuus), "merkitse tehdyksi" → Huoltotoimenpide-workflow.

**View 5 — Loki ja historia:** sessiot, hälytykset, toimenpiteet; tilastot (tilavuus alueittain,
hälytykset syittäin) insightillä.

**Simulaatiomoottori** (sovelluksen sisällä, deterministinen + aikaan sidottu):
alus liikkuu reitillä alueiden välillä, alueiden olosuhteet vaihtelevat hitaasti (esim. leväkausi),
tuotanto kerryttää likaantumista aluetekijöiden mukaan. Kaikki data kirjautuu Hailer-workflow'hun
(sessiot, hälytykset, toimenpiteet) — sovellus ei ole vain irtonainen demo.

---

## 4. Näytetiedot

- 8–10 todellista norjalaista aluetta (esim. Frøya, Hitra, Trondheimsfjord, Ålesund, Senja,
  Lofoten, Vesterålen, Hardangerfjord, Sognefjord, Stavanger) uskoteltavilla arvoilla
- **Kalankasvatushäkit: oikeita sijainteja** demoalueiden läheltä (Fiskeridireoraatin
  akvakulturrekisteri, avoin data; ~20–40 aktiivilokaliteettia) — muutama myös kaukaa kontrastiksi
- **Matalikot: EMODnet-syvyysaineistosta** viipaloidut < 10 m vyöhykkeet demoalueiden ympäriltä
  (satunnaisotanta ruudukolla, oranssi täplä/polygon-visualisointi)
- Ohjekirjasto: CIP (emäs+happo), pidennetty makeavesihuuhtelu, esisuodattimien vaihto,
  kalvotarkastus, normaali pysäytys
- 3 demosessiota (vihreä/oranssi-häkki/punainen alue), 3 demohälytystä (häkki, matalikko, likaantuminen),
  1 tehty toimenpide

## 5. Hyväksymiskriteerit (yksi per kyvykkyys)

1. **Aluekartta:** ≥ 8 aluetta värikoodattuna; värit täsmäävät dataan (raja-arvot 70/40; oranssi = häkki/matalikko-syy)
2. **Riskivyöhykekerros:** häkialueet näkyvät oransseina ympyröinä (🐟 + 1,5 m) ja matalikot oranssina täplästönä — kuten merikortin matalikkomerkit
3. **Häkkivaikutus:** alue, jonka lähin häkki < 1,5 km, saa sopivuuden < 40 JA oranssin värin JA limitingFactor = "fish farm"
4. **Matalikkovaikutus:** alue, jonka matalikko-osuus > 40 %, saa sopivuuden < 40 JA oranssin värin JA limitingFactor = "shallow"
5. **Aluksen simulaatio:** marker seuraa reittiä; koontinäytön "nykyinen alue" = polygonin sisällä oleva alue
6. **Prosessimalli:** tuotanto animoi virtauksen; ΔP nousee epäsuotuisalla alueella ≥ 2× nopeammin kuin vihreällä (60 s testi)
7. **Hälytys:** tuotanto oranssilla (häkki/matalikko) tai punaisella alueella → hälytys bannerissa JA Alerts-workflow'ssa 10 s sisällä, tyypillä "fish farm proximity" / "shallow water" / muu
8. **Huoltosuositus:** sääntötaulun mukainen tulos (häkkiläheisyys → CIP+huuhtelu; matalikko → huuhtelu+esisuodattimet; punainen+levä → CIP+huuhtelu; keltainen+sameus → huuhtelu+esisuodatin; vihreä → normaali) — Sessions-funktiokentän arvo täsmää sovelluksen näyttämään
9. **Toimenpide:** "merkitse tehdyksi" siirtää Maintenance Actions → Tehty (vaihesiirto varmistettu)
10. **Historia:** lokin tilavuudet täsmäävät sessioiden summiin (insight ↔ lähdetietueet)
11. **Roolit:** Crew ei voi muokata ohjekirjastoa (check_user_permissions)

## 6. Vahvistetut päätökset (20.11.2026)

1. **Häkin vaikutussäde: 500 m** aluksesta/alueesta ulospäin (raja muokattavissa datana)
2. **Kieli: englanti**
3. **Data: häkit Fiskeridiristä + syvyydet EMODnetistä** (todellista avointa dataa), olosuhteiden drift simuloitua
4. **Aluksen liikkuminen: automaattinen reittisimulaatio 3 häkin välillä** + lisäoptiona käsin ohjattava tila

## 7. Mittadata ja PLC-integraatio (Siemens S7)

**Tag-kartta** (simulaatiopohjassa simuloitu, suoraan vaihdettavissa oikeisiin S7-osoitteisiin):

| Tag | S7-osoite (esim.) | Mittari | Yksikkö | Normal | Warning | Alarm |
|---|---|---|---|---|---|---|
| FT-101 | DB100.DBD0 (Real) | Syöttövirtaama | m³/h | 50–200 (set) | — | <40 / >210 |
| PT-102 | DB100.DBD4 (Real) | Syöttöpaine ennen kalvoja | bar | 45–55 | 55–60 | >60 |
| PDT-103 | DB100.DBD8 (Real) | Kalvolinjan ΔP | bar | <1,2 | 1,2–1,8 | >1,8 |
| FT-201 | DB101.DBD0 (Real) | Permeaattivirtaama | m³/h | 25–100/linja | -20 % set | -30 % set |
| CT-301 | DB101.DBD4 (Real) | Permeaatin sähkönjohtavuus | µS/cm | <50 | 50–150 | >150 |
| LT-401 | DB102.DBD0 (Real) | Makeavesisäiliön pinta | % | 30–90 | 15–30 / 90–95 | <15 / >95 |
| TT-104 | DB100.DBD12 (Real) | Syöttöveden lämpötila | °C | 6–14 | 4–6 / 14–18 | <4 / >18 |

**Toteutuskerrokset:**
1. **Simulaatio (tämä pohja):** sovelluksen simulaatiomoottori tuottaa tagien arvot
   fysiikallisesti uskottavasti (kapasiteettiasetus, alueen vedenlaatu ja likaantumisindeksi
   vaikuttavat ΔP:hen ja virtaamaan) — arvot näytetään viiterajojen värittäminä
2. **Live-integraatio (valmis polku, ei toteuteta pohjassa):** S7-1200/1500 → OPC UA -palvelin
   (TIA Portalissa) tai edge-gateway (esim. node-red + node-snap7) → REST → mikro-
   palvelu kirjoittaa arvot Haileriin (PLC Measurements -datasetti) → sovellus lukee
   `activity.list`:llä reaaliajassa. Tag-kartta ja viiterajat ovat DATAA (dataset), ei koodia —
   integraatio on konfiguraatiovaihto.
3. Mittaloki: arvot kirjautuvat sessioon (min/max/ka) ja hälytysraja ylitykset → Alerts

## 8. Toteutusjärjestys (hyväksynnän jälkeen)

1. Työtila: 6 workflowta/datasettiä + funktiokentät + roolit (SDK:lla)
2. Datalataus: Fiskeridir-häkit + EMODnet-syvyydet → Risk Zones -datasetti + alueiden faktorit
3. Näytetiedot + insightit
4. Sovellus: koontinäyttö → kartta (alueet + oranssit riskivyöhykkeet) → prosessimalli → hälytykset → huolto → loki
5. Julkaisu + hyväksymistestit 1–11
