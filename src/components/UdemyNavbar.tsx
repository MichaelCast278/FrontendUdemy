"use client"

import { useState } from "react"

export default function UdemyNavbar() {
  const [activeTab, setActiveTab] = useState("Certificaciones de informática")

  const categories = [
    "Ciencias de la información",
    "Certificaciones de informática",
    "Liderazgo",
    "Desarrollo web",
    "Comunicación",
    "Analítica e inteligencia empresarial",
  ]

  return (
    <div className="bg-white border-b border-gray-200">
    
      {/* Category tabs */}
      <div className="border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveTab(category)}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === category
                    ? "border-purple-500 text-purple-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Popular Topics Pills */}
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-4 overflow-x-auto pb-2">
            <div className="flex-shrink-0 bg-gray-100 rounded-full px-6 py-3 hover:bg-gray-200 transition-colors cursor-pointer">
              <div className="text-center">
                <h3 className="font-semibold text-gray-900 text-sm">ChatGPT</h3>
                <p className="text-xs text-gray-600">Más de 4 millones de estudiantes</p>
              </div>
            </div>

            <div className="flex-shrink-0 bg-gray-100 rounded-full px-6 py-3 hover:bg-gray-200 transition-colors cursor-pointer">
              <div className="text-center">
                <h3 className="font-semibold text-gray-900 text-sm">Ciencias de la información</h3>
                <p className="text-xs text-gray-600">Más de 7 millones de estudiantes</p>
              </div>
            </div>

            <div className="flex-shrink-0 bg-gray-800 text-white rounded-full px-6 py-3 hover:bg-gray-700 transition-colors cursor-pointer">
              <div className="text-center">
                <h3 className="font-semibold text-sm">Python</h3>
                <p className="text-xs text-gray-300">Más de 48.8 millones de estudiantes</p>
              </div>
            </div>

            <div className="flex-shrink-0 bg-gray-100 rounded-full px-6 py-3 hover:bg-gray-200 transition-colors cursor-pointer">
              <div className="text-center">
                <h3 className="font-semibold text-gray-900 text-sm">Aprendizaje automático</h3>
                <p className="text-xs text-gray-600">Más de 8 millones de estudiantes</p>
              </div>
            </div>

            <div className="flex-shrink-0 bg-gray-100 rounded-full px-6 py-3 hover:bg-gray-200 transition-colors cursor-pointer">
              <div className="text-center">
                <h3 className="font-semibold text-gray-900 text-sm">Aprendizaje profundo</h3>
                <p className="text-xs text-gray-600">Más de 2 millones de estudiantes</p>
              </div>
            </div>

            <div className="flex-shrink-0 bg-gray-100 rounded-full px-6 py-3 hover:bg-gray-200 transition-colors cursor-pointer">
              <div className="text-center">
                <h3 className="font-semibold text-gray-900 text-sm">Inteligencia artificial</h3>
                <p className="text-xs text-gray-600">Más de 3 millones de estudiantes</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
