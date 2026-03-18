import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';

import { schema } from './schema';
import { ClientModel } from './models/Client';
import { ServiceModel } from './models/Service';
import { PaymentModel } from './models/Payment';
import { QuoteModel } from './models/Quote';
import { ExpenseModel } from './models/Expense';
import { PhotoModel } from './models/Photo';
import { NoteModel } from './models/Note';
import { RecurrenceModel } from './models/Recurrence';

const adapter = new SQLiteAdapter({
  schema,
  jsi: true,
  onSetUpError: (error) => {
    console.error('WatermelonDB setup error:', error);
  },
});

export const database = new Database({
  adapter,
  modelClasses: [
    ClientModel,
    ServiceModel,
    PaymentModel,
    QuoteModel,
    ExpenseModel,
    PhotoModel,
    NoteModel,
    RecurrenceModel,
  ],
});
