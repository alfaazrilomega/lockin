// TODO: Replace with Prisma DB Queries in production

export const DashboardMockData = {
  // Hero Section
  hero: {
    totalPointsBurned: "528,976.82", // We keep the format for visual parity
    growthPercent: "+7.9%",
    diffValue: "27,335.09",
    dateRange: "vs prev. 501,641.73 Jun 1 - Aug 31, 2023",
  },
  
  // Progress Bar under Hero
  heroContributions: [
    { name: "Armin A.", points: 209633, percentage: 39.63, color: "#1E293B", avatar: "https://i.pravatar.cc/150?img=3" },
    { name: "Eren Y.",  points: 156841, percentage: 29.65, color: "#0D9488", avatar: "https://i.pravatar.cc/150?img=5" },
    { name: "Mikasa A.", points: 117115, percentage: 22.14, color: "#FF4B72", avatar: "https://i.pravatar.cc/150?img=8" },
    { name: "System",  points: 45386,  percentage: 8.58,  color: "#64748B", avatar: "" }
  ],

  // Top Cards
  topCards: {
    contributor: {
      title: "Top contributor",
      value: "72",
      name: "Mikasa",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d"
    },
    epic: {
      title: "Top epic",
      points: "42,300",
      epicName: "Project Phoenix"
    },
    kpis: {
      tasks: { label: "Tasks", val: "256", diff: "− 5", trend: "down" },
      points: { label: "Points", val: "528k", diff: "+ 7.9%", trend: "up", isHighlighted: true },
      onTimeRate: { label: "On-time rate", val: "94%", diff: "+ 1.2%", trend: "up" }
    }
  },

  // Middle Content: Left (Platform List)
  modulesList: [
    { id: "dribbble", label: "Dribbble", value: "227,459", percentage: "43%", color: "#FF4B72", initials: "dr" },
    { id: "instagram", label: "Instagram", value: "142,823", percentage: "27%", color: "#F97316", initials: "ig" },
    { id: "behance", label: "Behance", value: "89,935", percentage: "11%", color: "#3B82F6", initials: "be" },
    { id: "google", label: "Google", value: "37,028", percentage: "7%", color: "#10B981", initials: "go" }
  ],

  // Middle Content: Center Bar Chart Data (Deals amount by referrer category)
  moduleBarChartHistory: [
    { name: "Week 1", dribbble: 14000, instagram: 12000, behance: 10000, google: 6000 },
    { name: "Week 2", dribbble: 18000, instagram: 10000, behance: 13000, google: 8000 },
    { name: "Week 3", dribbble: 12000, instagram: 16000, behance: 8000, google: 11000 },
    { name: "Week 4", dribbble: 15000, instagram: 11000, behance: 15000, google: 9000 },
  ],

  // Work with platforms (Donut Chart)
  workWithPlatforms: {
    totalRevenue: "$71,048",
    totalPercentage: "45.3%",
    badgeCount: 3,
    badgeValue: "156,841",
    platforms: [
      { name: "Dribbble", value: 44072, percentage: 28.1, color: "#FF4B72", icon: "dr" },
      { name: "Instagram", value: 22114, percentage: 14.1, color: "#F97316", icon: "ig" },
      { name: "Google", value: 8469, percentage: 5.4, color: "#10B981", icon: "go" },
      { name: "Other", value: 11135, percentage: 7.1, color: "#6B7280", icon: "ot" }
    ]
  },

  // Bottom Area Chart (Sales dynamic)
  salesDynamic: {
    data: [
      { week: "W1", leads: 4000, revenue: 5000 },
      { week: "W3", leads: 5000, revenue: 7000 },
      { week: "W5", leads: 4500, revenue: 6000 },
      { week: "W7", leads: 2500, revenue: 3500 },
      { week: "W9", leads: 4000, revenue: 5500 },
      { week: "W11", leads: 6000, revenue: 8000 }
    ],
    highlights: [
      { week: "W5", value: 4500, key: "leads", color: "#3B82F6" },
      { week: "W7", value: 2500, key: "revenue", color: "#FF4B72" },
      { week: "W11", value: 8000, key: "revenue", color: "#FF4B72" }
    ],
    contributors: [
      { name: "Armin A.", avatar: "https://i.pravatar.cc/150?img=3", revenue: "$209,633", tasks: 41, kpi: 118, onTime: "31%", color: "#1E293B" },
      { name: "Mikasa A.", avatar: "https://i.pravatar.cc/150?img=8", revenue: "$156,841", tasks: 54, kpi: 103, onTime: "39%", color: "#FF4B72" },
      { name: "Eren Y.", avatar: "https://i.pravatar.cc/150?img=5", revenue: "$117,115", tasks: 22, kpi: 84, onTime: "32%", color: "#0D9488" }
    ]
  }
};
