export const CANONICAL_CRAFT_CATEGORIES = [
  "Textile",
  "Wood Craft",
  "Painting",
  "Pottery",
  "Palm-Leaf Weaving & Eco Art",
];

export const normalizeCraftCategory = (value = "") => {
  const raw = String(value || "").trim();
  if (!raw) return "Other";

  const normalized = raw
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (/(palm|leaf|eco|reed|basket|mat|grass|cane)/.test(normalized)) return "Palm-Leaf Weaving & Eco Art";
  if (/(kalamkari|textile|fabric|handloom|loom|thread)/.test(normalized)) return "Textile";
  if (/(wood|toy|carv|carving|wooden|nirmal|kondapalli)/.test(normalized)) return "Wood Craft";
  if (/(paint|painting|scroll|narrative|cheriyal)/.test(normalized)) return "Painting";
  if (/(pottery|ceramic|terracotta|clay)/.test(normalized)) return "Pottery";

  return raw;
};

export const getCraftCategoryOptions = () => [...CANONICAL_CRAFT_CATEGORIES, "Other"];
