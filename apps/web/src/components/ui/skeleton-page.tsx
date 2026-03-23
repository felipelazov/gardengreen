import { Card, CardContent } from '@/components/ui/card';

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="animate-pulse space-y-6">
      <div>
        <div className="h-7 w-40 bg-muted rounded" />
        <div className="h-4 w-56 bg-muted rounded mt-2" />
      </div>
      <div className="flex gap-3">
        <div className="h-10 w-64 bg-muted rounded" />
        <div className="h-10 w-32 bg-muted rounded" />
        <div className="ml-auto h-10 w-36 bg-muted rounded" />
      </div>
      <Card>
        <CardContent className="p-0">
          <div className="h-10 bg-muted/50 border-b border-border" />
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="h-14 border-b border-border flex items-center px-3 gap-4">
              <div className="h-4 w-32 bg-muted rounded" />
              <div className="h-4 w-24 bg-muted rounded" />
              <div className="h-4 w-20 bg-muted rounded hidden md:block" />
              <div className="ml-auto h-5 w-16 bg-muted rounded-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
