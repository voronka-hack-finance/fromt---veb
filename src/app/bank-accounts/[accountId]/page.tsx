import { notFound } from "next/navigation";

import { bankAccountDetailIds } from "@/shared/data/bank-account-detail";
import { BankAccountDetailScreen } from "@/views/bank-accounts/bank-account-detail-screen";

type BankAccountDetailPageProps = {
  params: Promise<{
    accountId: string;
  }>;
};

export function generateStaticParams() {
  return bankAccountDetailIds.map((accountId) => ({ accountId }));
}

export default async function BankAccountDetailPage({ params }: BankAccountDetailPageProps) {
  const { accountId } = await params;

  if (!bankAccountDetailIds.includes(accountId)) {
    notFound();
  }

  return <BankAccountDetailScreen accountId={accountId} />;
}
