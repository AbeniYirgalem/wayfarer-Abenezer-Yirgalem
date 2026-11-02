export const instant = false;

interface PlacePageProps {
  params: Promise<{ id: string }>;
}

export default async function PlaceDetailPage({ params }: PlacePageProps) {
  const { id } = await params;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold">Place Details</h1>
      <p className="text-gray-600 mt-2">Place ID: {id}</p>
      <p className="mt-4 text-sm text-gray-500">
        Detailed view with reviews, ratings, and tour bookings will be implemented in Phase 2 &amp; 3.
      </p>
    </div>
  );
}
