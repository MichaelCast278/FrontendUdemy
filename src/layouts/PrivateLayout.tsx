import HeaderPrivado from "../components/HeaderPrivate"
import Footer from "../components/Footer"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken")
    if (!token) {
      navigate("/login")
    }
  }, [navigate])

  return (
    <div className="min-h-screen bg-white">
      <HeaderPrivado />
      {children}
      <Footer />
    </div>
  )
}
