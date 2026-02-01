"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldCheck, Check, X, User as UserIcon, Loader2 } from "lucide-react"
import { API_URL } from "@/lib/config"

export default function PermissionsPage() {
    const [pendingUsers, setPendingUsers] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [actionLoading, setActionLoading] = useState<string | null>(null)

    const fetchPendingUsers = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('userInfo') || '{}')
            const token = user?.token

            const res = await fetch(`${API_URL}/api/auth/pending-users`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            if (res.ok) {
                const data = await res.json()
                setPendingUsers(data)
            }
        } catch (error) {
            console.error("Failed to fetch pending users", error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchPendingUsers()
    }, [])

    const handleAction = async (userId: string, action: 'approve' | 'reject') => {
        setActionLoading(userId)
        try {
            const user = JSON.parse(localStorage.getItem('userInfo') || '{}')
            const token = user?.token


            // value from checkbox
            const makeAdmin = (document.getElementById(`admin-${userId}`) as HTMLInputElement)?.checked || false

            const res = await fetch(`${API_URL}/api/auth/approve-user/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ action, makeAdmin })
            })

            if (res.ok) {
                // Remove from list
                setPendingUsers(prev => prev.filter(u => u._id !== userId))
            } else {
                const errorData = await res.json()
                alert(`Action failed: ${errorData.message || res.statusText}`)
            }
        } catch (error) {
            console.error("Failed to perform action", error)
            alert("Network error or server unreachable")
        } finally {
            setActionLoading(null)
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 text-gold-400 animate-spin" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-white mb-2">Access Control</h1>
                    <p className="text-chocolate-300">Manage login requests and permissions.</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-gold-500/10 rounded-lg border border-gold-500/20 text-gold-400">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="text-sm font-medium">{pendingUsers.length} Pending Requests</span>
                </div>
            </div>

            <Card className="bg-chocolate-900/40 border-white/10 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="text-lg text-white">Pending Requests</CardTitle>
                </CardHeader>
                <CardContent>
                    {pendingUsers.length === 0 ? (
                        <div className="text-center py-12 text-chocolate-400">
                            No pending requests at the moment.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {pendingUsers.map((user) => (
                                <div key={user._id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:border-gold-500/20 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-chocolate-800 flex items-center justify-center text-gold-400">
                                            <UserIcon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="text-white font-bold">{user.name}</h3>
                                            <p className="text-chocolate-400 text-sm">{user.email}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <input
                                                    type="checkbox"
                                                    id={`admin-${user._id}`}
                                                    defaultChecked={true}
                                                    className="w-3 h-3 text-gold-500 rounded border-chocolate-600 bg-chocolate-800 focus:ring-gold-500"
                                                />
                                                <label htmlFor={`admin-${user._id}`} className="text-xs text-chocolate-300">Grant Admin Role</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => handleAction(user._id, 'reject')}
                                            disabled={actionLoading === user._id}
                                            className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors border border-transparent hover:border-red-500/30"
                                            title="Reject"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleAction(user._id, 'approve')}
                                            disabled={actionLoading === user._id}
                                            className="flex items-center gap-2 px-4 py-2 bg-gold-500 text-chocolate-950 font-bold rounded-lg hover:bg-gold-400 transition-all disabled:opacity-50"
                                        >
                                            {actionLoading === user._id ? (
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                            ) : (
                                                <>
                                                    <Check className="w-5 h-5" />
                                                    Approve
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
