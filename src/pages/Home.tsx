"use client"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Carousel from "../components/Carousel"
import CourseCard from "../components/CourseCard"
import PublicLayout from "../layouts/PublicLayout"
import type { Course } from "../types/Course"
import CourseCardWithTooltip from "../components/Tooltip"

interface ApiResponse {
  message: string
  cursos: Course[]
  lastEvaluatedKey?: string
}

export default function HomePage() {
  const [coursesByCategory, setCoursesByCategory] = useState<Record<string, Course[]>>({})
  const [selectedCategory, setSelectedCategory] = useState<string>("todos")
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const navigate = useNavigate()

  // Base URL for API
  const COURSES_API_BASE_URL = "https://y8h2ktpj0j.execute-api.us-east-1.amazonaws.com/dev"

  // Mapeo de categorías para títulos más amigables
  const categoryTitles: Record<string, string> = {
    todos: "Todos los cursos",
    "desarrollo web": "Desarrollo web",
    "full stack": "Full Stack",
    negocios: "Negocios",
    management: "Management",
    devops: "DevOps",
    kubernetes: "Kubernetes",
    docker: "Docker",
    seguridad: "Ciberseguridad",
    cybersecurity: "Cybersecurity",
    móvil: "Desarrollo Móvil",
    ios: "iOS",
    flutter: "Flutter",
    diseño: "Diseño",
    gráfico: "Diseño Gráfico",
    programación: "Programación",
  }

  // Iconos para cada categoría
  const categoryIcons: Record<string, string> = {
    todos: "🎯",
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

  // Fetch courses by category
  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)

  const fetchCoursesByCategory = async (category: string) => {
    try {
      const categoryFormatted = capitalize(category)
      const tenantId = "UDEMY"
      const url = `${COURSES_API_BASE_URL}/cursos/category?category=${encodeURIComponent(categoryFormatted)}&tenant_id=${tenantId}`

      console.log(`📡 Fetching courses for category: ${categoryFormatted}`)

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
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

  // Load courses by categories
  const loadCoursesByCategories = async () => {
    try {
      setIsLoading(true)

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

      // Organizar cursos por categoría y crear categoría "todos"
      const organizedCourses: Record<string, Course[]> = {}
      const allCoursesArray: Course[] = []

      categoryResults.forEach(({ category, courses }) => {
        if (courses.length > 0) {
          organizedCourses[category] = courses
          allCoursesArray.push(...courses)
        }
      })

      // Agregar categoría "todos" con todos los cursos únicos
      const uniqueCourses = allCoursesArray.filter(
        (course, index, self) => index === self.findIndex((c) => c.curso_id === course.curso_id),
      )
      organizedCourses["todos"] = uniqueCourses

      setCoursesByCategory(organizedCourses)
      console.log("📚 Cursos organizados por categoría:", organizedCourses)
    } catch (error) {
      console.error("❌ Error loading courses by categories:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadCoursesByCategories()
  }, [])

  // Handle course click - redirect to login
  const handleCourseClick = (courseId: string) => {
    // Guardar el curso que quería ver en localStorage para redirigir después del login
    localStorage.setItem("redirectAfterLogin", `/course/${courseId}`)
    navigate("/login")
  }

  // Get available categories
  const availableCategories = Object.keys(coursesByCategory).filter(
    (category) => coursesByCategory[category].length > 0,
  )

  // Get courses to display
  const coursesToDisplay = coursesByCategory[selectedCategory] || []
  const displayedCourses = coursesToDisplay.slice(0, 12) // Mostrar máximo 12 cursos

  // Get featured courses (best rated) from all categories
  const getAllCoursesFromCategories = () => {
    const allCoursesArray: Course[] = []
    Object.values(coursesByCategory).forEach((courses) => {
      allCoursesArray.push(...courses)
    })
    // Remove duplicates
    return allCoursesArray.filter(
      (course, index, self) => index === self.findIndex((c) => c.curso_id === course.curso_id),
    )
  }

  const featuredCourses = getAllCoursesFromCategories()
    .filter((course) => (course.rating || 0) >= 4.3)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 8)

  return (
    <PublicLayout>
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="bg-white py-2 px-2 mx-auto max-w-7xl">
          <div>
            <Carousel />
            <p className="text-sm opacity-90">
              Accede a más de {getAllCoursesFromCategories().length} cursos especializados en las tecnologías más
              demandadas del mercado
            </p>
          </div>
        </section>

        {/* Skills Section */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Todas las habilidades que necesitas en un único lugar
              </h2>
              <p className="text-lg text-gray-600">
                Desde habilidades críticas hasta temas técnicos, Udemy apoya tu crecimiento profesional.
              </p>
            </div>

            {/* Category Navigation Tabs */}
            <div className="mb-8">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8 overflow-x-auto">
                  {availableCategories.slice(0, 8).map((category) => {
                    const title = categoryTitles[category] || category.charAt(0).toUpperCase() + category.slice(1)
                    const isActive = selectedCategory === category

                    return (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                          isActive
                            ? "border-purple-500 text-purple-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        {title}
                      </button>
                    )
                  })}
                </nav>
              </div>
            </div>

            {/* Category Pills */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-3">
                {availableCategories.slice(0, 6).map((category) => {
                  const title = categoryTitles[category] || category.charAt(0).toUpperCase() + category.slice(1)
                  const icon = categoryIcons[category] || "📚"
                  const isActive = selectedCategory === category

                  return (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        isActive ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      <span className="mr-2">{icon}</span>
                      {title}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Course Grid */}
            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {[...Array(8)].map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="bg-gray-300 h-40 rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded mb-2 w-3/4"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {displayedCourses.map((course) => (
                  <CourseCardWithTooltip
                    key={course.curso_id}
                    course={course}
                    onCourseClick={handleCourseClick}
                    showTooltip={true}
                  >
                    <CourseCard course={course} />
                  </CourseCardWithTooltip>
                ))}
              </div>
            )}

            {/* Show more button */}
            {coursesToDisplay.length > 12 && (
              <div className="text-center mb-12">
                <button
                  onClick={() => handleCourseClick("category")}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-8 rounded transition-colors"
                >
                  Ver todos los cursos de {categoryTitles[selectedCategory]}
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Featured Courses Section */}
        {featuredCourses.length > 0 && (
          <section className="py-12 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">⭐ Cursos más valorados</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredCourses.map((course) => (
                  <CourseCardWithTooltip
                    key={course.curso_id}
                    course={course}
                    onCourseClick={handleCourseClick}
                    showTooltip={true}
                  >
                    <CourseCard course={course} />
                  </CourseCardWithTooltip>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Trusted Companies */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-gray-600 mb-8">
              Más de 15,000 empresas confían en nosotros, incluidas las empresas de Fortune 500
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              {["Volkswagen", "Samsung", "Cisco", "Vimeo", "P&G", "Citi", "Ericsson"].map((company, index) => (
                <div key={index} className="text-2xl font-bold text-gray-400">
                  {company}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Learning Goals */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Aprendizaje orientado a tus objetivos
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Aprendizaje práctico</h3>
                <p className="text-gray-600">Practica con ejercicios, cuestionarios y proyectos del mundo real.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">📚</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Preparación para certificaciones</h3>
                <p className="text-gray-600">
                  Prepárate para certificaciones de la industria con cursos especializados.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Algoritmos de recomendación</h3>
                <p className="text-gray-600">Encuentra cursos personalizados basados en tus intereses y objetivos.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-purple-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">¿Listo para comenzar tu aprendizaje?</h2>
            <p className="text-xl text-purple-100 mb-8">
              Únete a millones de estudiantes y comienza a desarrollar nuevas habilidades hoy mismo.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="bg-white text-purple-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Comenzar ahora
            </button>
          </div>
        </section>
      </div>
    </PublicLayout>
  )
}
