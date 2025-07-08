"use client"

import type React from "react"

import { useState } from "react"
import { Link } from "react-router-dom"
import Header from "../components/Header"

// TypeScript interfaces
interface FormData {
  fullName: string
  email: string
  password: string
  receiveOffers: boolean
}

interface FormErrors {
  fullName?: string
  email?: string
  password?: string
  general?: string
}

interface RegistrationData {
  user_id: string
  password: string
  tenant_id: string
  nombre: string
  apellido: string
  idioma: string
}

export default function RegisterPage() {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    password: "",
    receiveOffers: false,
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [showPasswordStep, setShowPasswordStep] = useState<boolean>(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateFirstStep = (): FormErrors => {
    const newErrors: FormErrors = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = "El nombre completo es requerido"
    }

    if (!formData.email.trim()) {
      newErrors.email = "El correo electrónico es requerido"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Ingresa un correo electrónico válido"
    }

    return newErrors
  }

  const validatePassword = (): FormErrors => {
    const newErrors: FormErrors = {}

    if (!formData.password) {
      newErrors.password = "La contraseña es requerida"
    } else if (formData.password.length < 8) {
      newErrors.password = "La contraseña debe tener al menos 8 caracteres"
    }

    return newErrors
  }

  const handleContinueWithEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!showPasswordStep) {
      // First step validation
      const newErrors = validateFirstStep()
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors)
        return
      }
      setShowPasswordStep(true)
      setErrors({})
    } else {
      // Second step - password and registration
      const passwordErrors = validatePassword()
      if (Object.keys(passwordErrors).length > 0) {
        setErrors(passwordErrors)
        return
      }

      await handleRegistration()
    }
  }

  const handleRegistration = async (): Promise<void> => {
    setIsLoading(true)
    setErrors({})

    try {
      // Split full name into nombre and apellido
      const nameParts = formData.fullName.trim().split(" ")
      const nombre = nameParts[0] || ""
      const apellido = nameParts.slice(1).join(" ") || ""

      // Prepare data for your Lambda API
      const registrationData: RegistrationData = {
        user_id: formData.email, // Using email as user_id as per your Lambda
        password: formData.password,
        tenant_id: "default_tenant", // You might want to make this dynamic
        nombre: nombre,
        apellido: apellido,
        idioma: "es", // Default to Spanish
      }

      // Call your Lambda API
      const response = await fetch("https://mkztxsodkb.execute-api.us-east-1.amazonaws.com/dev/usuarios/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registrationData),
      })

      const result = await response.json()

      if (response.ok && result.statusCode === 200) {
        window.location.href = "/login" // O muestra un mensaje de éxito y redirige manualmente
      }
      else {
        // Handle API errors
        setErrors({
          general: result.response?.error || "Error en el registro. Intenta nuevamente.",
        })
      }
    } catch (error) {
      console.error("Registration error:", error)
      setErrors({
        general: "Error de conexión. Por favor intenta nuevamente.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = (provider: string): void => {
    // Implement social login logic here
    console.log(`Login with ${provider}`)
    alert(`Funcionalidad de ${provider} próximamente`)
  }

  const handleBackToFirstStep = (): void => {
    setShowPasswordStep(false)
    setErrors({})
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
              alt="Ilustración de registro"
              className="w-full h-auto"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = "/placeholder.svg?height=400&width=400"
              }}
            />
          </div>
        </div>

        {/* Right side - Registration Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50 lg:bg-white">
          <div className="w-full max-w-sm">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {showPasswordStep ? "Crear contraseña" : "Registrarse con correo electrónico"}
              </h1>
              {showPasswordStep && (
                <p className="text-gray-600 text-sm">Ingresa una contraseña para tu cuenta {formData.email}</p>
              )}
            </div>

            {errors.general && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{errors.general}</p>
              </div>
            )}

            <form onSubmit={handleContinueWithEmail} className="space-y-4">
              {!showPasswordStep ? (
                <>
                  {/* Full Name Field */}
                  <div>
                    <input
                      type="text"
                      name="fullName"
                      placeholder="Nombre completo"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border ${
                        errors.fullName ? "border-red-300" : "border-gray-300"
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                    />
                    {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
                  </div>

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

                  {/* Offers Checkbox */}
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      name="receiveOffers"
                      id="receiveOffers"
                      checked={formData.receiveOffers}
                      onChange={handleInputChange}
                      className="mt-1 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <label htmlFor="receiveOffers" className="ml-3 text-sm text-gray-700">
                      Quiero recibir ofertas especiales, recomendaciones personalizadas y consejos de aprendizaje.
                    </label>
                  </div>
                </>
              ) : (
                <>
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
                    <p className="mt-1 text-xs text-gray-500">Mínimo 8 caracteres</p>
                  </div>

                  {/* Back Button */}
                  <button
                    type="button"
                    onClick={handleBackToFirstStep}
                    className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                  >
                    ← Volver
                  </button>
                </>
              )}

              {/* Continue Button */}
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
                    {showPasswordStep ? "Creando cuenta..." : "Continuando..."}
                  </div>
                ) : (
                  <>
                    <span className="mr-2">✉</span>
                    {showPasswordStep ? "Crear cuenta" : "Continuar con correo electrónico"}
                  </>
                )}
              </button>
            </form>

            {!showPasswordStep && (
              <>
                {/* Divider */}
                <div className="my-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">Otras opciones de registro</span>
                    </div>
                  </div>
                </div>

                {/* Social Login Buttons */}
                <div className="space-y-3">
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

                  <button
                    type="button"
                    onClick={() => handleSocialLogin("Facebook")}
                    className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <svg className="w-5 h-5 mr-3" fill="#1877F2" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    Continuar con Facebook
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSocialLogin("Apple")}
                    className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <svg className="w-5 h-5 mr-3" fill="#000000" viewBox="0 0 24 24">
                      <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
                    </svg>
                    Continuar con Apple
                  </button>
                </div>
              </>
            )}

            {/* Terms and Privacy */}
            <div className="mt-6 text-xs text-center text-gray-500">
              Al registrarte, aceptas nuestras{" "}
              <Link to="/terms" className="text-purple-600 hover:underline">
                Condiciones de uso
              </Link>{" "}
              y nuestra{" "}
              <Link to="/privacy" className="text-purple-600 hover:underline">
                Política de privacidad
              </Link>
              .
            </div>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <span className="text-sm text-gray-600">
                ¿Ya tienes una cuenta?{" "}
                <Link to="/login" className="text-purple-600 hover:underline font-medium">
                  Iniciar sesión
                </Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
