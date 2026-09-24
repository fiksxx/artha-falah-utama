import type { SVGProps } from "react";

import {
  AlertIcon,
  BookIcon,
  BoxIcon,
  CalendarIcon,
  ChecklistIcon,
  FlaskIcon,
  GearIcon,
  ShieldIcon,
  SparkIcon,
  ToolsIcon,
} from "@/components/ui/icons";
import type { ActivityCategory, ActivityTopic } from "@/types";

/**
 * Ikon per kategori Activity - satu sumber untuk sampul, panel topik, dan badge.
 * Tipe `Record` membuat TypeScript menolak build bila kategori baru belum diberi ikon.
 */
const categoryIcons: Record<ActivityCategory, typeof SparkIcon> = {
  Insight: SparkIcon,
  Panduan: BookIcon,
  Kegiatan: CalendarIcon,
};

/**
 * Ikon per topik Panduan. Dipakai pada sampul artikel tanpa foto supaya puluhan
 * kartu Panduan tidak tampak seragam: pembaca bisa membedakan jenis tulisan
 * dari bentuk ikonnya sebelum membaca judulnya.
 */
const topicIcons: Record<ActivityTopic, typeof SparkIcon> = {
  "Laboratorium Dasar": FlaskIcon,
  "Memilih Alat": ChecklistIcon,
  "Fungsi & Prinsip Kerja": GearIcon,
  "Cara Penggunaan": ToolsIcon,
  "Tips & Perawatan": ShieldIcon,
  Troubleshooting: AlertIcon,
  "Panduan Pembelian": BoxIcon,
};

/** Ikon topik bila `topic` diberikan, kalau tidak ikon kategori. */
export function ActivityCategoryIcon({
  category,
  topic,
  ...props
}: { category: ActivityCategory; topic?: ActivityTopic } & SVGProps<SVGSVGElement>) {
  const Icon = topic ? topicIcons[topic] : categoryIcons[category];
  return <Icon {...props} />;
}
