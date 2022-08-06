import { useState } from 'react'
import { useAuth } from '../../context/auth'
import { Button, Avatar, Text } from '@chakra-ui/react'
import { logout } from '@/lib/auth'

export const CardUser = () => {
  const user = useAuth()

  if (!user) return null

  return (
    <>
      <Avatar src={user?.photoURL} />
      <Text>{user.name}</Text>
      <Button onClick={logout}>ログアウト</Button>
    </>
  )
}
