import Link from "next/link"
export default function SideNav() {
  return (
    <div className="h-full flex flex-col">
      <header className="h-16 flex-initial px-2 border border-red-500">Icon</header>
      <section className="flex-auto px-2 border border-red-500">Menus</section>
      <footer className="flex-initial px-2 border border-red-500">
        <div className="h-10"><Link href="/notifications">notifications</Link></div>
        <div className="h-10">User</div>
      </footer>
    </div>
  )
}
