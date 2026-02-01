// import { AccountSidebar } from "@/components/account/AccountSidebar"

export default function AccountLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-chocolate-950 pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-[url('/pattern-dark.png')] bg-fixed">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-serif font-bold text-white mb-8">My Account</h1>
                <main>
                    {children}
                </main>
            </div>
        </div>
    )
}
