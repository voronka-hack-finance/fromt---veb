import { OperationDetailScreenView } from "@/widgets/operations/operation-detail-screen";

export function OperationDetailScreen({ operationId }: { operationId: string }) {
  return <OperationDetailScreenView operationId={operationId} />;
}
