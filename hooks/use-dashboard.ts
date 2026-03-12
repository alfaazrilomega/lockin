"use client"

import { useState, useEffect } from "react"
import { DashboardStats } from "@/lib/types"

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    activeTasks: 0,
    completedTasks: 0,
    upcomingDeadlines: 0,
    recentProjects: [],
    upcomingDeadlineTasks: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Mock data for now - in a real app, this would fetch from your API
    const fetchStats = async () => {
      try {
        setLoading(true)
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        setStats({
          totalProjects: 12,
          activeTasks: 47,
          completedTasks: 156,
          upcomingDeadlines: 8,
          recentProjects: [],
          upcomingDeadlineTasks: [],
        })
        
        setLoading(false)
      } catch (e) {
        console.error('Failed to fetch dashboard stats:', e)
        setError('Failed to fetch dashboard stats')
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return {
    stats,
    loading,
    error
  }
}