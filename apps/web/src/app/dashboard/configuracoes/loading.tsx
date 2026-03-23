import { Card, CardContent } from '@/components/ui/card';
export default function Loading() {
  return (
    <div className="max-w-2xl space-y-6 animate-pulse">
      <div><div className="h-7 w-40 bg-muted rounded" /><div className="h-4 w-56 bg-muted rounded mt-2" /></div>
      <div className="h-10 bg-muted rounded-lg" />
      {[1,2,3].map(i => <Card key={i}><CardContent className="p-6"><div className="h-5 w-32 bg-muted rounded mb-4"/><div className="space-y-3">{[1,2,3].map(j => <div key={j} className="h-10 bg-muted rounded"/>)}</div></CardContent></Card>)}
    </div>
  );
}
