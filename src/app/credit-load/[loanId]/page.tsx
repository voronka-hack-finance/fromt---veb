import { LoanDetailScreen } from "@/views/credit-load/loan-detail-screen";

type LoanDetailPageProps = {
  params: Promise<{
    loanId: string;
  }>;
};

export default async function LoanDetailPage({ params }: LoanDetailPageProps) {
  const { loanId } = await params;

  return <LoanDetailScreen loanId={loanId} />;
}
