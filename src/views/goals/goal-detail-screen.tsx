import { GoalDetailScreenView } from "@/widgets/goals/goal-detail-screen";

export function GoalDetailScreen({ goalId }: { goalId: string }) {
  return <GoalDetailScreenView goalId={goalId} />;
}
