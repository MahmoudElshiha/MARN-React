import { motion } from 'motion/react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { ProfileTab } from './profile-settings/ProfileTab'
import { SecurityTab } from './profile-settings/SecurityTab'
import { DocumentsTab } from './profile-settings/DocumentsTab'
import { RoommateTab } from './profile-settings/RoommateTab'

const TAB_TRIGGER_CLASS =
  'flex-1 rounded-xl py-2.5 text-sm font-medium text-[#4a5565] transition-all hover:text-[#3A6EA5] data-[state=active]:bg-white data-[state=active]:text-[#3A6EA5] data-[state=active]:shadow-sm'

export function ProfileSettingsPage() {
  return (
    <div className="min-h-screen py-20">
      <div className="max-w-[1440px] mx-auto px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-[#1a1a1a] mb-2">Account Settings</h1>
          <p className="text-lg text-[#4a5565] mb-8">
            Manage your account settings and preferences
          </p>

          <Tabs defaultValue="profile" className="space-y-8">
            <TabsList className="w-full h-auto bg-[#F2F4F6] p-1.5 rounded-2xl gap-1">
              <TabsTrigger value="profile" className={TAB_TRIGGER_CLASS}>
                Profile
              </TabsTrigger>
              <TabsTrigger value="security" className={TAB_TRIGGER_CLASS}>
                Security
              </TabsTrigger>
              <TabsTrigger value="documents" className={TAB_TRIGGER_CLASS}>
                Documents
              </TabsTrigger>
              <TabsTrigger value="roommate" className={TAB_TRIGGER_CLASS}>
                Roommate Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <ProfileTab />
            </TabsContent>
            <TabsContent value="security">
              <SecurityTab />
            </TabsContent>
            <TabsContent value="documents">
              <DocumentsTab />
            </TabsContent>
            <TabsContent value="roommate">
              <RoommateTab />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}
