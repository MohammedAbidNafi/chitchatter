import { PropsWithChildren, useContext } from 'react'
import { Theme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import MuiDrawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import MuiLink from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import GitInfo from 'react-git-info/macro'

import { routes } from 'config/routes'
import { SettingsContext } from 'contexts/SettingsContext'
import { ColorMode } from 'models/settings'
import IconWithHover from './IconWithHover'

const { commit } = GitInfo()

export const drawerWidth = 240

export interface DrawerProps extends PropsWithChildren {
  isDrawerOpen: boolean
  onDrawerClose: () => void
  theme: Theme
}

export const Drawer = ({ isDrawerOpen, onDrawerClose, theme }: DrawerProps) => {
  const settingsContext = useContext(SettingsContext)
  const colorMode = settingsContext.getUserSettings().colorMode

  const handleColorModeToggleClick = () => {
    const newMode =
      colorMode === ColorMode.LIGHT ? ColorMode.DARK : ColorMode.LIGHT
    settingsContext.updateUserSettings({ colorMode: newMode })
  }

  return (
    <MuiDrawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
      variant="persistent"
      anchor="left"
      open={isDrawerOpen}
    >
      <Box
        sx={theme => ({
          display: 'flex',
          alignItems: 'center',
          padding: theme.spacing(0, 1),
          // necessary for drawer content to be pushed below app bar
          ...theme.mixins.toolbar,
          justifyContent: 'flex-end',
        })}
      >
        <IconButton onClick={onDrawerClose} aria-label="Close menu">
          {theme.direction === 'ltr' ? (
            <ChevronLeftIcon />
          ) : (
            <ChevronRightIcon />
          )}
        </IconButton>
      </Box>
      <Divider />
      <List role="navigation" aria-label="Navigation menu">
        <IconWithHover
          lightStatic="/src/img/lmHomepng.png"
          darkStatic="/src/img/dmHomepng.png"
          lightGif="/src/img/lmHomegif.gif"
          darkGif="/src/img/dmHomegif.gif"
          alt="Home"
          link={routes.ROOT}
          label="Home"
        />
        <IconWithHover
          lightStatic="/src/img/lmSettingpng.png"
          darkStatic="/src/img/dmSettingpng.png"
          lightGif="/src/img/lmSettinggif.gif"
          darkGif="/src/img/dmSettinggif.gif"
          alt="Settings"
          link={routes.SETTINGS}
          label="Settings"
        />
        <IconWithHover
          lightStatic="/src/img/lmAboutpng.png"
          darkStatic="/src/img/dmAboutpng.png"
          lightGif="/src/img/lmAboutgif.gif"
          darkGif="/src/img/dmAboutgif.gif"
          alt="About"
          link={routes.ABOUT}
          label="About"
        />
        <IconWithHover
          lightStatic="/src/img/lmDisclaimerpng.png"
          darkStatic="/src/img/dmDisclaimerpng.png"
          lightGif="/src/img/lmDisclaimergif.gif"
          darkGif="/src/img/dmDisclaimergif.gif"
          alt="Disclaimer"
          link={routes.DISCLAIMER}
          label="Disclaimer"
        />

        <ListItem disablePadding>
          <ListItemButton onClick={handleColorModeToggleClick}>
            <ListItemIcon>
              {theme.palette.mode === 'dark' ? (
                <Brightness7Icon />
              ) : (
                <Brightness4Icon />
              )}
            </ListItemIcon>
            <ListItemText primary="Change theme" />
          </ListItemButton>
        </ListItem>
        <Divider />
        <ListItem>
          <Typography variant="subtitle2">
            Build signature:{' '}
            <Typography
              sx={{
                fontFamily: 'monospace',
                display: 'inline',
              }}
            >
              <MuiLink
                target="_blank"
                rel="noopener"
                href={`${import.meta.env.VITE_GITHUB_REPO}/commit/${
                  commit.hash
                }`}
              >
                {commit.shortHash}
              </MuiLink>
            </Typography>
          </Typography>
        </ListItem>
      </List>
    </MuiDrawer>
  )
}
