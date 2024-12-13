import { useContext, useEffect, useState } from 'react'
import FileReaderInput, { Result } from 'react-file-reader-input'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import useTheme from '@mui/material/styles/useTheme'

import { settings } from 'services/Settings'
import { notification } from 'services/Notification'
import { ShellContext } from 'contexts/ShellContext'

import { StorageContext } from 'contexts/StorageContext'
import { SettingsContext } from 'contexts/SettingsContext'
import { PeerNameDisplay } from 'components/PeerNameDisplay'
import { ConfirmDialog } from 'components/ConfirmDialog'

import { Switch } from '../../src/components/ui/switch'

import { Button } from '../../src/components/ui/button'

import { isErrorWithMessage } from '../../lib/type-guards'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../src/components/ui/card'

interface SettingsProps {
  userId: string
}

export const Settings = ({ userId }: SettingsProps) => {
  const theme = useTheme()

  const { setTitle, showAlert } = useContext(ShellContext)
  const { updateUserSettings, getUserSettings } = useContext(SettingsContext)
  const { getPersistedStorage } = useContext(StorageContext)
  const [
    isDeleteSettingsConfirmDiaglogOpen,
    setIsDeleteSettingsConfirmDiaglogOpen,
  ] = useState(false)
  const [, setIsNotificationPermissionDetermined] = useState(false)
  const {
    playSoundOnNewMessage,
    showNotificationOnNewMessage,
    showActiveTypingStatus,
  } = getUserSettings()

  const persistedStorage = getPersistedStorage()

  useEffect(() => {
    ;(async () => {
      await notification.requestPermission()

      // This state needs to be set to cause a rerender so that
      // areNotificationsAvailable is up-to-date.
      setIsNotificationPermissionDetermined(true)
    })()
  }, [])

  useEffect(() => {
    setTitle('Settings')
  }, [setTitle])

  const handlePlaySoundOnNewMessageChange = (checked: boolean) => {
    updateUserSettings({ playSoundOnNewMessage: checked })
  }

  const handleShowNotificationOnNewMessageChange = (checked: boolean) => {
    updateUserSettings({ showNotificationOnNewMessage: checked })
  }

  const handleShowActiveTypingStatusChange = (checked: boolean) => {
    updateUserSettings({ showActiveTypingStatus: checked })
  }

  const handleDeleteSettingsClick = () => {
    setIsDeleteSettingsConfirmDiaglogOpen(true)
  }

  const handleDeleteSettingsCancel = () => {
    setIsDeleteSettingsConfirmDiaglogOpen(false)
  }

  const handleDeleteSettingsConfirm = async () => {
    await persistedStorage.clear()
    window.location.reload()
  }

  const handleExportSettingsClick = async () => {
    try {
      await settings.exportSettings(getUserSettings())
    } catch (e) {
      if (isErrorWithMessage(e)) {
        showAlert(e.message, { severity: 'error' })
      }
    }
  }

  const handleImportSettingsClick = async ([[, file]]: Result[]) => {
    try {
      const userSettings = await settings.importSettings(file)

      updateUserSettings(userSettings)

      showAlert('Profile successfully imported', { severity: 'success' })
    } catch (e) {
      if (isErrorWithMessage(e)) {
        showAlert(e.message, { severity: 'error' })
      }
    }
  }

  const areNotificationsAvailable = notification.permission === 'granted'

  return (
    <Box sx={{ p: 4, mx: 'auto', maxWidth: theme.breakpoints.values.md }}>
      <Typography
        variant="h2"
        sx={{
          fontSize: theme.typography.h3.fontSize,
          fontWeight: theme.typography.fontWeightMedium,
          mb: 4,
        }}
      >
        Chat
      </Typography>
      <Card className="mb-4 p-4">
        <CardContent>
          <CardHeader className="-ml-10">
            <CardTitle>Background Message Handling</CardTitle>
            <CardDescription>
              When a message is received in the background:
            </CardDescription>
          </CardHeader>
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  className="mr-3"
                  checked={playSoundOnNewMessage}
                  onCheckedChange={handlePlaySoundOnNewMessageChange}
                />
              }
              label="Play a sound"
              className="mb-4"
            />
            <FormControlLabel
              control={
                <Switch
                  className="mr-3"
                  checked={
                    areNotificationsAvailable && showNotificationOnNewMessage
                  }
                  onCheckedChange={handleShowNotificationOnNewMessageChange}
                  disabled={!areNotificationsAvailable}
                />
              }
              label={
                <span className="text-gray-700 dark:text-gray-300">
                  Show a notification
                </span>
              }
              className="mb-4"
            />
          </FormGroup>
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  className="mr-3"
                  checked={showActiveTypingStatus}
                  onCheckedChange={handleShowActiveTypingStatusChange}
                />
              }
              label="Show active typing indicators"
              className="mb-4"
            />
          </FormGroup>
          <Typography variant="subtitle2">
            Disabling this will also hide your active typing status from others.
          </Typography>
        </CardContent>
      </Card>
      <Divider sx={{ my: 4 }} />
      <Typography
        variant="h2"
        sx={{
          fontSize: theme.typography.h3.fontSize,
          fontWeight: theme.typography.fontWeightMedium,
          mb: 4,
        }}
      >
        Data
      </Typography>
      <Card className="mb-4 p-2">
        <CardHeader>
          <CardTitle>Export profile data</CardTitle>
          <CardDescription>
            {' '}
            Export your QuickP2P profile data so that it can be moved to another
            browser or device.{' '}
            <strong>
              Be careful not to share the exported data with anyone
            </strong>
            . It contains your unique verification keys.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button variant={'default'} onClick={handleExportSettingsClick}>
            Export profile data
          </Button>
        </CardFooter>
      </Card>
      <Card className="mb-4 p-2">
        <CardHeader>
          <CardTitle>Import profile data</CardTitle>
          <CardDescription>
            Import your QuickP2P profile that was previously exported from
            another browser or device.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <FileReaderInput
            {...{
              as: 'text',
              onChange: (_e, results) => {
                handleImportSettingsClick(results)
              },
            }}
          >
            <Button color="warning" variant="default">
              Import profile data
            </Button>
          </FileReaderInput>
        </CardFooter>
      </Card>
      <Card className="mb-4 p-2">
        <CardHeader>
          <CardTitle>Delete all profile data</CardTitle>
          <CardDescription>
            <strong>Be careful with this</strong>. This will cause your user
            name to change from{' '}
            <strong>
              <PeerNameDisplay
                sx={{
                  fontWeight: theme.typography.fontWeightMedium,
                }}
              >
                {userId}
              </PeerNameDisplay>
            </strong>{' '}
            to a new, randomly-assigned name. It will also reset all of your
            saved QuickP2P application preferences.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button
            className="mb-4"
            variant="destructive"
            color="error"
            onClick={handleDeleteSettingsClick}
          >
            Delete all data and restart
          </Button>
        </CardFooter>
      </Card>
      <ConfirmDialog
        isOpen={isDeleteSettingsConfirmDiaglogOpen}
        onCancel={handleDeleteSettingsCancel}
        onConfirm={handleDeleteSettingsConfirm}
      />
    </Box>
  )
}
