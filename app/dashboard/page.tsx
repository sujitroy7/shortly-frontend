import { QuickCreate } from "@/components/dashboard/QuickCreate"
import { RecentLinks } from "@/components/dashboard/RecentLinks"

export default function DashboardPage() {
  const userFirstName = "Sujit" 
  
  return (
    <div className="container">
      <h1 className="mb-5 text-3xl font-bold tracking-tight">Welcome back {userFirstName}!</h1>
      <QuickCreate />
      <RecentLinks />
    </div>
  )
}

