import React, { useState } from 'react'
import { useTheme } from '@mui/material/styles'
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import { Link } from 'react-router-dom'

interface IconWithHoverProps {
  lightStatic: string
  darkStatic: string
  lightGif: string
  darkGif: string
  alt: string
  link: any
  label: string
}

const IconWithHover: React.FC<IconWithHoverProps> = ({
  lightStatic,
  darkStatic,
  lightGif,
  darkGif,
  alt,
  link,
  label,
}) => {
  const theme = useTheme()
  const [isHovered, setIsHovered] = useState(false)

  const staticImage = theme.palette.mode === 'dark' ? darkStatic : lightStatic
  const gifImage = theme.palette.mode === 'dark' ? darkGif : lightGif

  return (
    <Link
      to={link}
      onMouseEnter={() => {
        setIsHovered(true)
      }}
      onMouseLeave={() => {
        setIsHovered(false)
      }}
    >
      <ListItem disablePadding>
        <ListItemButton>
          <ListItemIcon>
            <div
              style={{ width: '24px', height: '24px', position: 'relative' }}
            >
              <img
                id="myImg"
                src={isHovered ? gifImage : staticImage}
                alt={alt}
                onMouseEnter={() => {
                  setIsHovered(true)
                  console.log('Mouse entered')
                }}
                onMouseLeave={() => setIsHovered(false)}
                style={{ width: '24px', height: '24px' }} // Example dimensions
              />
            </div>
          </ListItemIcon>
          <ListItemText primary={label} />
        </ListItemButton>
      </ListItem>
    </Link>
  )
}

export default IconWithHover
