import { Model } from '@nozbe/watermelondb';
import { field, text, readonly, date, relation } from '@nozbe/watermelondb/decorators';

export class PaymentModel extends Model {
  static table = 'payments';

  static associations = {
    services: { type: 'belongs_to' as const, key: 'service_id' },
  };

  @field('service_id') serviceId!: string;
  @field('user_id') userId!: string;
  @field('client_id') clientId!: string;
  @field('amount') amount!: number;
  @text('method') method!: string;
  @text('status') status!: string;
  @field('pix_transaction_id') pixTransactionId!: string | null;
  @field('pix_link') pixLink!: string | null;
  @field('paid_at') paidAt!: number | null;

  @relation('services', 'service_id') service!: any;

  @readonly @date('created_at') createdAt!: Date;
  @date('updated_at') updatedAt!: Date;
}
