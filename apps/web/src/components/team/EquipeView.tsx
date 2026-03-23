'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { StatusBadge } from '@/components/ui/status-badge';
import { Plus, Phone } from 'lucide-react';
import { InviteMemberDialog } from './InviteMemberDialog';
import type { Status } from '@/components/ui/status-badge';

interface Member {
  id: string;
  role: string;
  status: string;
  users: { name: string; phone: string; avatar_url: string | null } | null;
}

export function EquipeView({ members }: { members: Member[] }) {
  const [showInvite, setShowInvite] = useState(false);

  return (
    <>
      <div className="flex justify-end">
        <Button onClick={() => setShowInvite(true)}>
          <Plus className="h-4 w-4 mr-1" /> Convidar Membro
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.map((member) => {
          const user = member.users as any;
          const initials = (user?.name ?? 'M').split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();
          return (
            <Card key={member.id}>
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <Avatar>
                    {user?.avatar_url && <AvatarImage src={user.avatar_url} />}
                    <AvatarFallback className="bg-primary-light-mid text-primary-dark text-sm font-bold">{initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{user?.name ?? 'Membro'}</p>
                    <p className="text-xs text-muted-foreground capitalize">{member.role}</p>
                  </div>
                  <StatusBadge status={member.status as Status} />
                </div>
                {user?.phone && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Phone className="h-3 w-3" />
                    {user.phone}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}

        {members.length === 0 && (
          <div className="col-span-full text-center py-8 text-muted-foreground">
            Nenhum membro na equipe. Convide alguem para comecar.
          </div>
        )}
      </div>

      <InviteMemberDialog open={showInvite} onOpenChange={setShowInvite} />
    </>
  );
}
