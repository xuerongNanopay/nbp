import IconHeaderWithLogout  from '@/components/header/IconHeaderWithLogout'
import { AlertProvider } from "@/hook/useAlert"

// TODO: redirect to API sign out.
export default function OnboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <IconHeaderWithLogout className="mb-8"></IconHeaderWithLogout>
      <AlertProvider>
        <div className="flex justify-center px-4 lg:px-0">
          {children}
        </div>
      </AlertProvider>
    </div>
  )
}
