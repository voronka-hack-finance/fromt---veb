import {
  apiRequest,
  clearStoredAuthTokens,
  storeAuthTokens,
} from "./client";
import type { components } from "./generated";

type Schemas = components["schemas"];

type PaginationQuery = {
  page?: number;
  page_size?: number;
};

export type HealthResponse = Schemas["HealthResponse"];
export type StatusResponse = Schemas["StatusResponse"];
export type PaginationResponse = Schemas["PaginationResponse"];
export type TokenResponse = Schemas["TokenResponse"];
export type RegisterRequest = Schemas["RegisterRequest"];
export type RegisterResponse = Schemas["RegisterResponse"];
export type LoginRequest = Schemas["LoginRequest"];
export type LogoutRequest = Schemas["LogoutRequest"];
export type RefreshRequest = Schemas["RefreshRequest"];
export type ProfileUpdateRequest = Schemas["ProfileUpdateRequest"];
export type ChangePasswordRequest = Schemas["ChangePasswordRequest"];
export type UserResponse = Schemas["UserResponse"];

export type FileResponse = Schemas["FileResponse"];
export type FilesPageResponse = Schemas["FilesPageResponse"];
export type FileUpdateRequest = Schemas["FileUpdateRequest"];
export type UploadResponse = Schemas["UploadResponse"];
export type ImportStatusResponse = Schemas["ImportStatusResponse"];
export type ImportErrorsResponse = Schemas["ImportErrorsResponse"];

export type TransactionResponse = Schemas["TransactionResponse"];
export type TransactionsPageResponse = Schemas["TransactionsPageResponse"];
export type TransactionsQuery = PaginationQuery & {
  account_id?: string;
  card_last4?: string[];
  categories?: string[];
  category_id?: string;
  date_from?: string;
  date_to?: string;
  has_cashback?: boolean;
  mcc?: string[];
  status?: string;
  type?: "income" | "expense";
};

export type AccountResponse = Schemas["AccountResponse"];
export type AccountsPageResponse = Schemas["AccountsPageResponse"];

export type DebtType = "loan" | "credit_card" | "other";
export type DebtStatus = "active" | "closed" | "deleted";
export type DebtResponse = {
  id: string;
  owner_user_id: string;
  account_id?: string | null;
  title: string;
  description?: string | null;
  debt_type: DebtType;
  remaining_balance: string;
  credit_limit?: string | null;
  monthly_payment?: string | null;
  currency: string;
  payment_day?: number | null;
  overdue_days: number;
  interest_rate?: string | null;
  status: DebtStatus;
  created_at: string;
  updated_at: string;
};
export type DebtsPageResponse = {
  items: DebtResponse[];
  pagination: PaginationResponse;
};
export type DebtCreateRequest = {
  title: string;
  debt_type: DebtType;
  remaining_balance: string;
  account_id?: string | null;
  description?: string | null;
  credit_limit?: string | null;
  monthly_payment?: string | null;
  currency?: string;
  payment_day?: number | null;
  overdue_days?: number;
  interest_rate?: string | null;
  status?: DebtStatus;
};
export type DebtUpdateRequest = {
  title?: string | null;
  debt_type?: DebtType | null;
  remaining_balance?: string | null;
  account_id?: string | null;
  description?: string | null;
  credit_limit?: string | null;
  monthly_payment?: string | null;
  currency?: string | null;
  payment_day?: number | null;
  overdue_days?: number | null;
  interest_rate?: string | null;
  status?: DebtStatus | null;
};
export type DebtsQuery = PaginationQuery & {
  debt_type?: DebtType | null;
  status?: DebtStatus;
};

export type GoalResponse = Schemas["GoalResponse"];
export type GoalsPageResponse = Schemas["GoalsPageResponse"];
export type GoalCreateRequest = Schemas["GoalCreateRequest"];
export type GoalUpdateRequest = Schemas["GoalUpdateRequest"];

export type LimitResponse = Schemas["LimitResponse"];
export type LimitsPageResponse = Schemas["LimitsPageResponse"];
export type LimitCreateRequest = Schemas["LimitCreateRequest"];
export type LimitUpdateRequest = Schemas["LimitUpdateRequest"];

