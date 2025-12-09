import { Button } from "@/components/ui/button"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-primary">Home</h1>
        <Button>Create New Link</Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Dummy Cards */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl border bg-card text-card-foreground shadow p-6">
            <h3 className="font-semibold leading-none tracking-tight">Total Clicks</h3>
            <p className="text-sm text-muted-foreground mt-2">Active links summary</p>
            <div className="mt-4 text-2xl font-bold">1,234</div>
          </div>
        ))}
      </div>
    </div>
  )
}
