"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Play, Clock, CheckCircle, Calendar, Target, BookOpen, TrendingUp } from "lucide-react"
import PrivateLayout from "../layouts/PrivateLayout"
import type { Course } from "../types/Course"

interface Purchase {
  tenant_id: string
  order_id: string
  user_id: string
  curso_id: string
  quantity: number
  price: number
  timestamp: string
}

interface PurchasedCourse extends Course {
  purchase_date: string
  progress?: number
  last_accessed?: string
  completed?: boolean
}

export default function MyLearning() {
  const [purchasedCourses, setPurchasedCourses] = useState<PurchasedCourse[]>([])
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("all")

  const API_BASE_URL = "https://t1uohu23vl.execute-api.us-east-1.amazonaws.com/dev"

  const fetchPurchasesAndCourses = async () => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem("authToken")
      const tenantId = localStorage.getItem("tenantId")
      const userId = localStorage.getItem("userId")

      if (!userId) {
        setError("Debes iniciar sesión para ver tu aprendizaje")
        return
      }

      // 1. Obtener compras del usuario
      const purchasesResponse = await fetch(
        `${API_BASE_URL}/cursos?user_id=${userId}&limit=50`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        },
      )

      if (!purchasesResponse.ok) {
        throw new Error("Error al cargar las compras")
      }

      const purchasesData = await purchasesResponse.json()
      const userPurchases = purchasesData.compras || []
      setPurchases(userPurchases)

      // 2. Obtener detalles de cada curso comprado
      const coursePromises = userPurchases.map(async (purchase: Purchase) => {
        try {
          const courseResponse = await fetch(`${API_BASE_URL}/cursos/${purchase.curso_id}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `${token}`,
              "tenant-id": tenantId || "",
            },
          })

          if (courseResponse.ok) {
            const courseData = await courseResponse.json()
            const course = courseData.curso || courseData

            return {
              ...course,
              purchase_date: purchase.timestamp,
              progress: Math.floor(Math.random() * 100), // Simular progreso
              last_accessed: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
              completed: Math.random() > 0.7, // Simular algunos cursos completados
            } as PurchasedCourse
          }
        } catch (error) {
          console.error(`Error al obtener curso ${purchase.curso_id}:`, error)
        }
        return null
      })

      const coursesResults = await Promise.all(coursePromises)
      const validCourses = coursesResults.filter((course): course is PurchasedCourse => course !== null)

      setPurchasedCourses(validCourses)
    } catch (error) {
      setError("Error de conexión")
      console.error("❌ Error al obtener aprendizaje:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPurchasesAndCourses()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getProgressColor = (progress: number) => {
    if (progress === 0) return "bg-gray-200"
    if (progress < 30) return "bg-red-500"
    if (progress < 70) return "bg-yellow-500"
    return "bg-green-500"
  }

  const filteredCourses = purchasedCourses.filter((course) => {
    switch (activeTab) {
      case "completed":
        return course.completed
      case "in-progress":
        return !course.completed && (course.progress || 0) > 0
      case "not-started":
        return (course.progress || 0) === 0
      default:
        return true
    }
  })

  if (isLoading) {
    return (
      <PrivateLayout>
        <div className="min-h-screen bg-gray-50">
          {/* Header */}
          <div className="bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <h1 className="text-4xl font-bold mb-2">Mi Aprendizaje</h1>
              <p className="text-gray-300">Cargando tus cursos...</p>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="animate-pulse space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex space-x-4">
                    <div className="w-32 h-20 bg-gray-300 rounded"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                      <div className="h-2 bg-gray-300 rounded w-full"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </PrivateLayout>
    )
  }

  if (error) {
    return (
      <PrivateLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{error}</h2>
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
        {/* Header */}
        <div className="bg-gray-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-bold mb-6">Mi Aprendizaje</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="flex items-center">
                  <BookOpen className="h-8 w-8 text-purple-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-300">Total de Cursos</p>
                    <p className="text-2xl font-bold">{purchasedCourses.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="h-8 w-8 text-green-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-300">Completados</p>
                    <p className="text-2xl font-bold">{purchasedCourses.filter((c) => c.completed).length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="flex items-center">
                  <TrendingUp className="h-8 w-8 text-blue-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-300">En Progreso</p>
                    <p className="text-2xl font-bold">
                      {purchasedCourses.filter((c) => !c.completed && (c.progress || 0) > 0).length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="flex items-center">
                  <Target className="h-8 w-8 text-yellow-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-300">Sin Empezar</p>
                    <p className="text-2xl font-bold">
                      {purchasedCourses.filter((c) => (c.progress || 0) === 0).length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Learning Streak */}
            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Comienza una racha semanal</h3>
                  <p className="text-gray-300 text-sm">Mira 5 minutos de video por día para alcanzar tus objetivos.</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">0</div>
                    <div className="text-xs text-gray-400">semanas</div>
                    <div className="text-xs text-gray-400">Racha actual</div>
                  </div>
                  <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-gray-600 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-8">
              {[
                { id: "all", label: "Todos los cursos", count: purchasedCourses.length },
                {
                  id: "in-progress",
                  label: "En progreso",
                  count: purchasedCourses.filter((c) => !c.completed && (c.progress || 0) > 0).length,
                },
                { id: "completed", label: "Completados", count: purchasedCourses.filter((c) => c.completed).length },
                {
                  id: "not-started",
                  label: "Sin empezar",
                  count: purchasedCourses.filter((c) => (c.progress || 0) === 0).length,
                },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? "border-purple-500 text-purple-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Course List */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {filteredCourses.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {activeTab === "all"
                  ? "No tienes cursos aún"
                  : `No tienes cursos ${activeTab === "completed" ? "completados" : activeTab === "in-progress" ? "en progreso" : "sin empezar"}`}
              </h3>
              <p className="text-gray-600 mb-6">
                {activeTab === "all"
                  ? "Explora nuestros cursos y comienza tu aprendizaje"
                  : "Continúa aprendiendo para cambiar este estado"}
              </p>
              {activeTab === "all" && (
                <Link
                  to="/dashboard"
                  className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
                >
                  Explorar Cursos
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCourses.map((course) => (
                <div
                  key={course.curso_id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start space-x-4">
                    {/* Course Image */}
                    <div className="relative flex-shrink-0">
                      <img
                        src={course.imagen_url || "/placeholder.svg?height=80&width=120"}
                        alt={course.nombre}
                        className="w-32 h-20 object-cover rounded"
                      />
                      {course.completed && (
                        <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1">
                          <CheckCircle className="h-4 w-4" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black bg-opacity-40 rounded flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <Play className="h-6 w-6 text-white" />
                      </div>
                    </div>

                    {/* Course Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">{course.nombre}</h3>
                          <p className="text-sm text-gray-600 mb-2">Por {course.instructor || "Instructor"}</p>

                          {/* Progress Bar */}
                          <div className="mb-3">
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span className="text-gray-600">{course.progress || 0}% completado</span>
                              <span className="text-gray-500">{course.duracion || "8 horas"}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full transition-all ${getProgressColor(course.progress || 0)}`}
                                style={{ width: `${course.progress || 0}%` }}
                              ></div>
                            </div>
                          </div>

                          <div className="flex items-center text-sm text-gray-500 space-x-4">
                            <span className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              Comprado: {formatDate(course.purchase_date)}
                            </span>
                            {course.last_accessed && (
                              <span className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                Último acceso: {formatDate(course.last_accessed)}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col space-y-2 ml-4">
                          <Link
                            to={`/course/${course.curso_id}/learn`}
                            className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded transition-colors"
                          >
                            <Play className="h-4 w-4 mr-2" />
                            {course.progress === 0 ? "Empezar" : "Continuar"}
                          </Link>

                          <Link
                            to={`/course/${course.curso_id}`}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded transition-colors"
                          >
                            Ver detalles
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PrivateLayout>
  )
}