export type CategoryResponse = Schemas["CategoryResponse"];
export type CategoriesPageResponse = Schemas["CategoriesPageResponse"];
export type CategoryCreateRequest = Schemas["CategoryCreateRequest"];
export type CategoryUpdateRequest = Schemas["CategoryUpdateRequest"];

export type NotificationDeviceRequest = Schemas["NotificationDeviceRequest"];
export type NotificationDeviceResponse = Schemas["NotificationDeviceResponse"];
export type NotificationPermissionRequest = Schemas["NotificationPermissionRequest"];
export type NotificationPreferenceResponse = Schemas["NotificationPreferenceResponse"];
export type NotificationTestRequest = Schemas["NotificationTestRequest"];
export type NotificationDeliveryResponse = Schemas["NotificationDeliveryResponse"];

export type AnalyticsAvailableBalanceResponse =
  Schemas["AnalyticsAvailableBalanceResponse"];
export type ExpectedIncomeResponse = Schemas["ExpectedIncomeResponse"];
export type ExpectedIncomesPageResponse = Schemas["ExpectedIncomesPageResponse"];
export type ExpectedExpenseResponse = Schemas["ExpectedExpenseResponse"];
export type ExpectedExpensesPageResponse = Schemas["ExpectedExpensesPageResponse"];

export type RegularExpenseResponse = {
  id: string;
  account_id?: string | null;
  category_id?: string | null;
  merchant_pattern: string;
  average_amount: string;
  expected_amount?: string | null;
  currency: string;
  frequency_days: number;
  next_expected_at?: string | null;
  confidence: string;
  status: string;
  source_type: string;
  created_at: string;
  updated_at: string;
};

export type RegularExpensesPageResponse = {
  items: RegularExpenseResponse[];
  pagination: PaginationResponse;
};

export type RegularExpenseCreateRequest = {
  merchant_pattern: string;
  expected_amount: string;
  average_amount?: string | null;
  account_id?: string | null;
  category_id?: string | null;
  currency?: string;
  frequency_days?: number;
  next_expected_at?: string | null;
  status?: string;
  source_type?: "manual" | "detected" | "user_adjusted";
};

export type RegularExpenseUpdateRequest = {
  merchant_pattern?: string | null;
  expected_amount?: string | null;
  average_amount?: string | null;
  account_id?: string | null;
  category_id?: string | null;
  currency?: string | null;
  frequency_days?: number | null;
  next_expected_at?: string | null;
  status?: string | null;
  source_type?: "manual" | "detected" | "user_adjusted" | null;
};

export type AnalyticsPeriodQuery = {
  period_end?: string;
  period_start?: string;
};

/** @see https://zanachka.avenir-team.ru/docs — Financial Health (OpenAPI v0.2.0) */
export type HealthDataGapResponse = {
  metric_key: string;
  reason: string;
};

export type FinancialHealthScoreResponse = {
  period: string;
  financial_health_score: string;
  financial_health_status: string;
  credit_load_index: string;
  credit_load_zone: string;
  credit_load_index_partial: boolean;
  top_risk_drivers: string[];
  data_gaps: HealthDataGapResponse[];
  calculated_at: string;
};

export type FinancialHealthQuery = {
  period?: string;
  refresh?: boolean;
};

export type FinancialHealthProfileResponse = {
  period: string;
  period_start: string;
  period_end: string;
  financial_health_score: string;
  financial_health_status: string;
  credit_load_index: string;
  credit_load_zone: string;
  credit_load_index_partial: boolean;
  total_income: string;
  total_expenses: string;
  net_cashflow: string;
  expense_to_income_ratio?: string | null;
  savings_rate?: string | null;
  score_components?: Record<string, string | null>;
  weights_applied?: Record<string, string | null>;
  data_gaps: HealthDataGapResponse[];
  top_risk_drivers: string[];
  calculated_at: string;
};

export type FinancialHealthHistoryItem = {
  period: string;
  financial_health_score?: string | null;
  financial_health_status: string;
  credit_load_index?: string | null;
  credit_load_zone: string;
  calculated_at: string;
};

export type FinancialHealthHistoryPageResponse = {
  items: FinancialHealthHistoryItem[];
  pagination: PaginationResponse;
};

