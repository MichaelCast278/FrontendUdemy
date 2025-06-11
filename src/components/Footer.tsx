import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="text-2xl font-bold text-white mb-4">udemy</div>
            <p className="text-gray-400">La plataforma de aprendizaje en línea líder mundial.</p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Udemy Business</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link to="#" className="hover:text-white">
                  Enseña en Udemy
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-white">
                  Obtén la aplicación
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-white">
                  Acerca de nosotros
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-white">
                  Contáctanos
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Carreras</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link to="#" className="hover:text-white">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-white">
                  Centro de ayuda
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-white">
                  Afiliados
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-white">
                  Inversores
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Términos</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link to="#" className="hover:text-white">
                  Política de privacidad
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-white">
                  Términos
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-white">
                  Configuración de cookies
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-white">
                  Mapa del sitio
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400">© 2024 Udemy, Inc.</p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <button className="text-gray-400 border border-gray-600 px-3 py-1 rounded-md text-sm flex items-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="w-4 h-4 mr-2" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
              Español
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
