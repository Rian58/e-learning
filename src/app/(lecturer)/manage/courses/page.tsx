export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";

export default function RedirectToManage() {
  redirect("/manage");
}
