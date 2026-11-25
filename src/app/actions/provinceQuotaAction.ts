"use server";

import { prisma } from "@/lib/prisma";
import { getProvinceMeta } from "@/lib/provinceQuota";
import { getProCategoryLabel } from "@/lib/proCategories";

export interface ProvinceSlotCheckResult {
  provinceCode: string;
  provinceName: string;
  categoryCode: string;
  categoryLabel: string;
  maxSlots: number;
  occupiedSlots: number;
  remainingSlots: number;
  isFull: boolean;
}

export async function checkProvinceSlotAction(
  provinceCode: string,
  categoryCode: string
): Promise<ProvinceSlotCheckResult | null> {
  const prov = getProvinceMeta(provinceCode);
  if (!prov) return null;

  const cat = (categoryCode || "PHOTOGRAPHER").toUpperCase();
  const catLabel = getProCategoryLabel(cat);

  try {
    const firstWord = prov.name.split(" ")[0];
    const activeInCategory = await prisma.professionalProfile.findMany({
      where: {
        isActive: true,
        category: cat,
      },
      select: {
        id: true,
        province: true,
        serviceArea: true,
      },
    });

    const occupied = activeInCategory.filter((p) => {
      if (p.province && p.province.toUpperCase() === prov.code) return true;
      if (!p.province && p.serviceArea) {
        const areaLower = p.serviceArea.toLowerCase();
        if (areaLower.includes(firstWord.toLowerCase())) return true;
        if (
          prov.code === "SS" &&
          (areaLower.includes("alghero") || areaLower.includes("olbia"))
        ) {
          return true;
        }
      }
      return false;
    }).length;

    const remaining = Math.max(0, prov.maxPerCategory - occupied);
    return {
      provinceCode: prov.code,
      provinceName: prov.name,
      categoryCode: cat,
      categoryLabel: catLabel,
      maxSlots: prov.maxPerCategory,
      occupiedSlots: occupied,
      remainingSlots: remaining,
      isFull: remaining === 0,
    };
  } catch {
    return {
      provinceCode: prov.code,
      provinceName: prov.name,
      categoryCode: cat,
      categoryLabel: catLabel,
      maxSlots: prov.maxPerCategory,
      occupiedSlots: 0,
      remainingSlots: prov.maxPerCategory,
      isFull: false,
    };
  }
}
