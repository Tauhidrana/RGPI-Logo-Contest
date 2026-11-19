import "server-only";
import { revalidateTag } from "next/cache";

/** Invalidate every cached admin read after a mutation. */
export function revalidateAdminData() {
  revalidateTag("submissions");
  revalidateTag("scores");
  revalidateTag("judges");
  revalidateTag("audit");
}
