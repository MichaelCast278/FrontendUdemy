import HeaderPrivado from "../components/HeaderPrivate"
import Footer from "../components/Footer"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken")
    if (!token) {
      navigate("/login")
    } else {
      setIsAuthenticated(true)
    }
  }, [navigate])

  if (isAuthenticated === null) {
    return null // o un loader si prefieres
  }

  return (
    <div className="min-h-screen bg-white">
      <HeaderPrivado />
      {children}
      <Footer />
    </div>
  )
}
