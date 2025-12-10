import DashboardShell from "@/components/DashboardShell"
import { QuickCreate } from "@/components/QuickCreate"
import { RecentLinks } from "@/components/RecentLinks"

export default function DashboardPage() {
  return (
    <DashboardShell>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Create and manage your shortened URLs
          </p>
        </div>
        <QuickCreate />
        <RecentLinks />
      </div>
    </DashboardShell>
  )
}
