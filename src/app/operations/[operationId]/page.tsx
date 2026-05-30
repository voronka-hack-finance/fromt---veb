import { OperationDetailScreen } from "@/views/operations/operation-detail-screen";

type OperationDetailPageProps = {
  params: Promise<{
    operationId: string;
  }>;
};

export default async function OperationDetailPage({ params }: OperationDetailPageProps) {
  const { operationId } = await params;

  return <OperationDetailScreen operationId={operationId} />;
}
