"use client"
import type React from "react"
import PrivateLayout from "../layouts/PrivateLayout"
import CarruselProBotones from "../components/CarouselLogin"
import type { Course } from "../types/Course"
import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react"

// Importar los componentes necesarios
import CourseCardWithTooltip from "../components/Tooltip"
import CourseCardEnhanced from "../components/CourseCard"

interface ApiResponse {
  message: string
  cursos: Course[]
  lastEvaluatedKey?: string
}

interface Purchase {
  tenant_id: string
  order_id: string
  user_id: string
  curso_id: string
  quantity: number
  price: number
  timestamp: string
}

interface CourseCarouselProps {
  title: string
  courses: Course[]
  isLoading: boolean
  purchasedCourseIds: Set<string>
  showViewMore?: boolean
  categorySlug?: string
  maxCourses?: number
}

const CourseCarousel: React.FC<CourseCarouselProps> = ({
  title,
  courses,
  isLoading,
  purchasedCourseIds,
  showViewMore = false,
  categorySlug,
  maxCourses = 20,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const navigate = useNavigate()
  const coursesPerView = 4

  // Limitar cursos según maxCourses
  const limitedCourses = courses.slice(0, maxCourses)

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + coursesPerView >= limitedCourses.length ? 0 : prev + coursesPerView))
  }

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev - coursesPerView < 0 ? Math.max(0, limitedCourses.length - coursesPerView) : prev - coursesPerView,
    )
  }

  // Handle course click - navigate to course detail
  const handleCourseClick = (courseId: string) => {
    navigate(`/course/${courseId}`)
  }

  if (isLoading) {
    return (
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            <div className="h-6 bg-gray-300 rounded w-20 animate-pulse"></div>
          </div>
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
    return null // No mostrar sección si no hay cursos
  }

  const visibleCourses = limitedCourses.slice(currentIndex, currentIndex + coursesPerView)

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {courses.length} curso{courses.length !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="flex items-center space-x-4">
            {/* Ver más button */}
            {showViewMore && categorySlug && courses.length > maxCourses && (
              <Link
                to={`/category/${categorySlug}`}
                className="flex items-center text-purple-600 hover:text-purple-800 font-medium text-sm transition-colors"
              >
                Ver más
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            )}

            {/* Navigation arrows */}
            {limitedCourses.length > coursesPerView && (
              <div className="flex space-x-2">
                <button
                  onClick={prevSlide}
                  disabled={currentIndex === 0}
                  className="p-2 rounded-full border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={nextSlide}
                  disabled={currentIndex + coursesPerView >= limitedCourses.length}
                  className="p-2 rounded-full border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Progress indicator */}
        {limitedCourses.length > coursesPerView && (
          <div className="flex justify-center mb-4">
            <div className="flex space-x-2">
              {Array.from({ length: Math.ceil(limitedCourses.length / coursesPerView) }).map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-8 rounded-full transition-colors ${
                    Math.floor(currentIndex / coursesPerView) === index ? "bg-purple-600" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {visibleCourses.map((course) => {
            const isPurchased = purchasedCourseIds.has(course.curso_id)

            return (
              <CourseCardWithTooltip
                key={course.curso_id}
                course={course}
                showTooltip={true}
                onCourseClick={handleCourseClick}
                isPurchased={isPurchased}
              >
                <CourseCardEnhanced course={course} isPurchased={isPurchased} />
              </CourseCardWithTooltip>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default function Dashboard() {
  const [allCourses, setAllCourses] = useState<Course[]>([])
  const [coursesByCategory, setCoursesByCategory] = useState<Record<string, Course[]>>({})
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [purchasedCourseIds, setPurchasedCourseIds] = useState<Set<string>>(new Set())

  // Base URLs for APIs
  const COURSES_API_BASE_URL = "https://y8h2ktpj0j.execute-api.us-east-1.amazonaws.com/dev"
  const PURCHASES_API_BASE_URL = "https://sxaiwtfebc.execute-api.us-east-1.amazonaws.com/dev"

  // Mapeo de categorías para títulos más amigables
  const categoryTitles: Record<string, string> = {
    "desarrollo web": "Desarrollo Web",
    "full stack": "Full Stack Development",
    negocios: "Negocios Digitales",
    management: "Management y Liderazgo",
    devops: "DevOps y Cloud",
    kubernetes: "Kubernetes",
    docker: "Docker",
    seguridad: "Ciberseguridad",
    cybersecurity: "Cybersecurity",
    móvil: "Desarrollo Móvil",
    ios: "Desarrollo iOS",
    flutter: "Flutter",
    diseño: "Diseño",
    gráfico: "Diseño Gráfico",
    programación: "Programación",
  }

  // Iconos para cada categoría
  const categoryIcons: Record<string, string> = {
    "desarrollo web": "🌐",
    "full stack": "⚡",
    negocios: "💼",
    management: "👔",
    devops: "🚀",
    kubernetes: "☸️",
    docker: "🐳",
    seguridad: "🔒",
    cybersecurity: "🛡️",
    móvil: "📱",
    ios: "🍎",
    flutter: "🦋",
    diseño: "🎨",
    gráfico: "🖼️",
    programación: "💻",
  }

  // Fetch user purchases
  const fetchPurchases = async () => {
    try {
      const token = localStorage.getItem("authToken")
      const userId = localStorage.getItem("userId")

      if (!userId || !token) {
        console.log("No user ID or token found, skipping purchases fetch")
        return
      }

      const response = await fetch(`${PURCHASES_API_BASE_URL}/compras?user_id=${userId}&limit=100`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        console.log("✅ Compras obtenidas:", data)
        const userPurchases = data.compras || []
        setPurchases(userPurchases)

        // Create Set of purchased course IDs for quick lookup
        const purchasedIds = new Set<string>(userPurchases.map((purchase: Purchase) => purchase.curso_id))
        setPurchasedCourseIds(purchasedIds)
        console.log("📦 Cursos comprados:", Array.from(purchasedIds))
      } else {
        console.error("❌ Error al obtener compras:", response.status)
      }
    } catch (error) {
      console.error("❌ Error al hacer fetch de compras:", error)
    }
  }

  // Fetch courses by category
  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)

  const fetchCoursesByCategory = async (category: string) => {
    try {
      const token = localStorage.getItem("authToken")
      const categoryFormatted = capitalize(category)
      const tenantId = "UDEMY"
      const url = `${COURSES_API_BASE_URL}/cursos/category?category=${encodeURIComponent(categoryFormatted)}&tenant_id=${tenantId}`

      console.log(`📡 Fetching courses for category: ${categoryFormatted}`)

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      })

      if (response.ok) {
        const data: ApiResponse = await response.json()
        console.log(`✅ Cursos de ${categoryFormatted}:`, data.cursos?.length || 0)
        return data.cursos || []
      } else {
        console.error(`❌ Error fetching ${categoryFormatted}:`, response.status)
        return []
      }
    } catch (error) {
      console.error(`❌ Error al hacer fetch de ${category}:`, error)
      return []
    }
  }

  // Fetch all courses
  const fetchAllCourses = async () => {
    try {
      const token = localStorage.getItem("authToken")
      const tenantId = "UDEMY"
      const url = `${COURSES_API_BASE_URL}/cursos?tenant_id=${tenantId}`

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      })

      if (response.ok) {
        const data: ApiResponse = await response.json()
        console.log("📦 Todos los cursos:", data.cursos?.length || 0)
        setAllCourses(data.cursos || [])
        return data.cursos || []
      } else {
        console.error("❌ Error HTTP:", response.status, response.statusText)
        return []
      }
    } catch (error) {
      console.error("❌ Error al hacer fetch:", error)
      return []
    }
  }

  // Load courses by categories
  const loadCoursesByCategories = async () => {
    try {
      setIsLoading(true)

      // Primero obtenemos todos los cursos para tener una vista general
      const allCoursesData = await fetchAllCourses()

      // Lista de categorías predefinidas para consultar
      const predefinedCategories = [
        "desarrollo web",
        "full stack",
        "negocios",
        "management",
        "devops",
        "kubernetes",
        "docker",
        "seguridad",
        "cybersecurity",
        "móvil",
        "ios",
        "flutter",
        "diseño",
        "gráfico",
        "programación",
      ]

      // Fetch courses for each category
      const categoryPromises = predefinedCategories.map(async (category) => {
        const courses = await fetchCoursesByCategory(category)
        return { category, courses }
      })

      const categoryResults = await Promise.all(categoryPromises)

      // Organizar cursos por categoría
      const organizedCourses: Record<string, Course[]> = {}
      categoryResults.forEach(({ category, courses }) => {
        if (courses.length > 0) {
          organizedCourses[category] = courses
        }
      })

      setCoursesByCategory(organizedCourses)
      console.log("📚 Cursos organizados por categoría:", organizedCourses)
    } catch (error) {
      console.error("❌ Error loading courses by categories:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([loadCoursesByCategories(), fetchPurchases()])
    }

    loadData()
  }, [])

  // Obtener categorías que tienen cursos
  const availableCategories = Object.keys(coursesByCategory).filter(
    (category) => coursesByCategory[category].length > 0,
  )

  // Nuestros mejores cursos (rating >= 4.3)
  const bestCourses = allCourses
    .filter((course) => (course.rating || 0) >= 4.3)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 20)

  return (
    <PrivateLayout>
      <div className="min-h-screen bg-white">
        {/* Welcome Banner */}
        <section className="relative">
          <CarruselProBotones />
        </section>

        {/* Business Training Banner */}
        <section className="py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-purple-900 to-blue-900 text-white p-6 rounded-lg flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold mb-2">🚀 Impulsa tu carrera profesional</h3>
                <p className="text-sm opacity-90">
                  Accede a más de {allCourses.length} cursos especializados en las tecnologías más demandadas del
                  mercado
                </p>
              </div>
              <div className="flex space-x-2">
                <Link
                  to="/categories"
                  className="bg-white text-purple-900 px-4 py-2 rounded text-sm font-medium hover:bg-gray-100 transition-colors"
                >
                  Ver todas las categorías
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Best Courses Section */}
        {bestCourses.length > 0 && (
          <CourseCarousel
            title="⭐ Nuestros Mejores Cursos"
            courses={bestCourses}
            isLoading={isLoading}
            purchasedCourseIds={purchasedCourseIds}
            maxCourses={20}
          />
        )}

        {/* Dynamic Category Sections */}
        {availableCategories.map((category) => {
          const courses = coursesByCategory[category]
          const title = categoryTitles[category] || category.charAt(0).toUpperCase() + category.slice(1)
          const icon = categoryIcons[category] || "📚"
          const categorySlug = category.toLowerCase().replace(/\s+/g, "-")

          return (
            <CourseCarousel
              key={category}
              title={`${icon} ${title}`}
              courses={courses}
              isLoading={isLoading}
              purchasedCourseIds={purchasedCourseIds}
              showViewMore={true}
              categorySlug={categorySlug}
              maxCourses={20}
            />
          )
        })}

        {/* All Categories Grid */}
        {availableCategories.length > 0 && (
          <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">Explora por categoría</h2>
              <p className="text-gray-600 text-center mb-12">Encuentra el curso perfecto para tu carrera profesional</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {availableCategories.map((category) => {
                  const courses = coursesByCategory[category]
                  const title = categoryTitles[category] || category.charAt(0).toUpperCase() + category.slice(1)
                  const icon = categoryIcons[category] || "📚"

                  return (
                    <Link
                      key={category}
                      to={`/category/${category.toLowerCase().replace(/\s+/g, "-")}`}
                      className="group text-center p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-all bg-white hover:border-purple-300"
                    >
                      <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{icon}</div>
                      <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                        {title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {courses.length} curso{courses.length !== 1 ? "s" : ""}
                      </p>
                      <div className="mt-3 text-xs text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        Ver todos →
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        {/* Loading State */}
        {isLoading && availableCategories.length === 0 && (
          <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Cargando cursos...</p>
              </div>
            </div>
          </section>
        )}

        {/* Empty State */}
        {!isLoading && availableCategories.length === 0 && (
          <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <div className="text-6xl mb-4">📚</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">No hay cursos disponibles</h2>
              <p className="text-gray-600">Vuelve más tarde para ver nuevos cursos.</p>
            </div>
          </section>
        )}
      </div>
    </PrivateLayout>
  )
}
