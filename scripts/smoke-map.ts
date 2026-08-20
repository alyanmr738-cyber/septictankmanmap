import { getPublicMapData } from "@/lib/database/public-map";

async function main() {
  const data = await getPublicMapData();
  const sample = data.locations[0];
  process.stdout.write(
    JSON.stringify(
      {
        count: data.reviewCount,
        averageRating: data.averageRating,
        sample,
        keys: sample ? Object.keys(sample) : [],
      },
      null,
      2,
    ) + "\n",
  );
}

void main();
