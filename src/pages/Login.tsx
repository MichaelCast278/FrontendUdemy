"use client"

import type React from "react"

import { useState } from "react"
import { Link , useNavigate} from "react-router-dom"
import Header from "../components/Header"

// TypeScript interfaces
interface LoginFormData {
  email: string
  password: string
  rememberMe: boolean
}

interface LoginErrors {
  email?: string
  password?: string
  general?: string
}

interface LoginData {
  user_id: string
  password: string
  tenant_id: string
}

export default function LoginPage() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
    rememberMe: false,
  })
  const navigate = useNavigate()
  const [errors, setErrors] = useState<LoginErrors>({})
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [showEmailForm, setShowEmailForm] = useState<boolean>(true)


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))

    // Clear error when user starts typing
    if (errors[name as keyof LoginErrors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = (): LoginErrors => {
    const newErrors: LoginErrors = {}

    if (!formData.email.trim()) {
      newErrors.email = "El correo electrónico es requerido"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Ingresa un correo electrónico válido"
    }

    if (!formData.password) {
      newErrors.password = "La contraseña es requerida"
    }

    return newErrors
  }

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault()

  const newErrors = validateForm()
  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors)
    return
  }

  setIsLoading(true)
  setErrors({})

  try {
    const loginData: LoginData = {
      user_id: formData.email,
      password: formData.password,
      tenant_id: "UDEMY",
    }

    const response = await fetch("https://f938pi8zxl.execute-api.us-east-1.amazonaws.com/dev/usuarios/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    })

    const result: {
      token: string
      user_id: string
      tenant_id: string
    } = await response.json()

    if (response.ok) {
      localStorage.setItem("authToken", result.token)
      localStorage.setItem("userId", result.user_id)
      localStorage.setItem("tenantId", result.tenant_id)

      navigate("/dashboard") // ✅ Redirige automáticamente
    } else {
      setErrors({ general: "Error en el inicio de sesión" })
    }
  } catch (error) {
    console.error("Login error:", error)
    setErrors({
      general: "Error de conexión. Por favor intenta nuevamente.",
    })
  } finally {
    setIsLoading(false)
  }
}


  const handleSocialLogin = (provider: string): void => {
    console.log(`Login with ${provider}`)
    alert(`Funcionalidad de ${provider} próximamente`)
  }

  const handleShowEmailForm = (): void => {
    setShowEmailForm(true)
  }

  const handleBackToMain = (): void => {
    setShowEmailForm(false)
    setErrors({})
    setFormData({ email: "", password: "", rememberMe: false })
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="min-h-screen flex">
        {/* Left side - Illustration */}
        <div className="hidden lg:flex lg:w-1/2 bg-white items-center justify-center p-8">
          <div className="max-w-md">
            <img
              src="../src/assets/image.png"
              alt="Ilustración de inicio de sesión"
              className="w-full h-auto"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = "/placeholder.jpg"
              }}
            />
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50 lg:bg-white">
          <div className="w-full max-w-sm">
            {!showEmailForm ? (
              <>
                {/* Main Login Options */}
                <div className="mb-8">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                    Inicia sesión para continuar tu experiencia de aprendizaje
                  </h1>
                </div>

                <div className="space-y-4">
                  {/* Google Login Button */}
                  <button
                    type="button"
                    onClick={() => handleSocialLogin("Google")}
                    className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Continuar con Google
                  </button>

                  {/* Email Login Option */}
                  <button
                    type="button"
                    onClick={handleShowEmailForm}
                    className="w-full text-center text-purple-600 hover:text-purple-700 font-medium py-2"
                  >
                    Iniciar sesión en una cuenta diferente
                  </button>
                </div>

                {/* Register Link */}
                <div className="mt-8 text-center">
                  <span className="text-sm text-gray-600">
                    ¿No tienes una cuenta?{" "}
                    <Link to="/register" className="text-purple-600 hover:underline font-medium">
                      Regístrate
                    </Link>
                  </span>
                </div>

                {/* Organization Login */}
                <div className="mt-4 text-center">
                  <button
                    type="button"
                    className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                    onClick={() => alert("Funcionalidad próximamente")}
                  >
                    Inicia sesión con tu organización
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Email/Password Form */}
                <div className="mb-8">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">Iniciar sesión con correo electrónico</h1>
                  <p className="text-gray-600 text-sm">
                    Ingresa tu correo electrónico y contraseña para acceder a tu cuenta
                  </p>
                </div>

                {errors.general && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600">{errors.general}</p>
                  </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                  {/* Email Field */}
                  <div>
                    <input
                      type="email"
                      name="email"
                      placeholder="Correo electrónico"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border ${
                        errors.email ? "border-red-300" : "border-gray-300"
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                  </div>

                  {/* Password Field */}
                  <div>
                    <input
                      type="password"
                      name="password"
                      placeholder="Contraseña"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border ${
                        errors.password ? "border-red-300" : "border-gray-300"
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                    />
                    {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                  </div>

                  {/* Remember Me and Forgot Password */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="rememberMe"
                        id="rememberMe"
                        checked={formData.rememberMe}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                      <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-700">
                        Recordarme
                      </label>
                    </div>

                    <button
                      type="button"
                      className="text-sm text-purple-600 hover:text-purple-700"
                      onClick={() => alert("Funcionalidad próximamente")}
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  </div>

                  {/* Login Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-3 px-4 rounded-md text-white font-medium ${
                      isLoading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                    }`}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Iniciando sesión...
                      </div>
                    ) : (
                      "Iniciar sesión"
                    )}
                  </button>

                  {/* Back Button */}
                  <button
                    type="button"
                    onClick={handleBackToMain}
                    className="w-full text-center text-purple-600 hover:text-purple-700 font-medium py-2"
                  >
                    ← Volver a opciones de inicio de sesión
                  </button>
                </form>

                {/* Register Link */}
                <div className="mt-6 text-center">
                  <span className="text-sm text-gray-600">
                    ¿No tienes una cuenta?{" "}
                    <Link to="/register" className="text-purple-600 hover:underline font-medium">
                      Regístrate
                    </Link>
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
