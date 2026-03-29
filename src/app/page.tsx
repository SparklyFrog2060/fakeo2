import { O2Login } from "@/components/O2Login"
import { AdminPanel } from "@/components/AdminPanel"

export default function Home() {
  return (
    <main className="relative selection:bg-primary/20 selection:text-primary">
      <O2Login />
      <AdminPanel />
    </main>
  )
}
