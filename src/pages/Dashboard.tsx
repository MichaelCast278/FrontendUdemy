"use client"
import CourseSection from "../components/CourseSection"
import type React from "react"
import PrivateLayout from "../layouts/PrivateLayout"
import CarruselProBotones from "../components/CarouselLogin" // Asegúrate que la ruta esté bien
import type { Course } from "../types/Course" // ✅ Ajusta la ruta si tu archivo está en otra carpeta
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { ChevronLeft, ChevronRight, Star, Users, Clock, Play } from "lucide-react"

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
                  src={course.imagen_url || "/placeholder.svg?height=200&width=300"}
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
                  {course.categories?.length > 0 && (
                    <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">{course.categories[0]}</span>
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
  const API_BASE_URL = "https://9nas5ah2h8.execute-api.us-east-1.amazonaws.com/dev"
  const TENANT_ID = "UDEMY"

  // Fetch all courses
  const fetchCourses = async () => {
  try {
    setIsLoading(true)
    const response = await fetch(`${API_BASE_URL}/cursos?tenant_id=${TENANT_ID}&limit=20`)
    if (response.ok) {
      const data: ApiResponse = await response.json()
      console.log("✅ Cursos recibidos:", data.cursos)
      setAllCourses(data.cursos || [])
    } else {
      console.error("❌ Error HTTP:", response.statusText)
    }
  } catch (error) {
    console.error("❌ Error al hacer fetch:", error)
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
  console.log("✅ Cursos obtenidos del backend:", data.cursos)
  setAllCourses(data.cursos || [])
} else {
  console.error("❌ Error en fetch (response NOT ok):", response.status, response.statusText)
}

    } catch (error) {
  console.error("❌ Error al hacer fetch de cursos:", error)
}
 finally {
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

const coursesByCategory = allCourses.reduce<Record<string, Course[]>>((acc, course) => {
  if (course.categories && course.categories.length > 0) {
    course.categories.forEach((category) => {
      const key = category.toLowerCase().trim()
      if (!acc[key]) acc[key] = []
      acc[key].push(course)
    })
  } else {
    if (!acc["general"]) acc["general"] = []
    acc["general"].push(course)
  }
  return acc
}, {})


// ✅ Logs fuera del bloque
console.log("📦 Cursos agrupados por categoría:", coursesByCategory)
console.log("📦 Todas las categorías:", Object.keys(coursesByCategory))



// Extrae nombres de categorías (sin transformar)
const categoryNames = Object.keys(coursesByCategory).map(c => c.charAt(0).toUpperCase() + c.slice(1))

// Filtra usando claves normalizadas
const programacionCourses = coursesByCategory["programación"] || []
const desarrolloWebCourses = coursesByCategory["desarrollo web"] || []
const principiantesCourses = coursesByCategory["principiantes"] || []

const destacados = allCourses.slice(0, 12) // muestra 12 sin filtrar por rating


console.log("💻 Programación:", programacionCourses)
console.log("🌐 Desarrollo Web:", desarrolloWebCourses)
console.log("🎯 Principiantes:", principiantesCourses)
console.log("⭐ Destacados:", destacados)


  return (
    <PrivateLayout>
    <div className="min-h-screen bg-white">
      

      {/* Welcome Banner */}
      <section className="relative">
        {/* Carrusel de fondo */}
        <CarruselProBotones />

        
      </section>
    

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

      {/* Course Sections by Category */}
      <CourseCarousel title="Cursos recomendados" courses={destacados} isLoading={isLoading} />


      <CourseSection title="Cursos de Programación" courses={programacionCourses} isLoading={isLoading} />

      <CourseSection title="Desarrollo Web" courses={desarrolloWebCourses} isLoading={isLoading} />

      <CourseSection title="Para Principiantes" courses={principiantesCourses} isLoading={isLoading} />



      {/* All Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Explora por categoría</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categoryNames.map((categoryName) => (
              <Link
                key={categoryName}
                to={`/category/${categoryName.toLowerCase().replace(/\s+/g, "-")}`}
                className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow bg-white"
              >
                <div className="text-4xl mb-4">
                  {categoryName === "Programación" && "💻"}
                  {categoryName === "Desarrollo Web" && "🌐"}
                  {categoryName === "Principiantes" && "🎯"}
                  {!["Programación", "Desarrollo Web", "Principiantes"].includes(categoryName) && "📚"}
                </div>
                <h3 className="font-semibold text-gray-900">{categoryName}</h3>
                <p className="text-sm text-gray-600 mt-2">{coursesByCategory[categoryName].length} cursos</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </div>
    </PrivateLayout>
  )
}
