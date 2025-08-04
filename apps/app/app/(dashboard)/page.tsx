import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/sign-in')
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Total Revenue</h3>
          <p className="text-2xl font-bold">$45,231.89</p>
          <p className="text-xs text-muted-foreground">+20.1% from last month</p>
        </div>
        
        <div className="rounded-lg border p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Active Invoices</h3>
          <p className="text-2xl font-bold">23</p>
          <p className="text-xs text-muted-foreground">+12 from last month</p>
        </div>
        
        <div className="rounded-lg border p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Total Customers</h3>
          <p className="text-2xl font-bold">147</p>
          <p className="text-xs text-muted-foreground">+19% from last month</p>
        </div>
        
        <div className="rounded-lg border p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Overdue</h3>
          <p className="text-2xl font-bold">4</p>
          <p className="text-xs text-muted-foreground">-2 from last month</p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="rounded-lg border">
          <div className="p-6">
            <p className="text-sm text-muted-foreground">No recent activity to show.</p>
          </div>
        </div>
      </div>
    </div>
  )
}