import { Card, CardContent } from '@/components/ui/card';
export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div><div className="h-7 w-32 bg-muted rounded" /><div className="h-4 w-48 bg-muted rounded mt-2" /></div>
      <div className="flex justify-end"><div className="h-10 w-36 bg-muted rounded" /></div>
      <Card><CardContent className="p-4"><div className="h-[500px] bg-muted rounded" /></CardContent></Card>
    </div>
  );
}
