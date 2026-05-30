import { BankAccountDetailScreenView } from "@/widgets/bank-accounts/bank-account-detail-screen";

export function BankAccountDetailScreen({ accountId }: { accountId: string }) {
  return <BankAccountDetailScreenView accountId={accountId} />;
}
