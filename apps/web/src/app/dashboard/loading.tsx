import { Card, CardContent } from '@/components/ui/card';

export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div>
        <div className="h-7 w-40 bg-muted rounded" />
        <div className="h-4 w-56 bg-muted rounded mt-2" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-5">
              <div className="h-4 w-24 bg-muted rounded mb-2" />
              <div className="h-8 w-32 bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <div className="h-5 w-32 bg-muted rounded mb-4" />
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-muted rounded mb-3" />
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="h-5 w-24 bg-muted rounded mb-4" />
            <div className="h-12 bg-muted rounded mb-3" />
            <div className="h-12 bg-muted rounded" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
