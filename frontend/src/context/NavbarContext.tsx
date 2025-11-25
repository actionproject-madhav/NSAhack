import { createContext, useContext, useState, ReactNode } from 'react'

interface NavbarContextType {
  hideNavbar: boolean
  setHideNavbar: (hide: boolean) => void
  navbarVisible: boolean
  setNavbarVisible: (visible: boolean) => void
}

const NavbarContext = createContext<NavbarContextType | undefined>(undefined)

export const NavbarProvider = ({ children }: { children: ReactNode }) => {
  const [hideNavbar, setHideNavbar] = useState(false)
  const [navbarVisible, setNavbarVisible] = useState(true)

  return (
    <NavbarContext.Provider value={{ hideNavbar, setHideNavbar, navbarVisible, setNavbarVisible }}>
      {children}
    </NavbarContext.Provider>
  )
}

export const useNavbar = () => {
  const context = useContext(NavbarContext)
  if (!context) {
    throw new Error('useNavbar must be used within NavbarProvider')
  }
  return context
}

