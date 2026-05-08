import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { baseSepolia } from '@reown/appkit/networks'
import { createAppKit } from '@reown/appkit/react'
import { QueryClient } from '@tanstack/react-query'
import { http } from 'wagmi'

export const projectId = '4342fb30e173a60c65a462d4e2ca74f5'

const BASE_SEPOLIA_RPC =
  (import.meta.env.VITE_RPC_URL as string) ||
  'https://base-sepolia.g.alchemy.com/v2/Redbml0XPUbqstAj_4947'

export const wagmiAdapter = new WagmiAdapter({
  networks: [baseSepolia],
  projectId,
  ssr: false,
  transports: {
    [baseSepolia.id]: http(BASE_SEPOLIA_RPC),
  },
})

export const queryClient = new QueryClient()

createAppKit({
  adapters: [wagmiAdapter],
  networks: [baseSepolia],
  defaultNetwork: baseSepolia,
  projectId,
  metadata: {
    name: 'Kreo',
    description: "Kreo - The creator economy's investment platform",
    url: 'https://creo-protocol.xyz',
    icons: ['https://avatars.githubusercontent.com/u/179229932'],
  },
  features: {
    analytics: false,
    email: false,
    socials: false,
  },
})
