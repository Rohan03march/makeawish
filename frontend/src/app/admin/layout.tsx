import { AdminSidebar } from "@/components/admin/AdminSidebar"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-chocolate-950 bg-[url('/noise.png')] text-white flex">
            <AdminSidebar />
            <main className="flex-1 ml-64 p-8 md:p-12 overflow-y-auto">
                <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
                    {children}
                </div>
            </main>
        </div>
    )
}
