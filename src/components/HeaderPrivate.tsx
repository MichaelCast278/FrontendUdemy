"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Search, ShoppingCart, Heart, Bell, Globe, ChevronDown, BookOpen, LogOut } from "lucide-react"

interface UserData {
  user_id: string
  nombre?: string
  apellido?: string
  tenant_id: string
}

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<UserData | null>(null)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showCategoriesMenu, setShowCategoriesMenu] = useState(false)
  const navigate = useNavigate()

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken")
      const userId = localStorage.getItem("userId") || sessionStorage.getItem("userId")
      const tenantId = localStorage.getItem("tenantId") || sessionStorage.getItem("tenantId")

      if (token && userId) {
        setIsAuthenticated(true)
        setUser({
          user_id: userId,
          tenant_id: tenantId || "UDEMY",
        })
      } else {
        setIsAuthenticated(false)
        setUser(null)
      }
    }

    checkAuthStatus()

    // Listen for storage changes (when user logs in/out in another tab)
    window.addEventListener("storage", checkAuthStatus)
    return () => window.removeEventListener("storage", checkAuthStatus)
  }, [])

  const handleLogout = () => {
    // Clear all auth data
    localStorage.removeItem("authToken")
    localStorage.removeItem("userId")
    localStorage.removeItem("tenantId")
    sessionStorage.removeItem("authToken")
    sessionStorage.removeItem("userId")
    sessionStorage.removeItem("tenantId")

    setIsAuthenticated(false)
    setUser(null)
    setShowUserMenu(false)
    navigate("/")
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const getUserInitial = () => {
    if (user?.nombre) {
      return user.nombre.charAt(0).toUpperCase()
    }
    if (user?.user_id) {
      return user.user_id.charAt(0).toUpperCase()
    }
    return "U"
  }

  const getUserName = () => {
    if (user?.nombre && user?.apellido) {
      return `${user.nombre} ${user.apellido}`
    }
    if (user?.nombre) {
      return user.nombre
    }
    if (user?.user_id) {
      const name = user.user_id.split("@")[0]
      return name.charAt(0).toUpperCase() + name.slice(1)
    }
    return "Usuario"
  }

  return (
    <>
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50 shadow">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left side */}
            <div className="flex items-center space-x-4">
              {/* Logo */}
              <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center">
                <img src="/src/assets/udemy.svg" alt="Logo Udemy" className="h-8 w-auto" />
              </Link>

              {/* Categories - Only show when authenticated */}
              {isAuthenticated && (
                <div className="hidden lg:flex items-center">
                  <div className="relative">
                    <button
                      onClick={() => setShowCategoriesMenu(!showCategoriesMenu)}
                      className="flex items-center space-x-1 text-gray-700 hover:text-purple-600 font-medium px-3 py-2"
                    >
                      <span>Explorar</span>
                      <ChevronDown className="h-4 w-4" />
                    </button>

                  </div>
                </div>
              )}
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl mx-8">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Busca cualquier tema"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  {/* Authenticated Navigation */}
                  <Link
                    to="/business"
                    className="hidden lg:inline-flex text-sm text-gray-700 hover:text-purple-600 font-medium"
                  >
                    Udemy Business
                  </Link>

                  <Link
                    to="/teach"
                    className="hidden lg:inline-flex text-sm text-gray-700 hover:text-purple-600 font-medium"
                  >
                    Enseña en Udemy
                  </Link>

                  <Link
                    to="/my-learning"
                    className="hidden lg:inline-flex text-sm text-gray-700 hover:text-purple-600 font-medium"
                  >
                    Mi aprendizaje
                  </Link>

                  {/* Wishlist */}
                  <Link to="/wishlist" className="p-2 text-gray-700 hover:text-purple-600 relative">
                    <Heart className="w-5 h-5" />
                  </Link>

                  {/* Shopping Cart */}
                  <Link to="/cart" className="p-2 text-gray-700 hover:text-purple-600 relative">
                    <ShoppingCart className="w-5 h-5" />
                  </Link>

                  {/* Notifications */}
                  <button className="p-2 text-gray-700 hover:text-purple-600 relative">
                    <Bell className="w-5 h-5" />
                  </button>

                  {/* User Menu */}
                  <div className="relative">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100"
                    >
                      <div className="w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-medium">
                        {getUserInitial()}
                      </div>
                    </button>

                    {showUserMenu && (
                      <div className="absolute right-0 top-full mt-1 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                        <div className="p-4 border-b border-gray-200">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center text-lg font-medium">
                              {getUserInitial()}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{getUserName()}</p>
                              <p className="text-sm text-gray-500">{user?.user_id}</p>
                            </div>
                          </div>
                        </div>

                        <div className="py-2">
                          <Link
                            to="/my-learning"
                            className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <BookOpen className="w-4 h-4" />
                            <span>Mi aprendizaje</span>
                          </Link>

                          <Link
                            to="/profile"
                            className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <BookOpen className="w-4 h-4" />
                            <span>Mi perfil</span>
                          </Link>

                          <Link
                            to="/account"
                            className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <span>Cuenta</span>
                          </Link>

                          <div className="border-t border-gray-200 my-2"></div>

                          <button
                            onClick={handleLogout}
                            className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Cerrar sesión</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Language/Globe */}
                  <button className="p-2 text-gray-700 hover:text-purple-600">
                    <Globe className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <>
                  {/* Public Navigation */}
                  <button className="p-2 text-gray-700 hover:text-purple-600">
                    <ShoppingCart className="w-6 h-6" />
                  </button>

                  <Link
                    to="/login"
                    className="hidden sm:inline-flex px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium"
                  >
                    Iniciar sesión
                  </Link>

                  <Link
                    to="/register"
                    className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-md font-medium"
                  >
                    Regístrate
                  </Link>

                  <button className="p-2 text-gray-700 hover:text-purple-600">
                    <Globe className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Click outside to close menus */}
        {(showUserMenu || showCategoriesMenu) && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => {
              setShowUserMenu(false)
              setShowCategoriesMenu(false)
            }}
          />
        )}
      </header>
    </>
  )
}
