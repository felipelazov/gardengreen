import { Model } from '@nozbe/watermelondb';
import { field, text, readonly, date, children, relation } from '@nozbe/watermelondb/decorators';

export class ServiceModel extends Model {
  static table = 'services';

  static associations = {
    clients: { type: 'belongs_to' as const, key: 'client_id' },
    payments: { type: 'has_many' as const, foreignKey: 'service_id' },
    photos: { type: 'has_many' as const, foreignKey: 'service_id' },
  };

  @field('client_id') clientId!: string;
  @field('user_id') userId!: string;
  @text('date') date!: string;
  @field('time') time!: string | null;
  @text('type') type!: string;
  @field('description') description!: string | null;
  @field('value') value!: number;
  @text('status') status!: string;
  @field('recurrence_id') recurrenceId!: string | null;
  @field('assigned_to') assignedTo!: string | null;
  @field('team_id') teamId!: string | null;
  @field('quote_id') quoteId!: string | null;
  @field('notes') notes!: string | null;
  @field('completed_at') completedAt!: number | null;
  @field('cancelled_at') cancelledAt!: number | null;

  @relation('clients', 'client_id') client!: any;
  @children('payments') payments!: any;
  @children('photos') photos!: any;

  @readonly @date('created_at') createdAt!: Date;
  @date('updated_at') updatedAt!: Date;
}
