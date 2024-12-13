import React, { useEffect, useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../../src/components/ui/button'

import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Cached from '@mui/icons-material/Cached'
import useTheme from '@mui/material/styles/useTheme'
import styled from '@mui/material/styles/styled'

import { v4 as uuid } from 'uuid'

import { routes } from 'config/routes'
import { ShellContext } from 'contexts/ShellContext'
import { PeerNameDisplay } from 'components/PeerNameDisplay'
import { Form, Main } from 'components/Elements'
import Logo from 'img/logo.svg?react'

import { CommunityRoomSelector } from './CommunityRoomSelector'

const StyledLogo = styled(Logo)({})

interface HomeProps {
  userId: string
}

export function Home({ userId }: HomeProps) {
  const { setTitle } = useContext(ShellContext)
  const theme = useTheme()
  const [roomName, setRoomName] = useState(uuid())
  // const [showEmbedCode, setShowEmbedCode] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    setTitle('QuickP2P')
  }, [setTitle])

  const handleRoomNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    setRoomName(value)
  }

  const handleFormSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault()
  }

  const handleJoinPublicRoomClick = () => {
    navigate(`/public/${roomName}`)
  }

  const handleJoinPrivateRoomClick = () => {
    navigate(`/private/${roomName}`)
  }

  // const handleGetEmbedCodeClick = () => {
  //   setShowEmbedCode(true)
  // }

  // const handleEmbedCodeWindowClose = () => {
  //   setShowEmbedCode(false)
  // }

  const isRoomNameValid = roomName.length > 0

  return (
    <Box className="Home">
      <Main
        sx={{
          maxWidth: theme.breakpoints.values.md,
          mt: 3,
          mx: 'auto',
          px: 2,
          textAlign: 'center',
        }}
      >
        <Link to={routes.ABOUT}>
          <StyledLogo
            sx={{
              px: 0.5,
              pb: 2,
              mx: 'auto',
              maxWidth: theme.breakpoints.values.sm,
            }}
          />
        </Link>
        <Form
          onSubmit={handleFormSubmit}
          sx={{ maxWidth: theme.breakpoints.values.sm, mx: 'auto' }}
        >
          <Typography sx={{ mb: 2 }}>
            Your username:{' '}
            <PeerNameDisplay paragraph={false} sx={{ fontWeight: 'bold' }}>
              {userId}
            </PeerNameDisplay>
          </Typography>
          <FormControl fullWidth>
            <TextField
              label="Room name (generated on your device)"
              variant="outlined"
              value={roomName}
              onChange={handleRoomNameChange}
              InputProps={{
                endAdornment: (
                  <IconButton
                    aria-label="Regenerate room id"
                    onClick={() => setRoomName(uuid())}
                    size="small"
                  >
                    <Cached />
                  </IconButton>
                ),
                sx: { fontSize: { xs: '0.9rem', sm: '1rem' } },
              }}
              size="medium"
            />
          </FormControl>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Button
              className="mt-2 ml-2"
              onClick={handleJoinPublicRoomClick}
              variant={'default'}
              disabled={!isRoomNameValid}
            >
              Join public room
            </Button>
            <Button
              className="mt-2 ml-2"
              variant={'default'}
              onClick={handleJoinPrivateRoomClick}
              disabled={!isRoomNameValid}
            >
              Join private room
            </Button>
            {/* <Button
              className="mt-2 ml-2"
              variant="secondary"
              onClick={handleGetEmbedCodeClick}
              disabled={!isRoomNameValid}
            >
              Get embeded code
            </Button> */}
          </Box>
        </Form>
      </Main>
      <Divider sx={{ my: 2 }} />
      <Box maxWidth={theme.breakpoints.values.sm} mx="auto" px={2}>
        <CommunityRoomSelector />
      </Box>
      <Divider sx={{ my: 2 }} />
    </Box>
  )
}
