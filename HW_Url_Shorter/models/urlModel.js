import { Model } from 'objection';
import client from '../config/db/knexfile.js';
import UserModel from './userModel.js';

Model.knex(client);

export default class UrlModel extends Model {
  static get tableName() {
    return 'urls';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: [
        'code',
        'name',
        'originalUrl',
        'visits',
        'shortLink',
        'userId',
      ],

      properties: {
        id: { type: 'integer' },
        code: { type: 'string', minLength: 1, maxLength: 255 },
        name: { type: 'string', minLength: 1, maxLength: 255 },
        originalUrl: { type: 'string', minLength: 1, maxLength: 255 },
        visits: { type: 'integer' },
        shortLink: { type: 'string', minLength: 1, maxLength: 255 },
        userId: { type: 'integer' },
      },
    };
  }

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: UserModel,
        join: {
          from: 'urls.userId',
          to: 'users.id',
        },
      },
    };
  }
}
