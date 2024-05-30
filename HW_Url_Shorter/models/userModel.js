import { Model } from 'objection';
import UrlModel from './urlModel.js';
import { client } from '../config/db/knexfile.js';

Model.knex(client);

export default class UserModel extends Model {
  static get tableName() {
    return 'users';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['role', 'name', 'surname', 'email', 'hashedPassword'],

      properties: {
        id: { type: 'integer' },
        role: { type: 'string', minLength: 1, maxLength: 255 },
        name: { type: 'string', minLength: 1, maxLength: 255 },
        surname: { type: 'string', minLength: 1, maxLength: 255 },
        email: { type: 'string', minLength: 1, maxLength: 255 },
        hashedPassword: { type: 'string', minLength: 1, maxLength: 255 },
      },
    };
  }

  static get relationMappings() {
    return {
      urls: {
        relation: Model.HasManyRelation,
        modelClass: UrlModel,
        join: {
          from: 'users.id',
          to: 'urls.userId',
        },
      },
    };
  }
}
