import { generalUsageGuides } from "@/lib/data/guides/usage-general";
import { instrumentUsageGuides } from "@/lib/data/guides/usage-instruments";
import type { ActivitySeed } from "@/types";

/** PANDUAN - CARA PENGGUNAAN. Ditulis di dua file agar tetap mudah dibaca dan disunting. */
export const usageGuides: ActivitySeed[] = [...generalUsageGuides, ...instrumentUsageGuides];
