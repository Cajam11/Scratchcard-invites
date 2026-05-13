import { redirect } from "next/navigation";

export default function NotFound() {
  redirect("/?invalidLink=1");
}
