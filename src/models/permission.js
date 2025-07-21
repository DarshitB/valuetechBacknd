const db = require('../../db');

const permission = {
  findAll: () => db('permissions').whereNull('deleted_at'),
};

module.exports = permission;
