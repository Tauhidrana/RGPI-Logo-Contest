import { z } from "zod";

export const MAX_JPG = 5 * 1024 * 1024;
export const MAX_AI = 25 * 1024 * 1024;

const phoneRe = /^(?:\+?88)?01[3-9]\d{8}$/;

export const submitSchema = z.object({
  full_name: z.string().trim().min(3, "কমপক্ষে ৩ অক্ষরের নাম দিন").max(80, "নাম ৮০ অক্ষরের বেশি হতে পারবে না"),
  department_id: z.string().min(1, "বিভাগ নির্বাচন করুন"),
  semester: z.string().trim().min(1, "সেমিস্টার লিখুন").max(20),
  roll: z.string().trim().min(2, "রোল নম্বর লিখুন").max(30),
  session: z.string().trim().min(4, "সেশন লিখুন (যেমন 2022-2026)").max(30),
  phone: z.string().trim().regex(phoneRe, "সঠিক বাংলাদেশি ফোন নম্বর দিন (01XXXXXXXXX)"),
  email: z.string().trim().email("সঠিক ইমেইল ঠিকানা দিন").max(120),
  logo_title: z.string().trim().min(3, "লোগোর শিরোনাম দিন").max(100),
  concept: z.string().trim().min(20, "কমপক্ষে ২০ অক্ষরের ধারণা লিখুন").max(500, "ধারণা ৫০০ অক্ষরের বেশি হতে পারবে না"),
  declaration: z.literal(true, { errorMap: () => ({ message: "মৌলিকতার ঘোষণায় সম্মত হতে হবে" }) }),
  jpg: z.instanceof(File, { message: "JPG ফাইল আপলোড করুন" }),
  // AI source is optional — only validated when a file is actually provided.
  ai: z.union([z.instanceof(File), z.literal(""), z.null()]).optional(),
  honeypot: z.string().optional(),
  turnstileToken: z.string().optional(),
});

export type SubmitInput = z.infer<typeof submitSchema>;

export function validateJpg(file: File): string | null {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (!["jpg", "jpeg"].includes(ext)) return "শুধুমাত্র .jpg বা .jpeg ফাইল গ্রহণযোগ্য";
  if (!["image/jpeg", "image/jpg"].includes(file.type)) return "ফাইলটির ধরন JPG নয়";
  if (file.size > MAX_JPG) return "JPG ফাইল ৫ MB-এর বেশি হতে পারবে না";
  if (file.size === 0) return "ফাইলটি খালি";
  return null;
}

export function validateAi(file: File): string | null {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (!["ai", "eps", "postscript"].includes(ext)) return "শুধুমাত্র .ai ফাইল গ্রহণযোগ্য";
  if (!["application/postscript", "application/illustrator", "application/octet-stream", "application/pdf", ""].includes(file.type))
    return "ফাইলটির ধরন AI নয়";
  if (file.size > MAX_AI) return "AI ফাইল ২৫ MB-এর বেশি হতে পারবে না";
  if (file.size === 0) return "ফাইলটি খালি";
  return null;
}
