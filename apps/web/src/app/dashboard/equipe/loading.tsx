import { Card, CardContent } from '@/components/ui/card';
export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div><div className="h-7 w-28 bg-muted rounded" /><div className="h-4 w-36 bg-muted rounded mt-2" /></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1,2,3].map(i => <Card key={i}><CardContent className="p-5"><div className="flex gap-3 items-center"><div className="h-10 w-10 bg-muted rounded-full"/><div className="flex-1"><div className="h-4 w-24 bg-muted rounded mb-1"/><div className="h-3 w-16 bg-muted rounded"/></div></div></CardContent></Card>)}
      </div>
    </div>
  );
}
