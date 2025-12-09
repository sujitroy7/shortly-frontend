import { redirect } from "next/navigation";

export default function page() {
  const isAuthenticated = true;
  if (!isAuthenticated) return redirect("/landing");

  return redirect('/dashboard')
}
