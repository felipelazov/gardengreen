import { Model } from '@nozbe/watermelondb';
import { field, text, readonly, date, relation } from '@nozbe/watermelondb/decorators';

export class NoteModel extends Model {
  static table = 'notes';

  static associations = {
    clients: { type: 'belongs_to' as const, key: 'client_id' },
  };

  @field('client_id') clientId!: string;
  @field('user_id') userId!: string;
  @text('content') content!: string;

  @relation('clients', 'client_id') client!: any;

  @readonly @date('created_at') createdAt!: Date;
  @date('updated_at') updatedAt!: Date;
}
