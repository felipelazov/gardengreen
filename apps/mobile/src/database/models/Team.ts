import { Model } from '@nozbe/watermelondb';
import { field, text, readonly, date, children } from '@nozbe/watermelondb/decorators';

export class TeamModel extends Model {
  static table = 'teams';

  static associations = {
    team_members: { type: 'has_many' as const, foreignKey: 'team_id' },
  };

  @text('name') name!: string;
  @field('owner_id') ownerId!: string;
  @text('plan') plan!: string;

  @children('team_members') members!: any;

  @readonly @date('created_at') createdAt!: Date;
  @date('updated_at') updatedAt!: Date;
}
