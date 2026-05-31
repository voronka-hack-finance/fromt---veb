import { GoalDetailScreen } from "@/views/goals/goal-detail-screen";

type GoalDetailPageProps = {
  params: Promise<{
    goalId: string;
  }>;
};

export default async function GoalDetailPage({ params }: GoalDetailPageProps) {
  const { goalId } = await params;

  return <GoalDetailScreen goalId={goalId} />;
}
