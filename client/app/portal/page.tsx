import { redirect } from "next/navigation";
import { PORTAL_URL } from "@/lib/constants";

// The portal lives in the separate school management system.
export default function PortalPage() {
  redirect(PORTAL_URL);
}
