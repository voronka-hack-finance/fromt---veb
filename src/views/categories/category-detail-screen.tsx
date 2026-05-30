import { CategoryDetailScreenView } from "@/widgets/categories/category-detail-screen";

export function CategoryDetailScreen({ categoryId }: { categoryId: string }) {
  return <CategoryDetailScreenView categoryId={categoryId} />;
}
