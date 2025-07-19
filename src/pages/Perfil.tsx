"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import {
  User,
  Mail,
  Phone,
  Globe,
  Edit3,
  Camera,
  Settings,
  Bell,
  CreditCard,
  Shield,
  Users,
  X,
  Save,
  Eye,
} from "lucide-react"
import PrivateLayout from "../layouts/PrivateLayout"

interface UserProfile {
  // Campos obligatorios
  tenant_id: string
  user_id: string
  nombre: string
  apellido: string
  telefono: string

  // Campos opcionales
  titulo?: string
  biografia?: string
  idioma?: string
  email?: string
  fecha_registro?: string
  avatar_url?: string
  website?: string
  facebook?: string
  twitter?: string
  linkedin?: string
  ubicacion?: string
  fecha_nacimiento?: string
}

export default function Profile() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState<Partial<UserProfile>>({})

  const API_BASE_URL = "https://f938pi8zxl.execute-api.us-east-1.amazonaws.com/dev"

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem("authToken")


      if (!token) {
        setError("Debes iniciar sesión para ver tu perfil")
        return
      }

      const response = await fetch(`${API_BASE_URL}/usuarios/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        console.log("✅ Perfil de usuario obtenido:", data)
        setUser(data.usuario || data)
        setEditForm(data.usuario || data)
      } else {
        setError("Error al cargar el perfil")
      }
    } catch (error) {
      setError("Error de conexión")
      console.error("❌ Error al obtener perfil:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUserProfile()
  }, [])

  const handleEditToggle = () => {
    setIsEditing(!isEditing)
    if (!isEditing && user) {
      setEditForm({ ...user })
    }
  }

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSaveProfile = async () => {
    try {
      console.log("Guardando perfil:", editForm)
      setUser((prev) => ({ ...prev, ...editForm }) as UserProfile)
      setIsEditing(false)
    } catch (error) {
      console.error("Error al guardar perfil:", error)
    }
  }

  const getInitials = (nombre?: string, apellido?: string) => {
  const initialNombre = nombre?.charAt(0) || ""
  const initialApellido = apellido?.charAt(0) || ""
  return `${initialNombre}${initialApellido}`.toUpperCase()
}


  const formatDate = (dateString?: string) => {
    if (!dateString) return "No especificado"
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (isLoading) {
    return (
      <PrivateLayout>
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="animate-pulse">
              <div className="bg-white rounded-lg shadow-sm p-8">
                <div className="flex items-center space-x-6 mb-8">
                  <div className="w-24 h-24 bg-gray-300 rounded-full"></div>
                  <div className="space-y-2">
                    <div className="h-6 bg-gray-300 rounded w-48"></div>
                    <div className="h-4 bg-gray-300 rounded w-32"></div>
                  </div>
                </div>
                <div className="space-y-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-4 bg-gray-300 rounded w-full"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </PrivateLayout>
    )
  }

  if (error || !user) {
    return (
      <PrivateLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{error || "Perfil no encontrado"}</h2>
            <Link to="/dashboard" className="text-purple-600 hover:text-purple-800 font-medium">
              Volver al dashboard
            </Link>
          </div>
        </div>
      </PrivateLayout>
    )
  }

  return (
    <PrivateLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                {/* Profile Avatar Section */}
                <div className="p-6 text-center border-b border-gray-200">
                  <div className="relative inline-block">
                    {user.avatar_url ? (
                      <img
                        src={user.avatar_url || "/placeholder.svg"}
                        alt={`${user.nombre} ${user.apellido}`}
                        className="w-24 h-24 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-gray-900 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                        {getInitials(user.nombre, user.apellido)}
                      </div>
                    )}
                    <button className="absolute bottom-0 right-0 bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-full transition-colors">
                      <Camera className="h-4 w-4" />
                    </button>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-gray-900">
                    {user.nombre} {user.apellido}
                  </h3>
                  {user.titulo && <p className="text-sm text-gray-600 mt-1">{user.titulo}</p>}
                </div>

                {/* Navigation Menu */}
                <nav className="p-4">
                  <ul className="space-y-2">
                    <li>
                      <button className="w-full text-left px-3 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-md">
                        <Eye className="h-4 w-4 inline mr-2" />
                        Ver perfil público
                      </button>
                    </li>
                    <li>
                      <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
                        <User className="h-4 w-4 inline mr-2" />
                        Perfil
                      </button>
                    </li>
                    <li>
                      <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
                        <Camera className="h-4 w-4 inline mr-2" />
                        Foto
                      </button>
                    </li>
                    <li>
                      <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
                        <Shield className="h-4 w-4 inline mr-2" />
                        Seguridad de la cuenta
                      </button>
                    </li>
                    <li>
                      <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
                        <Users className="h-4 w-4 inline mr-2" />
                        Suscripciones
                      </button>
                    </li>
                    <li>
                      <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
                        <CreditCard className="h-4 w-4 inline mr-2" />
                        Métodos de pago
                      </button>
                    </li>
                    <li>
                      <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
                        <Settings className="h-4 w-4 inline mr-2" />
                        Privacidad
                      </button>
                    </li>
                    <li>
                      <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
                        <Bell className="h-4 w-4 inline mr-2" />
                        Preferencias de notificación
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-sm">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Perfil público</h1>
                    <p className="text-sm text-gray-600 mt-1">Agrega información sobre ti</p>
                  </div>
                  <button
                    onClick={handleEditToggle}
                    className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-md transition-colors"
                  >
                    {isEditing ? (
                      <>
                        <X className="h-4 w-4 mr-2" />
                        Cancelar
                      </>
                    ) : (
                      <>
                        <Edit3 className="h-4 w-4 mr-2" />
                        Editar perfil
                      </>
                    )}
                  </button>
                </div>

                {/* Profile Form */}
                <div className="p-6 space-y-8">
                  {/* Información Básica */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Información básica:</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nombre *</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editForm.nombre || ""}
                            onChange={(e) => handleInputChange("nombre", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            required
                          />
                        ) : (
                          <p className="text-gray-900 py-2">{user.nombre}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Apellido *</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editForm.apellido || ""}
                            onChange={(e) => handleInputChange("apellido", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            required
                          />
                        ) : (
                          <p className="text-gray-900 py-2">{user.apellido}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono *</label>
                        {isEditing ? (
                          <input
                            type="tel"
                            value={editForm.telefono || ""}
                            onChange={(e) => handleInputChange("telefono", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            required
                          />
                        ) : (
                          <p className="text-gray-900 py-2 flex items-center">
                            <Phone className="h-4 w-4 mr-2 text-gray-500" />
                            {user.telefono}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        {isEditing ? (
                          <input
                            type="email"
                            value={editForm.email || ""}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        ) : (
                          <p className="text-gray-900 py-2 flex items-center">
                            <Mail className="h-4 w-4 mr-2 text-gray-500" />
                            {user.email || user.user_id || "No especificado"}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Título profesional */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Título profesional</label>
                    <div className="relative">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editForm.titulo || ""}
                          onChange={(e) => handleInputChange("titulo", e.target.value)}
                          placeholder="Ej. Instructor en Udemy o Arquitecto"
                          maxLength={60}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-gray-900 py-2">{user.titulo || "Agrega un título profesional"}</p>
                      )}
                      {isEditing && (
                        <span className="absolute right-3 top-2 text-xs text-gray-400">
                          {(editForm.titulo || "").length}/60
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Agrega un título profesional como Instructor en Udemy o Arquitecto.
                    </p>
                  </div>

                  {/* Biografía */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Biografía</label>
                    {isEditing ? (
                      <textarea
                        value={editForm.biografia || ""}
                        onChange={(e) => handleInputChange("biografia", e.target.value)}
                        placeholder="Cuéntanos sobre ti..."
                        rows={6}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                      />
                    ) : (
                      <div className="min-h-[120px] p-3 border border-gray-200 rounded-md bg-gray-50">
                        <p className="text-gray-900 whitespace-pre-wrap">
                          {user.biografia || "Agrega información sobre tu experiencia y conocimientos..."}
                        </p>
                      </div>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Los enlaces y códigos de cupón no están permitidos en esta sección.
                    </p>
                  </div>

                  {/* Idioma */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Idioma</label>
                    {isEditing ? (
                      <select
                        value={editForm.idioma || "es"}
                        onChange={(e) => handleInputChange("idioma", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="es">Español</option>
                        <option value="en">English (US)</option>
                        <option value="fr">Français</option>
                        <option value="de">Deutsch</option>
                        <option value="pt">Português</option>
                      </select>
                    ) : (
                      <p className="text-gray-900 py-2">
                        {user.idioma === "es"
                          ? "Español"
                          : user.idioma === "en"
                            ? "English (US)"
                            : user.idioma || "Español"}
                      </p>
                    )}
                  </div>

                  {/* Enlaces */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Enlaces:</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Sitio web</label>
                        {isEditing ? (
                          <input
                            type="url"
                            value={editForm.website || ""}
                            onChange={(e) => handleInputChange("website", e.target.value)}
                            placeholder="Website (http(s)://...)"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        ) : (
                          <p className="text-gray-900 py-2 flex items-center">
                            <Globe className="h-4 w-4 mr-2 text-gray-500" />
                            {user.website ? (
                              <a
                                href={user.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-purple-600 hover:text-purple-800"
                              >
                                {user.website}
                              </a>
                            ) : (
                              "No especificado"
                            )}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Facebook</label>
                        {isEditing ? (
                          <div className="flex">
                            <span className="inline-flex items-center px-3 py-2 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm rounded-l-md">
                              facebook.com/
                            </span>
                            <input
                              type="text"
                              value={editForm.facebook || ""}
                              onChange={(e) => handleInputChange("facebook", e.target.value)}
                              placeholder="Username"
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                          </div>
                        ) : (
                          <p className="text-gray-900 py-2">
                            {user.facebook ? `facebook.com/${user.facebook}` : "No especificado"}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          Ingresa tu nombre de usuario de Facebook (ej. johnsmith).
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Información adicional */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Información adicional:</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Ubicación</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editForm.ubicacion || ""}
                            onChange={(e) => handleInputChange("ubicacion", e.target.value)}
                            placeholder="Ciudad, País"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        ) : (
                          <p className="text-gray-900 py-2">{user.ubicacion || "No especificado"}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de registro</label>
                        <p className="text-gray-900 py-2">{formatDate(user.fecha_registro)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Save Button */}
                  {isEditing && (
                    <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                      <button
                        onClick={handleEditToggle}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleSaveProfile}
                        className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors flex items-center"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Guardar cambios
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PrivateLayout>
  )
}
