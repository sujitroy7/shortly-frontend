import { redirect } from "next/navigation";

export default function LoginPage() {
const isLoggedIn = true;

if (isLoggedIn) return redirect("/dashboard")    
    
  return (
    <div>page</div>
  )
}