export type GroupResponse = Schemas["GroupResponse"];
export type GroupsPageResponse = Schemas["GroupsPageResponse"];
export type GroupCreateRequest = Schemas["GroupCreateRequest"];
export type GroupUpdateRequest = Schemas["GroupUpdateRequest"];
export type GroupBudgetResponse = Schemas["GroupBudgetResponse"];
export type GroupMemberRequest = Schemas["GroupMemberRequest"];
export type GroupMemberResponse = Schemas["GroupMemberResponse"];
export type GroupMemberUpdateRequest = Schemas["GroupMemberUpdateRequest"];
export type GroupMembersPageResponse = Schemas["GroupMembersPageResponse"];
export type GroupInvitationRequest = Schemas["GroupInvitationRequest"];
export type GroupInvitationResponse = Schemas["GroupInvitationResponse"];
export type GroupInvitationUpdateRequest =
  Schemas["GroupInvitationUpdateRequest"];
export type GroupInvitationsPageResponse =
  Schemas["GroupInvitationsPageResponse"];

export type AgentRecommendationResponse =
  Schemas["AgentRecommendationResponse"];
export type AgentRecommendationsPageResponse =
  Schemas["AgentRecommendationsPageResponse"];
export type ChatResponse = Schemas["ChatResponse"];
export type ChatsPageResponse = Schemas["ChatsPageResponse"];
export type ChatCreateRequest = Schemas["ChatCreateRequest"];
export type ChatUpdateRequest = Schemas["ChatUpdateRequest"];
export type ChatMessageResponse = Schemas["ChatMessageResponse"];
export type ChatMessagesPageResponse = Schemas["ChatMessagesPageResponse"];
export type ChatMessageCreateRequest = Schemas["ChatMessageCreateRequest"];

export async function fetchHealth() {
  return apiRequest<HealthResponse>("/api/v1/health", { auth: false });
}

export async function fetchLegacyHealth() {
  return apiRequest<HealthResponse>("/health", { auth: false });
}

export async function fetchReadiness() {
  return apiRequest<HealthResponse>("/ready", { auth: false });
}

export async function register(payload: RegisterRequest) {
  return apiRequest<RegisterResponse>("/api/v1/auth/register", {
    auth: false,
    json: payload,
    method: "POST",
  });
}

export async function login(payload: LoginRequest) {
  const response = await apiRequest<TokenResponse>("/api/v1/auth/login", {
    auth: false,
    json: payload,
    method: "POST",
  });

  storeAuthTokens({
    accessToken: response.access_token,
    refreshToken: response.refresh_token,
  });

  return response;
}

export async function logout(payload: LogoutRequest = {}) {
  const response = await apiRequest<StatusResponse>("/api/v1/auth/logout", {
    json: payload,
    method: "POST",
  });

  clearStoredAuthTokens();
  return response;
}

export async function refreshAuth(payload: RefreshRequest) {
  const response = await apiRequest<TokenResponse>("/api/v1/auth/refresh", {
    auth: false,
    json: payload,
    method: "POST",
  });

  storeAuthTokens({
    accessToken: response.access_token,
    refreshToken: response.refresh_token ?? payload.refresh_token,
  });

  return response;
}

export async function fetchCurrentUser() {
  return apiRequest<UserResponse>("/api/v1/auth/me");
}

export async function updateCurrentUser(payload: ProfileUpdateRequest) {
  return apiRequest<UserResponse>("/api/v1/auth/me", {
    json: payload,
    method: "PATCH",
  });
}

export async function changePassword(payload: ChangePasswordRequest) {
  return apiRequest<StatusResponse>("/api/v1/auth/change-password", {
    json: payload,
    method: "POST",
  });
}

export async function uploadFile(file: File, sourceType = "excel_family_budget_v1") {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("source_type", sourceType);

  return apiRequest<UploadResponse>("/api/v1/files", {
    formData,
    method: "POST",
  });
}

export async function fetchFiles(query: PaginationQuery = {}) {
  return apiRequest<FilesPageResponse>("/api/v1/files", { query });
}

export async function fetchFile(fileId: string) {
  return apiRequest<FileResponse>(`/api/v1/files/${fileId}`);
}

export async function updateFile(fileId: string, payload: FileUpdateRequest) {
  return apiRequest<FileResponse>(`/api/v1/files/${fileId}`, {
    json: payload,
    method: "PATCH",
  });
}

