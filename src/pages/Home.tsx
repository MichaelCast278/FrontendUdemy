import { Link } from 'react-router-dom'
import UdemyHeader from '../components/UdemyNavbar';
import Header from '../components/Header'
import Footer from '../components/Footer'
import Carousel from "../components/Carousel";
import PublicLayout from "../layouts/PublicLayout"



export default function HomePage() {
  const courses = [
    {
      title: "Complete Python Bootcamp",
      instructor: "Jose Portilla",
      rating: 4.6,
      students: "1,234,567",
      price: "$84.99",
      originalPrice: "$199.99",
      image: "/placeholder.jpg",
    },
    {
      title: "The Web Developer Bootcamp",
      instructor: "Colt Steele",
      rating: 4.7,
      students: "987,654",
      price: "$74.99",
      originalPrice: "$179.99",
      image: "/placeholder.jpg",
    },
    {
      title: "React - The Complete Guide",
      instructor: "Maximilian Schwarzmüller",
      rating: 4.6,
      students: "543,210",
      price: "$89.99",
      originalPrice: "$199.99",
      image: "/placeholder.jpg",
    },
    {
      title: "Machine Learning A-Z",
      instructor: "Kirill Eremenko",
      rating: 4.5,
      students: "876,543",
      price: "$94.99",
      originalPrice: "$199.99",
      image: "/placeholder.jpg",
    },
  ]

  const companies = ["Volkswagen", "Samsung", "Cisco", "Vimeo", "P&G", "Citi", "Ericsson"]

  return (
    <PublicLayout>
    <div className="min-h-screen bg-white">
      

      {/* Hero Section */}
      <section className="bg-white py-2 px-2 mx-auto max-w-7xl">
        <div>
          <Carousel />
          {/* otras secciones */}
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Todas las habilidades que necesitas en un único lugar
            </h2>
            <p className="text-xl text-gray-600">
              Desde habilidades críticas hasta temas técnicos, Udemy apoya tu crecimiento profesional.
            </p>
          </div>

          <div>
            <UdemyHeader />
          </div>

          {/* Course Categories */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <div className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <div className="text-2xl mb-2">💼</div>
              <h3 className="font-semibold text-gray-900">Habilidades empresariales</h3>
              <p className="text-sm text-gray-600 mt-2">Más de 2,000 cursos</p>
            </div>
            <div className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <div className="text-2xl mb-2">💻</div>
              <h3 className="font-semibold text-gray-900">Desarrollo web</h3>
              <p className="text-sm text-gray-600 mt-2">Más de 1,500 cursos</p>
            </div>
            <div className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <div className="text-2xl mb-2">🤖</div>
              <h3 className="font-semibold text-gray-900">Inteligencia artificial</h3>
              <p className="text-sm text-gray-600 mt-2">Más de 800 cursos</p>
            </div>
            <div className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <div className="text-2xl mb-2">📊</div>
              <h3 className="font-semibold text-gray-900">Ciencia de datos</h3>
              <p className="text-sm text-gray-600 mt-2">Más de 1,200 cursos</p>
            </div>
          </div>

          {/* Featured Courses */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {courses.map((course, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                <img 
                  src={course.image || "/placeholder.svg"} 
                  alt={course.title} 
                  className="w-full h-40 object-cover" 
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://via.placeholder.com/300x200";
                  }}
                />
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{course.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{course.instructor}</p>
                  <div className="flex items-center mb-2">
                    <span className="text-yellow-500 text-sm font-semibold">{course.rating}</span>
                    <div className="flex ml-1">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-yellow-400 text-xs">
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-xs text-gray-500 ml-2">({course.students})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-gray-900">{course.price}</span>
                      <span className="text-sm text-gray-500 line-through ml-2">{course.originalPrice}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trusted Companies */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-600 mb-8">
            Más de 15,000 empresas confían en nosotros, incluidas las empresas de Fortune 500
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            {companies.map((company, index) => (
              <div key={index} className="text-2xl font-bold text-gray-400">
                {company}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Students Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Los estudiantes están viendo</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                <img
                  src="https://via.placeholder.com/200x120"
                  alt={`Curso ${index + 1}`}
                  className="w-full h-24 object-cover"
                />
                <div className="p-3">
                  <h3 className="font-semibold text-sm text-gray-900 mb-1 line-clamp-2">
                    Curso de ejemplo {index + 1}
                  </h3>
                  <p className="text-xs text-gray-600 mb-1">Instructor</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-900">$49.99</span>
                    <span className="text-xs text-gray-500 line-through">$199.99</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Goals */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Aprendizaje orientado a tus objetivos</h2>
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
              <p className="text-gray-600">Prepárate para certificaciones de la industria con cursos especializados.</p>
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
    </div>
    </PublicLayout>
  )
}
