export { ApiError, apiRequest, mockDelay } from "./client";
export { queryKeys } from "./query-keys";

export { fetchAssets, useAssetsQuery, type AssetsResponse } from "./assets";
export {
  fetchCategories,
  useCategoriesQuery,
  type CategoriesResponse,
} from "./categories";
export { DashboardDataProvider, useDashboardData } from "./dashboard-context";
export {
  fetchDashboard,
  useDashboardQuery,
  type DashboardResponse,
} from "./dashboard";
export { fetchGoals, useGoalsQuery, type GoalsResponse } from "./goals";
export {
  fetchIncomeBalance,
  useIncomeBalanceQuery,
  type IncomeBalanceResponse,
} from "./income-balance";
export {
  fetchInvestmentsBalance,
  useInvestmentsBalanceQuery,
  type InvestmentsBalanceResponse,
} from "./investments-balance";
export {
  fetchSubscriptions,
  useSubscriptionsQuery,
  type SubscriptionsResponse,
} from "./subscriptions";
export {
  fetchOperationsBars,
  fetchOperationsScreen,
  fetchOperationsTrends,
  useOperationsBarsQuery,
  useOperationsScreenQuery,
  useOperationsTrendsQuery,
  type OperationsBarsResponse,
  type OperationsScreenResponse,
  type OperationsTrendsResponse,
} from "./operations";
export {
  fetchTotalBalance,
  useTotalBalanceQuery,
  type TotalBalanceResponse,
} from "./total-balance";
