//Landing page should go here if we make one

import { redirect } from "next/navigation";
export default function Home() {
  redirect("/login"); // or "/dashboard"
}