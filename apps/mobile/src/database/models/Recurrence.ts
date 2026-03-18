import { Model } from '@nozbe/watermelondb';
import { field, text, readonly, date } from '@nozbe/watermelondb/decorators';

export class RecurrenceModel extends Model {
  static table = 'recurrences';

  static associations = {};

  @field('user_id') userId!: string;
  @field('client_id') clientId!: string;
  @text('service_type') serviceType!: string;
  @field('value') value!: number;
  @text('frequency') frequency!: string;
  @field('day_of_week') dayOfWeek!: number;
  @field('time') time!: string | null;
  @field('active') active!: boolean;
  @text('next_generation_date') nextGenerationDate!: string;

  @readonly @date('created_at') createdAt!: Date;
  @date('updated_at') updatedAt!: Date;
}
