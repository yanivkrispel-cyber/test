import json, re, unicodedata

SRC = "/home/user/test/data/races_israel_20262027.json"
OUT = "/home/user/test/lib/data/races.ts"

CITY_COORDS = {
    "אגמון החולה": (33.0800, 35.6100),
    "אור יהודה": (32.0333, 34.8500),
    "אילת": (29.5581, 34.9482),
    "אשקלון": (31.6688, 34.5715),
    "באר שבע": (31.2518, 34.7913),
    "בארי": (31.4275, 34.4967),
    "גזר": (31.8500, 34.9200),
    "גן יבנה": (31.7833, 34.7050),
    "גני מודיעין": (31.8961, 35.0075),
    "דאלית אל-כרמל": (32.6997, 35.0428),
    "הרצליה": (32.1624, 34.8443),
    "חדרה": (32.4340, 34.9196),
    "חיפה": (32.7940, 34.9896),
    "טבריה": (32.7922, 35.5312),
    "יבנה": (31.8783, 34.7378),
    "ים המלח": (31.5000, 35.4700),
    "ירושלים": (31.7683, 35.2137),
    "כוכב יאיר": (32.1908, 34.9772),
    "כנרת": (32.7008, 35.5719),
    "כפר סבא": (32.1750, 34.9070),
    "כפר ראש הנקרה": (33.0904, 35.1067),
    "לוד": (31.9514, 34.8882),
    "מזכרת בתיה": (31.8386, 34.8283),
    "מזרעה": (33.0100, 35.1300),
    "מעלות-תרשיחא": (33.0167, 35.2833),
    "מצפה רמון": (30.6094, 34.8011),
    "נשר": (32.7667, 35.0417),
    "סביון": (32.0500, 34.8500),
    "עמק המעיינות": (32.5000, 35.5000),
    "עפולה": (32.6078, 35.2897),
    "פארק מיני ישראל": (31.8386, 34.9836),
    "פתח תקווה": (32.0878, 34.8878),
    "קיסריה": (32.5000, 34.9000),
    "קרית אונו": (32.0611, 34.8556),
    "קרית אתא": (32.8000, 35.1100),
    "קרני חיטין - צומת גולני": (32.7583, 35.4472),
    "ראש העין": (32.0956, 34.9564),
    "רמת השרון": (32.1467, 34.8397),
    "שדרות": (31.5250, 34.5958),
    "תל אביב - יפו": (32.0853, 34.7818),
    "דימונה": (31.0656, 35.0325),
    "החרמון": (33.3244, 35.7857),
}

NAME_CITY_OVERRIDE = {
    "אתגר DMR בדימונה": "דימונה",
    "אתגר החרמון": "החרמון",
}

def type_bucket(distances_km):
    distances_km = [x for x in (distances_km or []) if x is not None]
    if not distances_km:
        return "אחר"
    mx = max(distances_km)
    if mx >= 39:
        return "מרתון"
    if mx >= 18:
        return "חצי מרתון"
    if mx >= 9:
        return "10 ק\"מ"
    if mx >= 4:
        return "5 ק\"מ"
    return "עממי / ילדים"

def esc(s):
    if s is None:
        return "null"
    return json.dumps(s, ensure_ascii=False)

d = json.load(open(SRC))
races = d["races"]

counter = 0
lines = []
lines.append("// AUTO-GENERATED from data/races_israel_20262027.json — do not hand-edit.")
lines.append("// Regenerate via the conversion script if the source JSON changes.")
lines.append("import type { Race } from \"@/lib/types\";")
lines.append("")
lines.append("export const races: Race[] = [")

skipped_no_coords = []

for r in races:
    name = r["name"]
    city = r.get("city") or ""
    city = NAME_CITY_OVERRIDE.get(name, city)
    coords = CITY_COORDS.get(city)
    if not coords:
        skipped_no_coords.append((name, city))
    lat, lng = coords if coords else (None, None)

    counter += 1
    rid = f"race-{counter:03d}"

    distances_km = r.get("distances_km") or []
    distances = r.get("distances") or []
    size = r.get("size") or {}
    quality = r.get("quality") or {}

    lines.append("  {")
    lines.append(f"    id: {esc(rid)},")
    lines.append(f"    name: {esc(name)},")
    lines.append(f"    date: {esc(r['date'])},")
    lines.append(f"    city: {esc(city)},")
    lines.append(f"    region: {esc(r.get('region') or None)},")
    lines.append(f"    lat: {lat if lat is not None else 'null'},")
    lines.append(f"    lng: {lng if lng is not None else 'null'},")
    lines.append(f"    distances: {json.dumps(distances, ensure_ascii=False)},")
    lines.append(f"    distancesKm: {json.dumps(distances_km)},")
    lines.append(f"    typeBucket: {esc(type_bucket(distances_km))},")
    lines.append(f"    difficulty: {esc(r.get('difficulty_overall'))},")
    lines.append(f"    organizer: {esc(r.get('organizer'))},")
    lines.append(f"    registrationUrl: {esc(r.get('registration_url'))},")
    lines.append(f"    officialUrl: {esc(r.get('official_url'))},")
    lines.append(f"    iaaCertified: {'true' if r.get('iaa_certified') else 'false'},")
    lines.append(f"    summary: {esc(r.get('summary'))},")
    lines.append(f"    racePage: {esc(r.get('race_page'))},")
    lines.append("    size: {")
    lines.append(f"      avgFinishers: {size.get('avg_finishers') if size.get('avg_finishers') is not None else 'null'},")
    lines.append(f"      lastFinishers: {size.get('last_finishers') if size.get('last_finishers') is not None else 'null'},")
    lines.append(f"      class: {esc(size.get('class'))},")
    lines.append("    },")
    lines.append("    quality: {")
    lines.append(f"      tier: {esc(quality.get('tier'))},")
    lines.append(f"      depth: {esc(quality.get('depth'))},")
    lines.append(f"      eq10kMen: {esc(quality.get('eq10k_men'))},")
    lines.append(f"      eq10kWomen: {esc(quality.get('eq10k_women'))},")
    lines.append(f"      roadComparable: {'true' if quality.get('road_comparable') else 'false'},")
    lines.append("    },")
    lines.append("  },")

lines.append("];")

with open(OUT, "w", encoding="utf-8") as f:
    f.write("\n".join(lines) + "\n")

print("wrote", OUT, "races:", len(races))
print("skipped (no coords):", skipped_no_coords)
