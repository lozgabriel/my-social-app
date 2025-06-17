// components/LoginButton.tsx
'use client'

import { signIn, signOut, useSession } from 'next-auth/react'

export default function LoginButton() {
  const { data: session } = useSession()

  if (session) {
    return (
      <div>
        <p>Olá, {session.user?.name}</p>
        <button onClick={() => signOut()}>Sair</button>
      </div>
    )
  }

  return <button onClick={() => signIn('google')}>Entrar com Google</button>
}
