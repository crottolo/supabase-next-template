'use client'

import { useEffect, useState } from 'react'

interface FlowiseChatProps {
  chatflowid: string
  apiHost: string
}

export default function FlowiseChat({ chatflowid, apiHost }: FlowiseChatProps) {
  const [BubbleChat, setBubbleChat] = useState<any>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Import dinamico solo lato client
    import('flowise-embed-react')
      .then((module) => {
        setBubbleChat(() => module.BubbleChat)
        setIsLoaded(true)
      })
      .catch((error) => {
        console.error('Errore caricamento BubbleChat:', error)
      })
  }, [])

  // Renderizza solo quando il componente è caricato lato client
  if (!isLoaded || !BubbleChat) {
    return null // Nessun loading indicator per evitare flash
  }

  return (
    <BubbleChat
      chatflowid={chatflowid}
      apiHost={apiHost}
    />
  )
} 