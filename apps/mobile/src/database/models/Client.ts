import { Model } from '@nozbe/watermelondb';
import { field, text, readonly, date, children } from '@nozbe/watermelondb/decorators';

export class ClientModel extends Model {
  static table = 'clients';

  static associations = {
    services: { type: 'has_many' as const, foreignKey: 'client_id' },
    notes: { type: 'has_many' as const, foreignKey: 'client_id' },
    photos: { type: 'has_many' as const, foreignKey: 'client_id' },
  };

  @text('name') name!: string;
  @text('phone') phone!: string;
  @field('email') email!: string | null;
  @field('address') address!: string | null;
  @field('neighborhood') neighborhood!: string | null;
  @field('city') city!: string | null;
  @field('notes') notes!: string | null;
  @text('status') status!: string;
  @field('user_id') userId!: string;

  @children('services') services!: any;
  @children('notes') clientNotes!: any;
  @children('photos') photos!: any;

  @readonly @date('created_at') createdAt!: Date;
  @date('updated_at') updatedAt!: Date;
}
