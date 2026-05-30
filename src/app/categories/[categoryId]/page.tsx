import { notFound } from "next/navigation";

import { categoriesScreenData } from "@/shared/data/categories";
import { CategoryDetailScreen } from "@/views/categories/category-detail-screen";

type CategoryDetailPageProps = {
  params: Promise<{
    categoryId: string;
  }>;
};

export function generateStaticParams() {
  return categoriesScreenData.categories.map((category) => ({
    categoryId: category.id,
  }));
}

export default async function CategoryDetailPage({ params }: CategoryDetailPageProps) {
  const { categoryId } = await params;

  if (!categoriesScreenData.categories.some((category) => category.id === categoryId)) {
    notFound();
  }

  return <CategoryDetailScreen categoryId={categoryId} />;
}
