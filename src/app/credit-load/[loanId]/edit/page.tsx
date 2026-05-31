import { AddCreditScreen } from "@/views/credit-load/add-credit-screen";

type EditCreditPageProps = {
  params: Promise<{
    loanId: string;
  }>;
};

export default async function EditCreditPage({ params }: EditCreditPageProps) {
  const { loanId } = await params;

  return <AddCreditScreen debtId={loanId} />;
}
