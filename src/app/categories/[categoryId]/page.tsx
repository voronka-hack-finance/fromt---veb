import { CategoryDetailScreen } from "@/views/categories/category-detail-screen";

type CategoryDetailPageProps = {
  params: Promise<{
    categoryId: string;
  }>;
};

export default async function CategoryDetailPage({ params }: CategoryDetailPageProps) {
  const { categoryId } = await params;

  return <CategoryDetailScreen categoryId={categoryId} />;
}
