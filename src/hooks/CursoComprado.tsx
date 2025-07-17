"use client"

import { useState, useEffect } from "react"

interface Purchase {
  tenant_id: string
  order_id: string
  user_id: string
  curso_id: string
  quantity: number
  price: number
  timestamp: string
}

export function usePurchasedCourses() {
  const [purchasedCourseIds, setPurchasedCourseIds] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(true)

  const API_BASE_URL = "https://t1uohu23vl.execute-api.us-east-1.amazonaws.com/dev"

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const token = localStorage.getItem("authToken")
        const tenantId = localStorage.getItem("tenantId")
        const userId = localStorage.getItem("userId")

        if (!userId || !token) {
          setIsLoading(false)
          return
        }

        const response = await fetch(`${API_BASE_URL}/compras?tenant_id=${tenantId}&user_id=${userId}&limit=100`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
            "tenant-id": tenantId || "",
          },
        })

        if (response.ok) {
          const data = await response.json()
          const purchases: Purchase[] = data.compras || []
          const courseIds = new Set(purchases.map((p) => p.curso_id))
          setPurchasedCourseIds(courseIds)
        }
      } catch (error) {
        console.error("Error fetching purchases:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPurchases()
  }, [])

  const isPurchased = (courseId: string) => purchasedCourseIds.has(courseId)

  return { isPurchased, isLoading, purchasedCourseIds }
}
