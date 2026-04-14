import { useState } from 'react'
import { Camera, IdCard, Shield, Upload, User } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/app/components/ui/button'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/app/components/ui/card'
import { Input } from '@/app/components/ui/input'
import { Label } from '@/app/components/ui/label'
import { Switch } from '@/app/components/ui/switch'
import { Textarea } from '@/app/components/ui/textarea'
import { useProfileSettings } from '../hooks/useProfileSettings'

export function ProfileSettingsView() {
    const {
        settings,
        files,
        loading,
        saving,
        error,
        updateField,
        save,
        uploadAvatar,
        uploadDocument,
    } = useProfileSettings()

    const [verificationCode, setVerificationCode] = useState('')

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border-4 border-[#3A6EA5] border-t-transparent animate-spin" />
            </div>
        )
    }

    if (error || !settings) {
        return (
            <div className="min-h-screen flex items-center justify-center text-red-500">
                {error?.message ?? 'Failed to load profile settings'}
            </div>
        )
    }

    async function handleSave() {
        const ok = await save()
        if (ok) {
            toast.success('Profile settings updated successfully')
        } else {
            toast.error('Failed to save profile settings')
        }
    }

    return (
        <div className="min-h-screen py-20">
            <div className="max-w-[1200px] mx-auto px-8 space-y-8">
                <div>
                    <h1 className="text-4xl font-bold text-[#1a1a1a] mb-2">
                        Account Settings
                    </h1>
                    <p className="text-[#4a5565]">
                        Manage your profile, security settings, and verification documents.
                    </p>
                </div>

                <Card className="bg-[#F2F4F6] border-none rounded-3xl shadow-lg shadow-[#3A6EA5]/10">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <User className="w-6 h-6 text-[#3A6EA5]" />
                            <CardTitle className="text-2xl text-[#1a1a1a]">
                                Personal Information
                            </CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <Label className="mb-2 block">First Name</Label>
                                <Input
                                    value={settings.firstName}
                                    onChange={(e) => updateField('firstName', e.target.value)}
                                    className="bg-white rounded-xl border-[#3A6EA5]/20"
                                />
                            </div>
                            <div>
                                <Label className="mb-2 block">Last Name</Label>
                                <Input
                                    value={settings.lastName}
                                    onChange={(e) => updateField('lastName', e.target.value)}
                                    className="bg-white rounded-xl border-[#3A6EA5]/20"
                                />
                            </div>
                            <div>
                                <Label className="mb-2 block">Email</Label>
                                <Input
                                    value={settings.email}
                                    disabled
                                    className="bg-[#9CBBDC]/20 rounded-xl border-[#3A6EA5]/20"
                                />
                            </div>
                            <div>
                                <Label className="mb-2 block">Phone</Label>
                                <Input
                                    value={settings.phone}
                                    onChange={(e) => updateField('phone', e.target.value)}
                                    className="bg-white rounded-xl border-[#3A6EA5]/20"
                                />
                            </div>
                            <div>
                                <Label className="mb-2 block">Country</Label>
                                <Input
                                    value={settings.country}
                                    onChange={(e) => updateField('country', e.target.value)}
                                    className="bg-white rounded-xl border-[#3A6EA5]/20"
                                />
                            </div>
                            <div>
                                <Label className="mb-2 block">Date of Birth</Label>
                                <Input
                                    type="date"
                                    value={settings.dateOfBirth}
                                    onChange={(e) => updateField('dateOfBirth', e.target.value)}
                                    className="bg-white rounded-xl border-[#3A6EA5]/20"
                                />
                            </div>
                        </div>
                        <div>
                            <Label className="mb-2 block">Bio</Label>
                            <Textarea
                                value={settings.bio}
                                onChange={(e) => updateField('bio', e.target.value)}
                                className="bg-white rounded-xl border-[#3A6EA5]/20 min-h-[120px]"
                                placeholder="Tell us about yourself"
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-[#F2F4F6] border-none rounded-3xl shadow-lg shadow-[#3A6EA5]/10">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <Shield className="w-6 h-6 text-[#3A6EA5]" />
                            <CardTitle className="text-2xl text-[#1a1a1a]">
                                Security
                            </CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-4 bg-white rounded-2xl flex items-center justify-between">
                            <div>
                                <p className="font-semibold text-[#1a1a1a]">
                                    Two-Factor Authentication
                                </p>
                                <p className="text-sm text-[#6B7280]">
                                    Require a verification code for sign in.
                                </p>
                            </div>
                            <Switch
                                checked={settings.twoFactorEnabled}
                                onCheckedChange={(checked) =>
                                    updateField('twoFactorEnabled', checked)
                                }
                            />
                        </div>
                        {settings.twoFactorEnabled && (
                            <div className="p-4 bg-white rounded-2xl">
                                <Label className="mb-2 block">Verification Code</Label>
                                <Input
                                    value={verificationCode}
                                    onChange={(e) => setVerificationCode(e.target.value)}
                                    placeholder="Enter 6-digit code"
                                    className="rounded-xl border-[#3A6EA5]/20"
                                />
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="bg-[#F2F4F6] border-none rounded-3xl shadow-lg shadow-[#3A6EA5]/10">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <IdCard className="w-6 h-6 text-[#3A6EA5]" />
                            <CardTitle className="text-2xl text-[#1a1a1a]">
                                Verification Documents
                            </CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-3 gap-4">
                            <label className="p-4 bg-white rounded-2xl border border-[#3A6EA5]/20 cursor-pointer hover:border-[#3A6EA5]">
                                <div className="flex items-center gap-2 mb-2">
                                    <Camera className="w-5 h-5 text-[#3A6EA5]" />
                                    <p className="font-medium text-[#1a1a1a]">Avatar</p>
                                </div>
                                <p className="text-sm text-[#6B7280] truncate">
                                    {files.avatar?.name ?? 'Upload profile picture'}
                                </p>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={async (e) => {
                                        const file = e.target.files?.[0]
                                        if (!file) return
                                        try {
                                            await uploadAvatar(file)
                                            toast.success('Avatar uploaded successfully')
                                        } catch {
                                            toast.error('Failed to upload avatar')
                                        }
                                    }}
                                />
                            </label>

                            <label className="p-4 bg-white rounded-2xl border border-[#3A6EA5]/20 cursor-pointer hover:border-[#3A6EA5]">
                                <div className="flex items-center gap-2 mb-2">
                                    <Upload className="w-5 h-5 text-[#3A6EA5]" />
                                    <p className="font-medium text-[#1a1a1a]">Front ID</p>
                                </div>
                                <p className="text-sm text-[#6B7280] truncate">
                                    {files.frontIdCard?.name ?? 'Upload front side'}
                                </p>
                                <input
                                    type="file"
                                    className="hidden"
                                    onChange={async (e) => {
                                        const file = e.target.files?.[0]
                                        if (!file) return
                                        try {
                                            await uploadDocument(file, 'front-id')
                                            toast.success('Front ID uploaded successfully')
                                        } catch {
                                            toast.error('Failed to upload front ID')
                                        }
                                    }}
                                />
                            </label>

                            <label className="p-4 bg-white rounded-2xl border border-[#3A6EA5]/20 cursor-pointer hover:border-[#3A6EA5]">
                                <div className="flex items-center gap-2 mb-2">
                                    <Upload className="w-5 h-5 text-[#3A6EA5]" />
                                    <p className="font-medium text-[#1a1a1a]">Back ID</p>
                                </div>
                                <p className="text-sm text-[#6B7280] truncate">
                                    {files.backIdCard?.name ?? 'Upload back side'}
                                </p>
                                <input
                                    type="file"
                                    className="hidden"
                                    onChange={async (e) => {
                                        const file = e.target.files?.[0]
                                        if (!file) return
                                        try {
                                            await uploadDocument(file, 'back-id')
                                            toast.success('Back ID uploaded successfully')
                                        } catch {
                                            toast.error('Failed to upload back ID')
                                        }
                                    }}
                                />
                            </label>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end">
                    <Button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-gradient-to-r from-[#3A6EA5] to-[#9CBBDC] hover:from-[#2a5a8a] hover:to-[#3A6EA5] text-white rounded-xl"
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </div>
        </div>
    )
}
