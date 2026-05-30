export const queryKeys = {
  dashboard: ["dashboard"] as const,
  assets: ["assets"] as const,
  operations: {
    screen: ["operations", "screen"] as const,
    trends: ["operations", "trends"] as const,
    bars: ["operations", "bars"] as const,
  },
  categories: ["categories"] as const,
  goals: ["goals"] as const,
  subscriptions: ["subscriptions"] as const,
  recommendations: ["recommendations"] as const,
  totalBalance: ["total-balance"] as const,
  incomeBalance: ["income-balance"] as const,
  investmentsBalance: ["investments-balance"] as const,
} as const;
