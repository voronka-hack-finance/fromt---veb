import { BankAccountDetailScreen } from "@/views/bank-accounts/bank-account-detail-screen";

type BankAccountDetailPageProps = {
  params: Promise<{
    accountId: string;
  }>;
};

export default async function BankAccountDetailPage({ params }: BankAccountDetailPageProps) {
  const { accountId } = await params;

  return <BankAccountDetailScreen accountId={accountId} />;
}
