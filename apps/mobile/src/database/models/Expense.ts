import { Model } from '@nozbe/watermelondb';
import { field, text, readonly, date } from '@nozbe/watermelondb/decorators';

export class ExpenseModel extends Model {
  static table = 'expenses';

  static associations = {};

  @field('user_id') userId!: string;
  @text('description') description!: string;
  @field('amount') amount!: number;
  @text('category') category!: string;
  @text('date') date!: string;

  @readonly @date('created_at') createdAt!: Date;
  @date('updated_at') updatedAt!: Date;
}
