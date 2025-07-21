const Permission = require('../models/permission');
const RolePermission = require('../models/rolePermission');
const { BadRequestError } = require('../utils/customErrors');

// GET /api/permissions/all
exports.getAllPermissions = async (req, res, next) => {
  try {
    const perms = await Permission.findAll();
    res.json(perms);
  } catch (err) {
    next(err);
  }
};

// GET /api/permissions/role-wise
exports.getAllRolePermissions = async (req, res, next) => {
  try {
    const result = await RolePermission.findAllWithRoles();
    res.json(result);
  } catch (err) {
    next(err);
  }
};

// PUT /api/permissions/role-bulk
exports.updateAllRolePermissions = async (req, res, next) => {
  try {
    const rolePermissions = req.body;

    if (!Array.isArray(rolePermissions)) {
      throw new BadRequestError('Invalid input format. Expecting array.');
    }

    for (const item of rolePermissions) {
      const { roleId, permissions } = item;
      if (!Array.isArray(permissions)) continue;

      await RolePermission.updatePermissions(roleId, permissions, req.user.id);
    }

    res.json({ message: 'Permissions updated for all roles' });
  } catch (err) {
    next(err);
  }
};
