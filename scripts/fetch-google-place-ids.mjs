import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const envText = fs.readFileSync(path.join(root, ".env"), "utf8");
const key = envText.match(/^VITE_GOOGLE_PLACES_API_KEY=(.+)$/m)?.[1]?.trim();
if (!key) {
  console.error("Missing VITE_GOOGLE_PLACES_API_KEY in .env");
  process.exit(1);
}

const venuesSrc = fs.readFileSync(path.join(root, "src/data/real-venues.ts"), "utf8");
const venues = [...venuesSrc.matchAll(/name:\s*"([^"]+)"[\s\S]*?address:\s*"([^"]+)"/g)].map((m) => ({
  name: m[1],
  address: m[2],
}));

const ids = {};
for (const venue of venues) {
  const query = encodeURIComponent(`${venue.name} ${venue.address} Dubai`);
  const url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${query}&inputtype=textquery&fields=place_id,name&key=${encodeURIComponent(key)}`;
  try {
    const response = await fetch(url);
    const json = await response.json();
    const placeId = json.status === "OK" ? json.candidates?.[0]?.place_id : null;
    if (placeId) {
      ids[venue.name] = placeId;
      console.log(`ok  ${venue.name}`);
    } else {
      console.log(`miss ${venue.name} (${json.status || response.status})`);
    }
  } catch (error) {
    console.log(`err  ${venue.name}: ${error.message}`);
  }
  await new Promise((resolve) => setTimeout(resolve, 120));
}

const lines = Object.entries(ids)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([name, id]) => `  ${JSON.stringify(name)}: ${JSON.stringify(id)},`)
  .join("\n");

const out = `/** Known Google place_ids for catalog venues. Photos are still fetched live; IDs only skip Find Place. */
export const GOOGLE_PLACE_IDS: Record<string, string> = {
${lines}
};
`;

fs.writeFileSync(path.join(root, "src/data/google-place-ids.ts"), out);
console.log(`Wrote ${Object.keys(ids).length}/${venues.length} place IDs`);
