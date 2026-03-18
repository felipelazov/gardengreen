import { Model } from '@nozbe/watermelondb';
import { field, text, readonly, date, relation } from '@nozbe/watermelondb/decorators';

export type TeamMemberRole = 'admin' | 'member';
export type TeamMemberStatus = 'invited' | 'active' | 'inactive';

export class TeamMemberModel extends Model {
  static table = 'team_members';

  static associations = {
    teams: { type: 'belongs_to' as const, key: 'team_id' },
  };

  @field('team_id') teamId!: string;
  @field('user_id') userId!: string | null;
  @text('name') name!: string;
  @text('phone') phone!: string;
  @text('role') role!: TeamMemberRole;
  @text('status') status!: TeamMemberStatus;
  @field('push_token') pushToken!: string | null;

  @relation('teams', 'team_id') team!: any;

  @readonly @date('created_at') createdAt!: Date;
  @date('updated_at') updatedAt!: Date;
}
