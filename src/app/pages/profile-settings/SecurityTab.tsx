import { useState } from 'react'
import { Lock, Shield } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Switch } from '../../components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog'
import { toast } from 'sonner'
import { useProfile } from '@/hooks/useProfile'
import { HttpError } from '@/services/httpErrors'

export function SecurityTab() {
  const { data: profileResponse, changePassword } = useProfile()
  const apiProfile = profileResponse?.data

  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  })
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [show2FAModal, setShow2FAModal] = useState(false)
  const [verificationCode, setVerificationCode] = useState('')

  const clearFieldError = (key: string) =>
    setFieldErrors((prev) => {
      if (!prev[key]) return prev
      const { [key]: _, ...rest } = prev
      return rest
    })

  const handleChangePassword = () => {
    if (!apiProfile?.id) return
    changePassword.mutate(
      {
        id: apiProfile.id,
        currentPassword: passwords.current,
        newPassword: passwords.new,
        confirmNewPassword: passwords.confirm,
      },
      {
        onSuccess: () => {
          setPasswords({ current: '', new: '', confirm: '' })
          setFieldErrors({})
          toast.success('Password updated successfully!')
        },
        onError: (err) => {
          if (err instanceof HttpError && err.validationErrors) {
            const flat: Record<string, string> = {}
            for (const [key, msgs] of Object.entries(err.validationErrors)) {
              flat[key] = msgs[0]
            }
            setFieldErrors(flat)
          } else {
            toast.error(err instanceof HttpError ? err.message : 'Failed to update password.')
          }
        },
      },
    )
  }

  const handle2FAToggle = () => {
    if (!twoFactorEnabled) {
      setShow2FAModal(true)
    } else {
      setTwoFactorEnabled(false)
      toast.success('Two-factor authentication disabled')
    }
  }

  const handleVerify2FA = () => {
    if (verificationCode.length === 6) {
      setTwoFactorEnabled(true)
      setShow2FAModal(false)
      setVerificationCode('')
      toast.success('Two-factor authentication enabled successfully!')
    } else {
      toast.error('Please enter a valid 6-digit code')
    }
  }

  return (
    <>
      <Card className="bg-[#F2F4F6] border-none rounded-3xl shadow-lg shadow-[#3A6EA5]/10">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-[#3A6EA5]" />
            <CardTitle className="text-2xl text-[#1a1a1a]">Security Settings</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          <div>
            <h3 className="text-lg font-semibold text-[#1a1a1a] mb-4">Change Password</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="current-password" className="text-[#1a1a1a] mb-2 block">
                  Current Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4a5565]" />
                  <Input
                    id="current-password"
                    type="password"
                    value={passwords.current}
                    onChange={(e) => {
                      setPasswords({ ...passwords, current: e.target.value })
                      clearFieldError('CurrentPassword')
                    }}
                    className={`pl-12 bg-white rounded-xl border-[#3A6EA5]/20 ${fieldErrors.CurrentPassword ? 'border-red-400' : ''}`}
                  />
                </div>
                {fieldErrors.CurrentPassword && (
                  <p className="text-xs text-red-500 mt-1">{fieldErrors.CurrentPassword}</p>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="new-password" className="text-[#1a1a1a] mb-2 block">
                    New Password
                  </Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={passwords.new}
                    onChange={(e) => {
                      setPasswords({ ...passwords, new: e.target.value })
                      clearFieldError('NewPassword')
                    }}
                    className={`bg-white rounded-xl border-[#3A6EA5]/20 ${fieldErrors.NewPassword ? 'border-red-400' : ''}`}
                  />
                  {fieldErrors.NewPassword && (
                    <p className="text-xs text-red-500 mt-1">{fieldErrors.NewPassword}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="confirm-password" className="text-[#1a1a1a] mb-2 block">
                    Confirm Password
                  </Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={passwords.confirm}
                    onChange={(e) => {
                      setPasswords({ ...passwords, confirm: e.target.value })
                      clearFieldError('ConfirmNewPassword')
                    }}
                    className={`bg-white rounded-xl border-[#3A6EA5]/20 ${fieldErrors.ConfirmNewPassword ? 'border-red-400' : ''}`}
                  />
                  {fieldErrors.ConfirmNewPassword && (
                    <p className="text-xs text-red-500 mt-1">{fieldErrors.ConfirmNewPassword}</p>
                  )}
                </div>
              </div>

              <Button
                disabled={changePassword.isPending}
                onClick={handleChangePassword}
                className="bg-gradient-to-r from-[#3A6EA5] to-[#9CBBDC] hover:from-[#2a5a8a] hover:to-[#3A6EA5] text-white rounded-xl"
              >
                {changePassword.isPending ? 'Updating…' : 'Update Password'}
              </Button>
            </div>
          </div>

          <div className="border-t border-[#3A6EA5]/20 pt-8">
            <h3 className="text-lg font-semibold text-[#1a1a1a] mb-4">Two-Factor Authentication</h3>
            <div className="flex items-center justify-between p-6 bg-white rounded-2xl">
              <div>
                <p className="font-medium text-[#1a1a1a]">Enable 2FA</p>
                <p className="text-sm text-[#4a5565] mt-1">
                  {twoFactorEnabled
                    ? 'Your account is protected with 2FA'
                    : 'Add an extra layer of security to your account'}
                </p>
              </div>
              <Switch
                checked={twoFactorEnabled}
                onCheckedChange={handle2FAToggle}
                className="data-[state=checked]:bg-[#3A6EA5]"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={show2FAModal} onOpenChange={setShow2FAModal}>
        <DialogContent className="bg-white rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl text-[#1a1a1a]">
              Enable Two-Factor Authentication
            </DialogTitle>
            <DialogDescription className="text-[#4a5565]">
              We'll send a verification code to your email to confirm
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="verification-code" className="text-[#1a1a1a] mb-2 block">
                Verification Code
              </Label>
              <Input
                id="verification-code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter 6-digit code"
                maxLength={6}
                className="bg-[#F2F4F6] rounded-xl border-[#3A6EA5]/20"
              />
            </div>
            <p className="text-sm text-[#4a5565]">
              A verification code has been sent to <strong>{apiProfile?.email}</strong>
            </p>
          </div>
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setShow2FAModal(false)
                setVerificationCode('')
              }}
              className="rounded-xl border-[#3A6EA5]/20"
            >
              Cancel
            </Button>
            <Button
              onClick={handleVerify2FA}
              className="bg-gradient-to-r from-[#3A6EA5] to-[#9CBBDC] hover:from-[#2a5a8a] hover:to-[#3A6EA5] text-white rounded-xl"
            >
              Verify & Enable
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