export async function deleteFile(fileId: string) {
  return apiRequest<StatusResponse>(`/api/v1/files/${fileId}`, {
    method: "DELETE",
  });
}

export async function fetchImportStatus(importId: string) {
  return apiRequest<ImportStatusResponse>(`/api/v1/imports/${importId}`);
}

export async function fetchImportErrors(
  importId: string,
  query: PaginationQuery = {},
) {
  return apiRequest<ImportErrorsResponse>(
    `/api/v1/imports/${importId}/errors`,
    { query },
  );
}

export async function fetchTransactions(query: TransactionsQuery = {}) {
  return apiRequest<TransactionsPageResponse>("/api/v1/transactions", { query });
}

export async function fetchAccounts(query: PaginationQuery = {}) {
  return apiRequest<AccountsPageResponse>("/api/v1/accounts", { query });
}

export async function fetchDebtsPage(query: DebtsQuery = {}) {
  return apiRequest<DebtsPageResponse>("/api/v1/debts", { query });
}

export async function createDebt(payload: DebtCreateRequest) {
  return apiRequest<DebtResponse>("/api/v1/debts", {
    json: payload,
    method: "POST",
  });
}

export async function fetchDebt(debtId: string) {
  return apiRequest<DebtResponse>(`/api/v1/debts/${debtId}`);
}

export async function updateDebt(debtId: string, payload: DebtUpdateRequest) {
  return apiRequest<DebtResponse>(`/api/v1/debts/${debtId}`, {
    json: payload,
    method: "PATCH",
  });
}

export async function deleteDebt(debtId: string) {
  return apiRequest<StatusResponse>(`/api/v1/debts/${debtId}`, {
    method: "DELETE",
  });
}

export async function fetchGoalsPage(query: PaginationQuery = {}) {
  return apiRequest<GoalsPageResponse>("/api/v1/goals", { query });
}

export async function createGoal(payload: GoalCreateRequest) {
  return apiRequest<GoalResponse>("/api/v1/goals", {
    json: payload,
    method: "POST",
  });
}

export async function fetchGoal(goalId: string) {
  return apiRequest<GoalResponse>(`/api/v1/goals/${goalId}`);
}

export async function updateGoal(goalId: string, payload: GoalUpdateRequest) {
  return apiRequest<GoalResponse>(`/api/v1/goals/${goalId}`, {
    json: payload,
    method: "PATCH",
  });
}

export async function deleteGoal(goalId: string) {
  return apiRequest<StatusResponse>(`/api/v1/goals/${goalId}`, {
    method: "DELETE",
  });
}

export async function fetchLimitsPage(query: PaginationQuery = {}) {
  return apiRequest<LimitsPageResponse>("/api/v1/limits", { query });
}

export async function createLimit(payload: LimitCreateRequest) {
  return apiRequest<LimitResponse>("/api/v1/limits", {
    json: payload,
    method: "POST",
  });
}

export async function fetchLimit(limitId: string) {
  return apiRequest<LimitResponse>(`/api/v1/limits/${limitId}`);
}

export async function updateLimit(limitId: string, payload: LimitUpdateRequest) {
  return apiRequest<LimitResponse>(`/api/v1/limits/${limitId}`, {
    json: payload,
    method: "PATCH",
  });
}

export async function deleteLimit(limitId: string) {
  return apiRequest<StatusResponse>(`/api/v1/limits/${limitId}`, {
    method: "DELETE",
  });
}

export async function fetchCategoriesPage(query: PaginationQuery = {}) {
  return apiRequest<CategoriesPageResponse>("/api/v1/categories", { query });
}

export async function createCategory(payload: CategoryCreateRequest) {
  return apiRequest<CategoryResponse>("/api/v1/categories", {
    json: payload,
    method: "POST",
  });
}

export async function fetchCategory(categoryId: string) {
  return apiRequest<CategoryResponse>(`/api/v1/categories/${categoryId}`);
}

export async function updateCategory(
  categoryId: string,
  payload: CategoryUpdateRequest,
) {
  return apiRequest<CategoryResponse>(`/api/v1/categories/${categoryId}`, {
    json: payload,
    method: "PATCH",
  });
}

