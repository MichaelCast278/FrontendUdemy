"use client"

import type React from "react"

import { useState, useRef, useEffect, type KeyboardEvent } from "react"
import { Search, Clock, TrendingUp, X } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useAutocomplete } from "../hooks/Autocompletado"
import type { Suggestion } from "../hooks/Autocompletado"


interface AutocompleteSearchProps {
  placeholder?: string
  className?: string
  onSearch?: (query: string) => void
}

export default function AutocompleteSearch({
  placeholder = "Busca cualquier tema",
  className = "",
  onSearch,
}: AutocompleteSearchProps) {
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [recentSearches, setRecentSearches] = useState<string[]>([])

  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const { suggestions, isLoading, searchSuggestions, clearSuggestions } = useAutocomplete(300)

  // Cargar búsquedas recientes del localStorage
  useEffect(() => {
    const saved = localStorage.getItem("recentSearches")
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved))
      } catch (error) {
        console.error("Error loading recent searches:", error)
      }
    }
  }, [])

  // Manejar cambios en el input
  const handleInputChange = (value: string) => {
    setQuery(value)
    setSelectedIndex(-1)

    if (value.trim().length >= 2) {
      searchSuggestions(value.trim())
      setIsOpen(true)
    } else {
      clearSuggestions()
      setIsOpen(value.trim().length === 0) // Mostrar búsquedas recientes si está vacío
    }
  }

  // Manejar navegación con teclado
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return

    const totalItems = suggestions.length + (query.length === 0 ? recentSearches.length : 0)

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setSelectedIndex((prev) => (prev < totalItems - 1 ? prev + 1 : -1))
        break
      case "ArrowUp":
        e.preventDefault()
        setSelectedIndex((prev) => (prev > -1 ? prev - 1 : totalItems - 1))
        break
      case "Enter":
        e.preventDefault()
        if (selectedIndex >= 0) {
          const selectedItem = getSelectedItem(selectedIndex)
          if (selectedItem) {
            handleSelectSuggestion(selectedItem)
          }
        } else if (query.trim()) {
          handleSearch(query.trim())
        }
        break
      case "Escape":
        setIsOpen(false)
        setSelectedIndex(-1)
        inputRef.current?.blur()
        break
    }
  }

  // Obtener el item seleccionado por índice
  const getSelectedItem = (index: number): Suggestion | string | null => {
    if (query.length === 0) {
      return recentSearches[index] || null
    } else {
      return suggestions[index] || null
    }
  }

  // Manejar selección de sugerencia
  const handleSelectSuggestion = (suggestion: any) => {
    setQuery(suggestion.nombre)   // actualiza el input con el nombre
    setIsOpen(false)
    setSelectedIndex(-1)

    // Redirige directamente al curso con su id
    navigate(`/course/${suggestion.curso_id}`)
}


  // Manejar búsqueda
  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return

    // Agregar a búsquedas recientes
    const updatedRecent = [searchQuery, ...recentSearches.filter((item) => item !== searchQuery)].slice(0, 5)

    setRecentSearches(updatedRecent)
    localStorage.setItem("recentSearches", JSON.stringify(updatedRecent))

    // Ejecutar búsqueda
    if (onSearch) {
      onSearch(searchQuery)
    } else {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
    }

    setIsOpen(false)
    inputRef.current?.blur()
  }

  // Eliminar búsqueda reciente
  const removeRecentSearch = (searchToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const updated = recentSearches.filter((item) => item !== searchToRemove)
    setRecentSearches(updated)
    localStorage.setItem("recentSearches", JSON.stringify(updated))
  }

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false)
        setSelectedIndex(-1)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const showRecentSearches = query.length === 0 && recentSearches.length > 0
  const showSuggestions = query.length >= 2 && suggestions.length > 0

  return (
    <div className={`relative ${className}`}>
      {/* Input de búsqueda */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
        />
      </div>

      {/* Dropdown de sugerencias */}
      {isOpen && (showRecentSearches || showSuggestions || isLoading) && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto"
        >
          {/* Loading state */}
          {isLoading && (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600 mx-auto"></div>
              <span className="mt-2 block text-sm">Buscando...</span>
            </div>
          )}

          {/* Búsquedas recientes */}
          {showRecentSearches && !isLoading && (
            <div className="py-2">
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-100">
                Búsquedas recientes
              </div>
              {recentSearches.map((recent, index) => (
                <button
                  key={`recent-${index}`}
                  className={`w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center justify-between group ${
                    selectedIndex === index ? "bg-purple-50 text-purple-600" : "text-gray-700"
                  }`}
                  onClick={() => handleSelectSuggestion(recent)}
                >
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-3 text-gray-400" />
                    <span>{recent}</span>
                  </div>
                  <button
                    onClick={(e) => removeRecentSearch(recent, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded transition-opacity"
                  >
                    <X className="w-3 h-3 text-gray-400" />
                  </button>
                </button>
              ))}
            </div>
          )}

          {/* Sugerencias de autocompletado */}
          {showSuggestions && !isLoading && (
            <div className="py-2">
              {showRecentSearches && <div className="border-t border-gray-100"></div>}
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">Sugerencias</div>
              {suggestions.map((suggestion, index) => {
                    const adjustedIndex = showRecentSearches ? index + recentSearches.length : index
                    return (
                        <button
                            key={`suggestion-${index}`}
                            className={`w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center ${
                                selectedIndex === adjustedIndex ? "bg-purple-50 text-purple-600" : "text-gray-700"
                            }`}
                            onClick={() => handleSelectSuggestion(suggestion)}
                        >
                            <TrendingUp className="w-4 h-4 mr-3 text-gray-400" />
                            <span>{suggestion.nombre}</span>  {/* solo mostramos el nombre */}
                        </button>
                    )
                })}
            </div>
          )}

          {/* Estado vacío */}
          {!isLoading && !showRecentSearches && !showSuggestions && query.length >= 2 && (
            <div className="p-4 text-center text-gray-500">
              <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No se encontraron sugerencias para "{query}"</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
