import { notFound } from "next/navigation";

import { operationDetailIds } from "@/shared/data/operation-details";
import { OperationDetailScreen } from "@/views/operations/operation-detail-screen";

type OperationDetailPageProps = {
  params: Promise<{
    operationId: string;
  }>;
};

export function generateStaticParams() {
  return operationDetailIds.map((operationId) => ({ operationId }));
}

export default async function OperationDetailPage({ params }: OperationDetailPageProps) {
  const { operationId } = await params;

  if (!operationDetailIds.includes(operationId)) {
    notFound();
  }

  return <OperationDetailScreen operationId={operationId} />;
}