export async function deleteCategory(categoryId: string) {
  return apiRequest<StatusResponse>(`/api/v1/categories/${categoryId}`, {
    method: "DELETE",
  });
}

export async function updateNotificationPermission(
  payload: NotificationPermissionRequest,
) {
  return apiRequest<NotificationPreferenceResponse>(
    "/api/v1/notifications/permission",
    {
      json: payload,
      method: "POST",
    },
  );
}

export async function registerNotificationDevice(
  payload: NotificationDeviceRequest,
) {
  return apiRequest<NotificationDeviceResponse>(
    "/api/v1/notifications/devices",
    {
      json: payload,
      method: "POST",
    },
  );
}

export async function sendNotificationTest(
  payload: NotificationTestRequest = {
    body: "Notification channel is configured.",
    title: "Test notification",
  },
) {
  return apiRequest<NotificationDeliveryResponse>(
    "/api/v1/notifications/test",
    {
      json: payload,
      method: "POST",
    },
  );
}

export async function fetchAvailableBalance(query: AnalyticsPeriodQuery = {}) {
  return apiRequest<AnalyticsAvailableBalanceResponse>(
    "/api/v1/analytics/available-balance",
    { query },
  );
}

export async function fetchFinancialHealthScore(query: FinancialHealthQuery = {}) {
  return apiRequest<FinancialHealthScoreResponse>("/api/v1/health/score", { query });
}

export async function fetchFinancialHealthProfile(query: FinancialHealthQuery = {}) {
  return apiRequest<FinancialHealthProfileResponse>("/api/v1/health/profile", { query });
}

export async function fetchFinancialHealthHistory(query: PaginationQuery = {}) {
  return apiRequest<FinancialHealthHistoryPageResponse>("/api/v1/health/history", {
    query,
  });
}

export async function fetchExpectedIncomes(query: PaginationQuery = {}) {
  return apiRequest<ExpectedIncomesPageResponse>(
    "/api/v1/analytics/expected-incomes",
    { query },
  );
}

export async function fetchExpectedExpenses(query: PaginationQuery = {}) {
  return apiRequest<ExpectedExpensesPageResponse>(
    "/api/v1/analytics/expected-expenses",
    { query },
  );
}

export async function fetchRegularExpensesPage(query: PaginationQuery = {}) {
  return apiRequest<RegularExpensesPageResponse>(
    "/api/v1/analytics/regular-expenses",
    { query },
  );
}

export async function createRegularExpense(payload: RegularExpenseCreateRequest) {
  return apiRequest<RegularExpenseResponse>("/api/v1/analytics/regular-expenses", {
    json: payload,
    method: "POST",
  });
}

export async function fetchRegularExpense(regularExpenseId: string) {
  return apiRequest<RegularExpenseResponse>(
    `/api/v1/analytics/regular-expenses/${regularExpenseId}`,
  );
}

export async function updateRegularExpense(
  regularExpenseId: string,
  payload: RegularExpenseUpdateRequest,
) {
  return apiRequest<RegularExpenseResponse>(
    `/api/v1/analytics/regular-expenses/${regularExpenseId}`,
    {
      json: payload,
      method: "PATCH",
    },
  );
}

export async function deleteRegularExpense(regularExpenseId: string) {
  return apiRequest<StatusResponse>(
    `/api/v1/analytics/regular-expenses/${regularExpenseId}`,
    {
      method: "DELETE",
    },
  );
}

export async function fetchGroups(query: PaginationQuery = {}) {
  return apiRequest<GroupsPageResponse>("/api/v1/groups", { query });
}

export async function createGroup(payload: GroupCreateRequest) {
  return apiRequest<GroupResponse>("/api/v1/groups", {
    json: payload,
    method: "POST",
  });
}

export async function fetchGroup(groupId: string) {
  return apiRequest<GroupResponse>(`/api/v1/groups/${groupId}`);
}

export async function updateGroup(groupId: string, payload: GroupUpdateRequest) {
  return apiRequest<GroupResponse>(`/api/v1/groups/${groupId}`, {
    json: payload,
    method: "PATCH",
  });
}

export async function deleteGroup(groupId: string) {
  return apiRequest<StatusResponse>(`/api/v1/groups/${groupId}`, {
    method: "DELETE",
  });
}

