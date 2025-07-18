"use client"

import { useState, useCallback } from "react"

export interface Suggestion {
  nombre: string
  curso_id: string
}


export function useAutocomplete(debounceMs = 300) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const API_BASE_URL = "https://t1uohu23vl.execute-api.us-east-1.amazonaws.com/dev"

  const fetchSuggestions = useCallback(async (query: string) => {
  if (query.length < 2) {
    setSuggestions([])
    return
  }

  try {
    setIsLoading(true)
    setError(null)

    const token = localStorage.getItem("authToken")


    if (!token) {
      setError("Token de autorización no encontrado")
      return
    }

    const response = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(query)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
    })

    if (response.ok) {
      const data = await response.json()
      console.log("Respuesta API autocompletado:", data)

      // AQUI CAMBIA PARA LEER cursos
      setSuggestions(data.cursos || [])

    } else {
      setError("Error al obtener sugerencias")
      setSuggestions([])
    }
  } catch (error) {
    console.error("Error en autocompletado:", error)
    setError("Error de conexión")
    setSuggestions([])
  } finally {
    setIsLoading(false)
  }
}, [])

  const debouncedFetchSuggestions = useCallback(debounce(fetchSuggestions, debounceMs), [fetchSuggestions, debounceMs])

  const searchSuggestions = useCallback(
    (query: string) => {
      debouncedFetchSuggestions(query)
    },
    [debouncedFetchSuggestions],
  )

  const clearSuggestions = useCallback(() => {
    setSuggestions([])
    setError(null)
  }, [])

  return {
    suggestions,
    isLoading,
    error,
    searchSuggestions,
    clearSuggestions,
  }
}

// Función de debounce
function debounce<T extends (...args: any[]) => any>(func: T, wait: number): T {
  let timeout: number | null = null


  return ((...args: any[]) => {
    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(() => func(...args), wait)
  }) as T
}
