import { redirect } from "next/navigation";

export default function CoupleBillingRedirect() {
  redirect("/dashboard/billing");
}
