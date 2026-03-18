import { Model } from '@nozbe/watermelondb';
import { field, text, readonly, date } from '@nozbe/watermelondb/decorators';

export class PhotoModel extends Model {
  static table = 'photos';

  static associations = {
    services: { type: 'belongs_to' as const, key: 'service_id' },
    clients: { type: 'belongs_to' as const, key: 'client_id' },
  };

  @field('service_id') serviceId!: string;
  @field('client_id') clientId!: string;
  @field('user_id') userId!: string;
  @text('type') type!: string;
  @field('url') url!: string | null;
  @field('local_path') localPath!: string | null;
  @text('upload_status') uploadStatus!: string;
  @field('file_size') fileSize!: number;

  @readonly @date('created_at') createdAt!: Date;
  @date('updated_at') updatedAt!: Date;
}
