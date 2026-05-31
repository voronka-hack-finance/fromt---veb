import { AddCreditScreenView } from "@/widgets/credit-load/add-credit-screen";

export function AddCreditScreen({ debtId }: { debtId?: string }) {
  return <AddCreditScreenView debtId={debtId} />;
}
