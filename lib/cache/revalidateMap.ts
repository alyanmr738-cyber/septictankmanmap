import { revalidatePath } from "next/cache";

export function revalidateMapPaths(): void {
  try {
    revalidatePath("/map");
    revalidatePath("/api/map");
  } catch {
    // No-op outside Next.js request/static generation context (scripts, tests).
  }
}
