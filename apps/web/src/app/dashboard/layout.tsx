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

  // Query profile — graceful fallback if RLS blocks or table is empty
  let userName = user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? 'Jardineiro';
  let userEmail = user.email ?? null;
  let avatarUrl = user.user_metadata?.avatar_url ?? null;

  try {
    const { data: profile } = await supabase
      .from('users')
      .select('name, email, avatar_url')
      .eq('id', user.id)
      .single();

    if (profile) {
      userName = profile.name ?? userName;
      userEmail = profile.email ?? userEmail;
      avatarUrl = profile.avatar_url ?? avatarUrl;
    }
  } catch {
    // RLS blocked or table doesn't exist — use auth metadata
  }

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
