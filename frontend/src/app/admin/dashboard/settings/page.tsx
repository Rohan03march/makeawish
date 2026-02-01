"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings as SettingsIcon, Bell, User, Save, Store } from "lucide-react"

export default function SettingsPage() {
    const [generalSettings, setGeneralSettings] = useState({
        storeName: "Make a wish Chocolates",
        storeEmail: "contact@luxechocolates.com",
        currency: "INR",
        timezone: "Asia/Kolkata"
    })

    const [notifications, setNotifications] = useState({
        emailOrders: true,
        emailCustomers: false,
        smsAlerts: true,
        lowStockAlerts: true
    })

    const [accountSettings, setAccountSettings] = useState({
        adminName: "Admin User",
        adminEmail: "admin@luxe.com",
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    })

    const handleSaveGeneral = () => {
        alert("General settings saved successfully!")
    }

    const handleSaveNotifications = () => {
        alert("Notification preferences saved successfully!")
    }

    const handleSaveAccount = () => {
        if (accountSettings.newPassword && accountSettings.newPassword !== accountSettings.confirmPassword) {
            alert("Passwords do not match!")
            return
        }
        alert("Account settings saved successfully!")
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-serif font-bold text-white mb-2">Settings</h1>
                <p className="text-chocolate-300">Manage your admin preferences and store settings</p>
            </div>

            {/* General Settings */}
            <Card className="bg-gradient-to-br from-chocolate-900/60 to-chocolate-900/40 border-white/10">
                <CardHeader>
                    <CardTitle className="text-2xl font-serif text-white flex items-center gap-2">
                        <Store className="w-6 h-6 text-gold-400" />
                        General Settings
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-chocolate-300 mb-2">
                                Store Name
                            </label>
                            <input
                                type="text"
                                value={generalSettings.storeName}
                                onChange={(e) => setGeneralSettings({ ...generalSettings, storeName: e.target.value })}
                                className="w-full px-4 py-3 bg-chocolate-800/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-gold-500/50 transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-chocolate-300 mb-2">
                                Store Email
                            </label>
                            <input
                                type="email"
                                value={generalSettings.storeEmail}
                                onChange={(e) => setGeneralSettings({ ...generalSettings, storeEmail: e.target.value })}
                                className="w-full px-4 py-3 bg-chocolate-800/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-gold-500/50 transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-chocolate-300 mb-2">
                                Currency
                            </label>
                            <select
                                value={generalSettings.currency}
                                onChange={(e) => setGeneralSettings({ ...generalSettings, currency: e.target.value })}
                                className="w-full px-4 py-3 bg-chocolate-800/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-gold-500/50 transition-colors"
                            >
                                <option value="INR">INR (₹)</option>
                                <option value="USD">USD ($)</option>
                                <option value="EUR">EUR (€)</option>
                                <option value="GBP">GBP (£)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-chocolate-300 mb-2">
                                Timezone
                            </label>
                            <select
                                value={generalSettings.timezone}
                                onChange={(e) => setGeneralSettings({ ...generalSettings, timezone: e.target.value })}
                                className="w-full px-4 py-3 bg-chocolate-800/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-gold-500/50 transition-colors"
                            >
                                <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                                <option value="America/New_York">America/New_York (EST)</option>
                                <option value="Europe/London">Europe/London (GMT)</option>
                                <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-white/10">
                        <button
                            onClick={handleSaveGeneral}
                            className="px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-chocolate-950 rounded-lg transition-all font-bold shadow-lg flex items-center gap-2"
                        >
                            <Save className="w-4 h-4" />
                            Save Changes
                        </button>
                    </div>
                </CardContent>
            </Card>

            {/* Notification Preferences */}
            <Card className="bg-gradient-to-br from-chocolate-900/60 to-chocolate-900/40 border-white/10">
                <CardHeader>
                    <CardTitle className="text-2xl font-serif text-white flex items-center gap-2">
                        <Bell className="w-6 h-6 text-gold-400" />
                        Notification Preferences
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        {[
                            { key: "emailOrders", label: "Email notifications for new orders", description: "Receive an email when a new order is placed" },
                            { key: "emailCustomers", label: "Email notifications for new customers", description: "Receive an email when a new customer signs up" },
                            { key: "smsAlerts", label: "SMS alerts for urgent issues", description: "Receive SMS for critical system alerts" },
                            { key: "lowStockAlerts", label: "Low stock alerts", description: "Get notified when products are running low" }
                        ].map((item) => (
                            <div key={item.key} className="flex items-start gap-4 p-4 bg-chocolate-800/30 rounded-lg border border-white/5">
                                <input
                                    type="checkbox"
                                    checked={notifications[item.key as keyof typeof notifications]}
                                    onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                                    className="mt-1 w-5 h-5 rounded bg-chocolate-800 border-white/20 text-gold-500 focus:ring-gold-500 focus:ring-offset-0"
                                />
                                <div className="flex-1">
                                    <p className="text-white font-semibold">{item.label}</p>
                                    <p className="text-sm text-chocolate-400 mt-1">{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-end pt-4 border-t border-white/10">
                        <button
                            onClick={handleSaveNotifications}
                            className="px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-chocolate-950 rounded-lg transition-all font-bold shadow-lg flex items-center gap-2"
                        >
                            <Save className="w-4 h-4" />
                            Save Preferences
                        </button>
                    </div>
                </CardContent>
            </Card>

            {/* Account Settings */}
            <Card className="bg-gradient-to-br from-chocolate-900/60 to-chocolate-900/40 border-white/10">
                <CardHeader>
                    <CardTitle className="text-2xl font-serif text-white flex items-center gap-2">
                        <User className="w-6 h-6 text-gold-400" />
                        Account Settings
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-chocolate-300 mb-2">
                                Admin Name
                            </label>
                            <input
                                type="text"
                                value={accountSettings.adminName}
                                onChange={(e) => setAccountSettings({ ...accountSettings, adminName: e.target.value })}
                                className="w-full px-4 py-3 bg-chocolate-800/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-gold-500/50 transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-chocolate-300 mb-2">
                                Admin Email
                            </label>
                            <input
                                type="email"
                                value={accountSettings.adminEmail}
                                onChange={(e) => setAccountSettings({ ...accountSettings, adminEmail: e.target.value })}
                                className="w-full px-4 py-3 bg-chocolate-800/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-gold-500/50 transition-colors"
                            />
                        </div>
                    </div>

                    <div className="pt-4 border-t border-white/10">
                        <h3 className="text-lg font-serif font-bold text-white mb-4">Change Password</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-chocolate-300 mb-2">
                                    Current Password
                                </label>
                                <input
                                    type="password"
                                    value={accountSettings.currentPassword}
                                    onChange={(e) => setAccountSettings({ ...accountSettings, currentPassword: e.target.value })}
                                    className="w-full px-4 py-3 bg-chocolate-800/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-gold-500/50 transition-colors"
                                    placeholder="••••••••"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-chocolate-300 mb-2">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    value={accountSettings.newPassword}
                                    onChange={(e) => setAccountSettings({ ...accountSettings, newPassword: e.target.value })}
                                    className="w-full px-4 py-3 bg-chocolate-800/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-gold-500/50 transition-colors"
                                    placeholder="••••••••"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-chocolate-300 mb-2">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    value={accountSettings.confirmPassword}
                                    onChange={(e) => setAccountSettings({ ...accountSettings, confirmPassword: e.target.value })}
                                    className="w-full px-4 py-3 bg-chocolate-800/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-gold-500/50 transition-colors"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-white/10">
                        <button
                            onClick={handleSaveAccount}
                            className="px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-chocolate-950 rounded-lg transition-all font-bold shadow-lg flex items-center gap-2"
                        >
                            <Save className="w-4 h-4" />
                            Save Account Settings
                        </button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
