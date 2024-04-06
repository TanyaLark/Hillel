import { Model } from 'objection';
import UserModel from './userModel.js';
import { client } from '../config/db/knexfile.js';

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
        'user_id',
      ],

      properties: {
        id: { type: 'integer' },
        code: { type: 'string', minLength: 1, maxLength: 255 },
        name: { type: 'string', minLength: 1, maxLength: 255 },
        originalUrl: { type: 'string', minLength: 1, maxLength: 255 },
        visits: { type: 'integer' },
        shortLink: { type: 'string', minLength: 1, maxLength: 255 },
        user_id: { type: 'integer' },
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
