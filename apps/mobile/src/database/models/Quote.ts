import { Model } from '@nozbe/watermelondb';
import { field, text, readonly, date, relation } from '@nozbe/watermelondb/decorators';

export class QuoteModel extends Model {
  static table = 'quotes';

  static associations = {
    clients: { type: 'belongs_to' as const, key: 'client_id' },
  };

  @field('user_id') userId!: string;
  @field('client_id') clientId!: string;
  @text('number') number!: string;
  @text('items') items!: string;
  @field('total') total!: number;
  @text('status') status!: string;
  @text('valid_until') validUntil!: string;
  @field('sent_at') sentAt!: number | null;
  @field('approved_at') approvedAt!: number | null;
  @field('notes') notes!: string | null;

  @relation('clients', 'client_id') client!: any;

  @readonly @date('created_at') createdAt!: Date;
  @date('updated_at') updatedAt!: Date;
}
