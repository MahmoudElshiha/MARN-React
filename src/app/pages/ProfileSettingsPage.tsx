import { motion } from 'motion/react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { ProfileTab } from './profile-settings/ProfileTab'
import { SecurityTab } from './profile-settings/SecurityTab'
import { DocumentsTab } from './profile-settings/DocumentsTab'
import { RoommateTab } from './profile-settings/RoommateTab'

import { useTranslation } from 'react-i18next'

const TAB_TRIGGER_CLASS =
  'px-6 py-2.5 rounded-full text-sm font-medium text-[#4a5565] transition-all hover:text-[#3A6EA5] data-[state=active]:bg-white data-[state=active]:text-[#3A6EA5] data-[state=active]:shadow-sm'

export function ProfileSettingsPage() {
  const { t, i18n } = useTranslation('profile')
  const isRTL = i18n.dir() === 'rtl'

  return (
    <div className="min-h-screen py-20" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-[1440px] mx-auto px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-[#1a1a1a] mb-2">
            {t('title')}
          </h1>
          <p className="text-lg text-[#4a5565] mb-8">
            {t('subtitle')}
          </p>

          <Tabs defaultValue="profile" className="space-y-8" dir={isRTL ? 'rtl' : 'ltr'}>
            <TabsList className="w-fit h-auto bg-[#E5E7EB] p-1.5 rounded-full gap-1">
              <TabsTrigger value="profile" className={TAB_TRIGGER_CLASS}>
                {t('tabs.profile')}
              </TabsTrigger>
              <TabsTrigger value="security" className={TAB_TRIGGER_CLASS}>
                {t('tabs.security')}
              </TabsTrigger>
              <TabsTrigger value="documents" className={TAB_TRIGGER_CLASS}>
                {t('tabs.documents')}
              </TabsTrigger>
              <TabsTrigger value="roommate" className={TAB_TRIGGER_CLASS}>
                {t('tabs.roommate')}
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
