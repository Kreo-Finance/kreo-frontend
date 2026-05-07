import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { baseSepolia, base } from '@reown/appkit/networks'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider, http } from 'wagmi'

const projectId = '4342fb30e173a60c65a462d4e2ca74f5'

const metadata = {
  name: 'Kreo',
  description: "Kreo - The creator economy's investment platform",
  url: 'https://creo-protocol.xyz',
  icons: ['https://assets.reown.com/reown-profile-pic.png'],
}

const networks = [baseSepolia, base] as [typeof baseSepolia, ...typeof base[]]

// Use Alchemy RPC for Base Sepolia to avoid public-node rate limits on writes.
// VITE_RPC_URL is the VITE_-prefixed copy of RPC_URL in .env (Vite only exposes VITE_ vars).
const BASE_SEPOLIA_RPC =
  import.meta.env.VITE_RPC_URL as string ||
  'https://base-sepolia.g.alchemy.com/v2/Redbml0XPUbqstAj_4947'

const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: false,
  transports: {
    [baseSepolia.id]: http(BASE_SEPOLIA_RPC),
    [base.id]: http(),
  },
})

createAppKit({
  adapters: [wagmiAdapter],
  networks,
  defaultNetwork: baseSepolia,
  projectId,
  metadata,
  features: { analytics: true },
})

const queryClient = new QueryClient()

export function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
