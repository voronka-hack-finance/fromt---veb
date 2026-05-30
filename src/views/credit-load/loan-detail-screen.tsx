import { LoanDetailScreenView } from "@/widgets/credit-load/loan-detail-screen";

export function LoanDetailScreen({ loanId }: { loanId: string }) {
  return <LoanDetailScreenView loanId={loanId} />;
}
