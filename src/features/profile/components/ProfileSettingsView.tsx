import { useEffect, useMemo, useState } from 'react'
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
import { EnumSelect } from '@/components/EnumSelect'
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
    saveLegal,
    uploadAvatar,
    uploadDocument,
  } = useProfileSettings()

  const [verificationCode, setVerificationCode] = useState('')
  const avatarPreview = useMemo(
    () => (files.avatar ? URL.createObjectURL(files.avatar) : null),
    [files.avatar],
  )
  const frontIdPreview = useMemo(
    () => (files.frontIdCard ? URL.createObjectURL(files.frontIdCard) : null),
    [files.frontIdCard],
  )
  const backIdPreview = useMemo(
    () => (files.backIdCard ? URL.createObjectURL(files.backIdCard) : null),
    [files.backIdCard],
  )

  useEffect(() => {
    return () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview)
    }
  }, [avatarPreview])

  useEffect(() => {
    return () => {
      if (frontIdPreview) URL.revokeObjectURL(frontIdPreview)
    }
  }, [frontIdPreview])

  useEffect(() => {
    return () => {
      if (backIdPreview) URL.revokeObjectURL(backIdPreview)
    }
  }, [backIdPreview])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-[#3A6EA5] border-t-transparent animate-spin" />
      </div>
    )
  }

  if (!settings) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error?.message ?? 'Failed to load profile settings'}
      </div>
    )
  }

  // Look up the first validation message for a field (case-insensitive key match).
  function fieldError(name: string): string | undefined {
    if (!error?.validationErrors) return undefined
    const key = Object.keys(error.validationErrors).find(
      (k) => k.toLowerCase() === name.toLowerCase(),
    )
    return key ? error.validationErrors[key][0] : undefined
  }

  const hasValidationErrors =
    error?.validationErrors && Object.keys(error.validationErrors).length > 0

  const hasErrorList = error?.errors && error.errors.length > 0

  async function handleSave() {
    const ok = await save()
    if (ok) {
      toast.success('Profile settings updated successfully')
    } else {
      toast.error('Failed to save profile settings')
    }
  }

  async function handleSaveLegal() {
    const ok = await saveLegal()
    if (ok) {
      toast.success('Verification documents updated successfully')
    } else {
      toast.error('Failed to save verification documents')
    }
  }

  function getDocumentName(file: File | null, remoteUrl: string) {
    if (file) return file.name
    if (!remoteUrl) return 'No document selected yet'

    const [cleanUrl] = remoteUrl.split('?')
    const lastPart = cleanUrl.split('/').filter(Boolean).pop()
    return lastPart ? decodeURIComponent(lastPart) : 'Uploaded document'
  }

  const avatarSrc = avatarPreview ?? (settings.profileImageUrl || null)
  const frontIdSrc = frontIdPreview ?? (settings.frontIdPhotoUrl || null)
  const backIdSrc = backIdPreview ?? (settings.backIdPhotoUrl || null)

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
          <p className="text-sm text-[#6B7280] mt-1">
            Fields marked with * are required to save your basic profile.
          </p>
        </div>

        {error && !hasValidationErrors && !hasErrorList && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-600">
            {error.message}
          </div>
        )}

        {hasErrorList && (
          <div className="rounded-xl bg-red-50 px-4 py-3 border border-red-200">
            <p className="text-sm font-semibold text-red-600 mb-1">
              {error?.message}
            </p>
            <ul className="list-disc list-inside space-y-0.5">
              {error!.errors!.map((msg) => (
                <li key={msg} className="text-sm text-red-500">
                  {msg}
                </li>
              ))}
            </ul>
          </div>
        )}

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
            <div className="flex flex-col items-center gap-3">
              <label className="w-24 h-24 rounded-full overflow-hidden border border-[#3A6EA5]/30 bg-white cursor-pointer hover:border-[#3A6EA5]">
                {avatarSrc ? (
                  <img
                    src={avatarSrc}
                    alt="Profile avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#9CBBDC]/20">
                    <Camera className="w-8 h-8 text-[#3A6EA5]" />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0]
                    if (!file) return
                    try {
                      await uploadAvatar(file)
                      toast.success(
                        'Avatar selected. Click Save Changes to upload',
                      )
                    } catch {
                      toast.error('Failed to select avatar')
                    }
                  }}
                />
              </label>
              <p className="text-sm text-[#6B7280]">
                {files.avatar?.name ??
                  (settings.profileImageUrl
                    ? 'Current profile image'
                    : 'Upload profile picture')}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="mb-2 block">First Name *</Label>
                <Input
                  value={settings.firstName}
                  onChange={(e) => updateField('firstName', e.target.value)}
                  className={`bg-white rounded-xl border-[#3A6EA5]/20 ${fieldError('firstName') ? 'border-red-400' : ''}`}
                  required
                />
                {fieldError('firstName') && (
                  <p className="text-xs text-red-500 mt-1">
                    {fieldError('firstName')}
                  </p>
                )}
              </div>
              <div>
                <Label className="mb-2 block">Last Name *</Label>
                <Input
                  value={settings.lastName}
                  onChange={(e) => updateField('lastName', e.target.value)}
                  className={`bg-white rounded-xl border-[#3A6EA5]/20 ${fieldError('lastName') ? 'border-red-400' : ''}`}
                  required
                />
                {fieldError('lastName') && (
                  <p className="text-xs text-red-500 mt-1">
                    {fieldError('lastName')}
                  </p>
                )}
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
                <Label className="mb-2 block">Phone *</Label>
                <Input
                  value={settings.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  className={`bg-white rounded-xl border-[#3A6EA5]/20 ${fieldError('phone') ? 'border-red-400' : ''}`}
                  required
                />
                {fieldError('phone') && (
                  <p className="text-xs text-red-500 mt-1">
                    {fieldError('phone')}
                  </p>
                )}
              </div>
              <div>
                <Label className="mb-2 block">Gender *</Label>
                <EnumSelect
                  endpoint="genders"
                  value={settings.gender}
                  onChange={(value) => updateField('gender', value)}
                  className={`bg-white rounded-xl border-[#3A6EA5]/20 ${fieldError('gender') ? 'border-red-400' : ''}`}
                />
                {fieldError('gender') && (
                  <p className="text-xs text-red-500 mt-1">
                    {fieldError('gender')}
                  </p>
                )}
              </div>
              <div>
                <Label className="mb-2 block">Language *</Label>
                <EnumSelect
                  endpoint="languages"
                  value={settings.language}
                  onChange={(value) => updateField('language', value)}
                  className={`bg-white rounded-xl border-[#3A6EA5]/20 ${fieldError('language') ? 'border-red-400' : ''}`}
                />
                {fieldError('language') && (
                  <p className="text-xs text-red-500 mt-1">
                    {fieldError('language')}
                  </p>
                )}
              </div>
              <div>
                <Label className="mb-2 block">Country *</Label>
                <EnumSelect
                  endpoint="countries"
                  value={settings.country}
                  onChange={(value) => updateField('country', value)}
                  className={`bg-white rounded-xl border-[#3A6EA5]/20 ${fieldError('country') ? 'border-red-400' : ''}`}
                />
                {fieldError('country') && (
                  <p className="text-xs text-red-500 mt-1">
                    {fieldError('country')}
                  </p>
                )}
              </div>
              <div>
                <Label className="mb-2 block">Date of Birth *</Label>
                <Input
                  type="date"
                  value={settings.dateOfBirth}
                  onChange={(e) => updateField('dateOfBirth', e.target.value)}
                  className={`bg-white rounded-xl border-[#3A6EA5]/20 ${fieldError('dateOfBirth') ? 'border-red-400' : ''}`}
                  required
                />
                {fieldError('dateOfBirth') && (
                  <p className="text-xs text-red-500 mt-1">
                    {fieldError('dateOfBirth')}
                  </p>
                )}
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

            <div className="flex justify-end">
              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-gradient-to-r from-[#3A6EA5] to-[#9CBBDC] hover:from-[#2a5a8a] hover:to-[#3A6EA5] text-white rounded-xl"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
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
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <input
                  id="front-id-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0]
                    if (!file) return
                    try {
                      await uploadDocument(file, 'front-id')
                      toast.success('Front ID selected')
                    } catch {
                      toast.error('Failed to process front ID')
                    }
                  }}
                />
                <label
                  htmlFor="front-id-upload"
                  className="block p-4 bg-white rounded-2xl border border-[#3A6EA5]/20 cursor-pointer hover:border-[#3A6EA5]"
                >
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <Upload className="w-5 h-5 text-[#3A6EA5]" />
                      <p className="font-medium text-[#1a1a1a]">Front ID</p>
                    </div>
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-[#3A6EA5]/10 text-[#3A6EA5]">
                      {files.frontIdCard
                        ? 'Selected'
                        : settings.frontIdPhotoUrl
                          ? 'Uploaded'
                          : 'Required'}
                    </span>
                  </div>
                  <div className="h-36 rounded-xl border border-dashed border-[#3A6EA5]/25 bg-[#F8FAFC] overflow-hidden mb-3">
                    {frontIdSrc ? (
                      <img
                        src={frontIdSrc}
                        alt="Front ID preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-sm text-[#6B7280]">
                        Click to upload front side
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-[#4a5565] truncate">
                    {getDocumentName(
                      files.frontIdCard,
                      settings.frontIdPhotoUrl,
                    )}
                  </p>
                </label>
              </div>

              <div>
                <input
                  id="back-id-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0]
                    if (!file) return
                    try {
                      await uploadDocument(file, 'back-id')
                      toast.success('Back ID selected')
                    } catch {
                      toast.error('Failed to process back ID')
                    }
                  }}
                />
                <label
                  htmlFor="back-id-upload"
                  className="block p-4 bg-white rounded-2xl border border-[#3A6EA5]/20 cursor-pointer hover:border-[#3A6EA5]"
                >
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <Upload className="w-5 h-5 text-[#3A6EA5]" />
                      <p className="font-medium text-[#1a1a1a]">Back ID</p>
                    </div>
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-[#3A6EA5]/10 text-[#3A6EA5]">
                      {files.backIdCard
                        ? 'Selected'
                        : settings.backIdPhotoUrl
                          ? 'Uploaded'
                          : 'Required'}
                    </span>
                  </div>
                  <div className="h-36 rounded-xl border border-dashed border-[#3A6EA5]/25 bg-[#F8FAFC] overflow-hidden mb-3">
                    {backIdSrc ? (
                      <img
                        src={backIdSrc}
                        alt="Back ID preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-sm text-[#6B7280]">
                        Click to upload back side
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-[#4a5565] truncate">
                    {getDocumentName(files.backIdCard, settings.backIdPhotoUrl)}
                  </p>
                </label>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label className="mb-2 block">Arabic Full Name *</Label>
                <Input
                  value={settings.arabicFullName}
                  onChange={(e) =>
                    updateField('arabicFullName', e.target.value)
                  }
                  className={`bg-white rounded-xl border-[#3A6EA5]/20 ${fieldError('arabicFullName') ? 'border-red-400' : ''}`}
                  required
                />
                {fieldError('arabicFullName') && (
                  <p className="text-xs text-red-500 mt-1">
                    {fieldError('arabicFullName')}
                  </p>
                )}
              </div>
              <div>
                <Label className="mb-2 block">Arabic Address *</Label>
                <Input
                  value={settings.arabicAddress}
                  onChange={(e) => updateField('arabicAddress', e.target.value)}
                  className={`bg-white rounded-xl border-[#3A6EA5]/20 ${fieldError('arabicAddress') ? 'border-red-400' : ''}`}
                  required
                />
                {fieldError('arabicAddress') && (
                  <p className="text-xs text-red-500 mt-1">
                    {fieldError('arabicAddress')}
                  </p>
                )}
              </div>
              <div>
                <Label className="mb-2 block">National ID Number *</Label>
                <Input
                  value={settings.nationalIDNumber}
                  onChange={(e) =>
                    updateField('nationalIDNumber', e.target.value)
                  }
                  className={`bg-white rounded-xl border-[#3A6EA5]/20 ${fieldError('nationalIDNumber') ? 'border-red-400' : ''}`}
                  required
                />
                {fieldError('nationalIDNumber') && (
                  <p className="text-xs text-red-500 mt-1">
                    {fieldError('nationalIDNumber')}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={handleSaveLegal}
                disabled={saving}
                className="bg-gradient-to-r from-[#3A6EA5] to-[#9CBBDC] hover:from-[#2a5a8a] hover:to-[#3A6EA5] text-white rounded-xl"
              >
                {saving ? 'Saving...' : 'Save Verification'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
