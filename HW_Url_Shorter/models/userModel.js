import { Model } from 'objection';
import client from '../config/db/knexfile.js';
import UrlModel from './urlModel.js';

Model.knex(client);

export default class UserModel extends Model {
  static get tableName() {
    return 'users';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name', 'password'],

      properties: {
        id: { type: 'integer' },
        name: { type: 'string', minLength: 1, maxLength: 255 },
        password: { type: 'string', minLength: 1, maxLength: 255 },
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
