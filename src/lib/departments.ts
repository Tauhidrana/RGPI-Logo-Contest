import type { Department } from "./types";

/** RGPI departments — also used as the fallback list before Supabase is connected. */
export const DEFAULT_DEPARTMENTS: Department[] = [
  { id: "11111111-1111-4111-8111-111111111111", name_en: "Civil Technology", name_bn: "সিভিল টেকনোলজি", is_active: true, sort_order: 1 },
  { id: "22222222-2222-4222-8222-222222222222", name_en: "Mechanical Technology", name_bn: "মেকানিকাল টেকনোলজি", is_active: true, sort_order: 2 },
  { id: "33333333-3333-4333-8333-333333333333", name_en: "Electrical Technology", name_bn: "ইলেকট্রিক্যাল টেকনোলজি", is_active: true, sort_order: 3 },
  { id: "44444444-4444-4444-8444-444444444444", name_en: "Mechatronics Technology", name_bn: "মেকাট্রনিক্স টেকনোলজি", is_active: true, sort_order: 4 },
  { id: "55555555-5555-4555-8555-555555555555", name_en: "Electronics Technology", name_bn: "ইলেকট্রনিক্স টেকনোলজি", is_active: true, sort_order: 5 },
  { id: "66666666-6666-4666-8666-666666666666", name_en: "Computer Technology", name_bn: "কম্পিউটার টেকনোলজি", is_active: true, sort_order: 6 },
  { id: "77777777-7777-4777-8777-777777777777", name_en: "Electromedical Technology", name_bn: "ইলেক্ট্রোমেডিকেল টেকনোলজি", is_active: true, sort_order: 7 },
  { id: "88888888-8888-4888-8888-888888888888", name_en: "Power Technology", name_bn: "পাওয়ার টেকনোলজি", is_active: true, sort_order: 8 },
];