export async function fetchGroupBudget(groupId: string) {
  return apiRequest<GroupBudgetResponse>(`/api/v1/groups/${groupId}/budget`);
}

export async function fetchGroupMembers(groupId: string) {
  return apiRequest<GroupMembersPageResponse>(
    `/api/v1/groups/${groupId}/members`,
  );
}

export async function addGroupMember(
  groupId: string,
  payload: GroupMemberRequest,
) {
  return apiRequest<GroupMemberResponse>(`/api/v1/groups/${groupId}/members`, {
    json: payload,
    method: "POST",
  });
}

export async function updateGroupMember(
  groupId: string,
  memberId: string,
  payload: GroupMemberUpdateRequest,
) {
  return apiRequest<GroupMemberResponse>(
    `/api/v1/groups/${groupId}/members/${memberId}`,
    {
      json: payload,
      method: "PATCH",
    },
  );
}

export async function removeGroupMember(groupId: string, memberId: string) {
  return apiRequest<StatusResponse>(
    `/api/v1/groups/${groupId}/members/${memberId}`,
    {
      method: "DELETE",
    },
  );
}

export async function fetchGroupInvitations(groupId: string) {
  return apiRequest<GroupInvitationsPageResponse>(
    `/api/v1/groups/${groupId}/invitations`,
  );
}

export async function createGroupInvitation(
  groupId: string,
  payload: GroupInvitationRequest,
) {
  return apiRequest<GroupInvitationResponse>(
    `/api/v1/groups/${groupId}/invitations`,
    {
      json: payload,
      method: "POST",
    },
  );
}

export async function updateGroupInvitation(
  groupId: string,
  invitationId: string,
  payload: GroupInvitationUpdateRequest,
) {
  return apiRequest<GroupInvitationResponse>(
    `/api/v1/groups/${groupId}/invitations/${invitationId}`,
    {
      json: payload,
      method: "PATCH",
    },
  );
}

export async function deleteGroupInvitation(
  groupId: string,
  invitationId: string,
) {
  return apiRequest<StatusResponse>(
    `/api/v1/groups/${groupId}/invitations/${invitationId}`,
    {
      method: "DELETE",
    },
  );
}

export async function acceptGroupInvitation(invitationId: string) {
  return apiRequest<GroupInvitationResponse>(
    `/api/v1/group-invitations/${invitationId}/accept`,
    {
      method: "POST",
    },
  );
}

export async function declineGroupInvitation(invitationId: string) {
  return apiRequest<GroupInvitationResponse>(
    `/api/v1/group-invitations/${invitationId}/decline`,
    {
      method: "POST",
    },
  );
}

export async function fetchAgentRecommendations() {
  return apiRequest<AgentRecommendationsPageResponse>(
    "/api/v1/chats/recommendations",
  );
}

export async function fetchChats(query: PaginationQuery = {}) {
  return apiRequest<ChatsPageResponse>("/api/v1/chats", { query });
}

export async function createChat(payload: ChatCreateRequest = { title: "New chat" }) {
  return apiRequest<ChatResponse>("/api/v1/chats", {
    json: payload,
    method: "POST",
  });
}

export async function fetchChat(chatId: string) {
  return apiRequest<ChatResponse>(`/api/v1/chats/${chatId}`);
}

export async function updateChat(chatId: string, payload: ChatUpdateRequest) {
  return apiRequest<ChatResponse>(`/api/v1/chats/${chatId}`, {
    json: payload,
    method: "PATCH",
  });
}

export async function deleteChat(chatId: string) {
  return apiRequest<StatusResponse>(`/api/v1/chats/${chatId}`, {
    method: "DELETE",
  });
}

export async function fetchChatMessages(
  chatId: string,
  query: PaginationQuery = {},
) {
  return apiRequest<ChatMessagesPageResponse>(
    `/api/v1/chats/${chatId}/messages`,
    { query },
  );
}

export async function createChatMessage(
  chatId: string,
  payload: ChatMessageCreateRequest,
) {
  return apiRequest<ChatMessageResponse>(
    `/api/v1/chats/${chatId}/messages`,
    {
      json: payload,
      method: "POST",
    },
  );
}
