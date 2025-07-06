"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import Header from "../components/Header"
import Footer from "../components/Footer"
import { ChevronLeft, ChevronRight, Star, Users, Clock, Play } from "lucide-react"

// TypeScript interfaces
interface Course {
  curso_id: string
  tenant_id: string
  nombre: string
  descripcion?: string
  instructor?: string
  precio?: number
  precio_original?: number
  rating?: number
  estudiantes?: string
  duracion?: string
  imagen?: string
  categoria?: string
  nivel?: string
}

interface ApiResponse {
  message: string
  cursos: Course[]
  lastEvaluatedKey?: string
}

interface CourseCarouselProps {
  title: string
  courses: Course[]
  isLoading: boolean
}

const CourseCarousel: React.FC<CourseCarouselProps> = ({ title, courses, isLoading }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const coursesPerView = 4

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + coursesPerView >= courses.length ? 0 : prev + coursesPerView))
  }

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev - coursesPerView < 0 ? Math.max(0, courses.length - coursesPerView) : prev - coursesPerView,
    )
  }

  if (isLoading) {
    return (
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-300 h-40 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-3 bg-gray-300 rounded mb-2 w-3/4"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (courses.length === 0) {
    return (
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>
          <p className="text-gray-600">No hay cursos disponibles en este momento.</p>
        </div>
      </section>
    )
  }

  const visibleCourses = courses.slice(currentIndex, currentIndex + coursesPerView)

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <div className="flex space-x-2">
            <button
              onClick={prevSlide}
              disabled={currentIndex === 0}
              className="p-2 rounded-full border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={nextSlide}
              disabled={currentIndex + coursesPerView >= courses.length}
              className="p-2 rounded-full border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {visibleCourses.map((course) => (
            <Link
              key={course.curso_id}
              to={`/course/${course.curso_id}`}
              className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow group"
            >
              <div className="relative">
                <img
                  src={course.imagen || "/placeholder.svg?height=200&width=300"}
                  alt={course.nombre}
                  className="w-full h-40 object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = "/placeholder.svg?height=200&width=300"
                  }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity flex items-center justify-center">
                  <Play className="h-12 w-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{course.nombre}</h3>
                <p className="text-sm text-gray-600 mb-2">{course.instructor || "Instructor"}</p>

                <div className="flex items-center mb-2">
                  <span className="text-yellow-500 text-sm font-semibold mr-1">{course.rating || 4.5}</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${
                          i < Math.floor(course.rating || 4.5) ? "text-yellow-400 fill-current" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500 ml-2">({course.estudiantes || "1,234"})</span>
                </div>

                <div className="flex items-center text-xs text-gray-500 mb-2">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>{course.duracion || "8 horas"}</span>
                  <Users className="h-3 w-3 ml-3 mr-1" />
                  <span>{course.nivel || "Principiante"}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-gray-900">${course.precio || 84.99}</span>
                    {course.precio_original && (
                      <span className="text-sm text-gray-500 line-through ml-2">${course.precio_original}</span>
                    )}
                  </div>
                  {course.categoria && (
                    <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">{course.categoria}</span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function Dashboard() {
  const [allCourses, setAllCourses] = useState<Course[]>([])
  const [searchResults, setSearchResults] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [searchLoading, setSearchLoading] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [userName, setUserName] = useState<string>("Antonio")

  // Base URL for your API
  const API_BASE_URL = "https://zjhs634u92.execute-api.us-east-1.amazonaws.com/dev"
  const TENANT_ID = "UDEMY"

  // Fetch all courses
  const fetchCourses = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`${API_BASE_URL}/cursos?tenant_id=${TENANT_ID}&limit=20`)

      if (response.ok) {
        const data: ApiResponse = await response.json()
        setAllCourses(data.cursos || [])
      } else {
        console.error("Error fetching courses:", response.statusText)
      }
    } catch (error) {
      console.error("Error fetching courses:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Search courses by name
  const searchCourses = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    try {
      setSearchLoading(true)
      const response = await fetch(
        `${API_BASE_URL}/cursos/search?tenant_id=${TENANT_ID}&name=${encodeURIComponent(query)}&limit=12`,
      )

      if (response.ok) {
        const data: ApiResponse = await response.json()
        setSearchResults(data.cursos || [])
      } else {
        console.error("Error searching courses:", response.statusText)
        setSearchResults([])
      }
    } catch (error) {
      console.error("Error searching courses:", error)
      setSearchResults([])
    } finally {
      setSearchLoading(false)
    }
  }

  // Handle search input
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)

    // Debounce search
    const timeoutId = setTimeout(() => {
      searchCourses(query)
    }, 500)

    return () => clearTimeout(timeoutId)
  }

  useEffect(() => {
    fetchCourses()

    // Get user name from localStorage if available
    const storedUserId = localStorage.getItem("userId") || sessionStorage.getItem("userId")
    if (storedUserId) {
      const name = storedUserId.split("@")[0]
      setUserName(name.charAt(0).toUpperCase() + name.slice(1))
    }
  }, [])

  // Categorize courses for different sections
  const featuredCourses = allCourses.slice(0, 8)
  const recommendedCourses = allCourses.slice(8, 16)
  const popularCourses = allCourses.slice(16, 24)

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Welcome Banner */}
      <section className="bg-gradient-to-r from-orange-300 to-orange-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="bg-white p-6 rounded-lg shadow-sm max-w-md">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Te extrañamos, {userName}</h1>
                <p className="text-gray-600 mb-4">
                  Vuelve a la pista y logra tus objetivos. 5-10 minutos al día es todo lo que necesitas.
                </p>
                <Link to="/learning" className="text-purple-600 hover:text-purple-700 font-medium underline">
                  Volver a la pista
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <img
                src="/images/welcome-banner.png"
                alt="Welcome illustration"
                className="h-48 w-auto"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = "/placeholder.svg?height=200&width=300"
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Search Bar */}
      <section className="py-6 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="¿Qué quieres aprender?"
              value={searchQuery}
              onChange={handleSearch}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>
      </section>

      {/* Search Results */}
      {searchQuery && (
        <CourseCarousel
          title={`Resultados de búsqueda para "${searchQuery}"`}
          courses={searchResults}
          isLoading={searchLoading}
        />
      )}

      {/* Business Training Banner */}
      <section className="py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-900 text-white p-4 rounded-lg flex items-center justify-between">
            <div>
              <span className="text-sm">
                ¿Entrenas a 2 o más personas? Obtén acceso de tu equipo a los más de 30,000 cursos principales de Udemy.
              </span>
            </div>
            <div className="flex space-x-2">
              <button className="bg-white text-gray-900 px-4 py-2 rounded text-sm font-medium hover:bg-gray-100">
                Obtener Udemy Business
              </button>
              <button className="text-white border border-white px-4 py-2 rounded text-sm hover:bg-white hover:text-gray-900">
                Descartar
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Course Sections */}
      <CourseCarousel title="Qué aprender a continuación" courses={featuredCourses} isLoading={isLoading} />

      <CourseCarousel title="Porque viste cursos de desarrollo" courses={recommendedCourses} isLoading={isLoading} />

      <CourseCarousel title="Los estudiantes están viendo" courses={popularCourses} isLoading={isLoading} />

      <CourseCarousel title="Recomendado para ti" courses={allCourses.slice(0, 12)} isLoading={isLoading} />

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Explora por categoría</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Link
              to="/category/development"
              className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow bg-white"
            >
              <div className="text-4xl mb-4">💻</div>
              <h3 className="font-semibold text-gray-900">Desarrollo</h3>
              <p className="text-sm text-gray-600 mt-2">Más de 1,500 cursos</p>
            </Link>
            <Link
              to="/category/business"
              className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow bg-white"
            >
              <div className="text-4xl mb-4">💼</div>
              <h3 className="font-semibold text-gray-900">Negocios</h3>
              <p className="text-sm text-gray-600 mt-2">Más de 2,000 cursos</p>
            </Link>
            <Link
              to="/category/design"
              className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow bg-white"
            >
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="font-semibold text-gray-900">Diseño</h3>
              <p className="text-sm text-gray-600 mt-2">Más de 800 cursos</p>
            </Link>
            <Link
              to="/category/marketing"
              className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow bg-white"
            >
              <div className="text-4xl mb-4">📈</div>
              <h3 className="font-semibold text-gray-900">Marketing</h3>
              <p className="text-sm text-gray-600 mt-2">Más de 1,200 cursos</p>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
