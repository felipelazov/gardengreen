import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Sidebar } from '@/components/layout/Sidebar';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { ToastProvider } from '@/components/ui/toast';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('users')
    .select('name, email, avatar_url')
    .eq('id', user.id)
    .single();

  const userName = profile?.name ?? user.user_metadata?.full_name ?? 'Jardineiro';
  const userEmail = profile?.email ?? user.email ?? null;
  const avatarUrl = profile?.avatar_url ?? user.user_metadata?.avatar_url ?? null;

  return (
    <ThemeProvider>
      <ToastProvider>
        <div className="min-h-screen bg-muted/30">
          <Sidebar userName={userName} userEmail={userEmail} avatarUrl={avatarUrl} />
          <main className="md:ml-64 min-h-screen">
            <div className="p-6 md:p-8 pt-16 md:pt-8 animate-page-in">
              {children}
            </div>
          </main>
        </div>
      </ToastProvider>
    </ThemeProvider>
  );
}
