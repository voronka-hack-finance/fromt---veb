import { notFound } from "next/navigation";

import { creditLoadLoanIds } from "@/shared/data/credit-load-loans";
import { LoanDetailScreen } from "@/views/credit-load/loan-detail-screen";

type LoanDetailPageProps = {
  params: Promise<{
    loanId: string;
  }>;
};

export function generateStaticParams() {
  return creditLoadLoanIds.map((loanId) => ({ loanId }));
}

export default async function LoanDetailPage({ params }: LoanDetailPageProps) {
  const { loanId } = await params;

  if (!creditLoadLoanIds.includes(loanId)) {
    notFound();
  }

  return <LoanDetailScreen loanId={loanId} />;
}
