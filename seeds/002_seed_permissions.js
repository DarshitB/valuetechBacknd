/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  const permissions = [
    "view_dashboard",
    "view_user",
    "add_user",
    "edit_user",
    "delete_user",
    "add_role",
    "edit_role",
    "delete_role",
    "view_permission",
    "edit_permission",
    "view_state",
    "add_state",
    "edit_state",
    "delete_state",
    "view_cities",
    "add_cities",
    "edit_cities",
    "delete_cities",
  ];

  // Insert permissions
  const inserted = await Promise.all(
    permissions.map((name) => {
      return knex("permissions").insert({ name }).returning("id");
    })
  );
  const allPermissionIds = inserted.map(([row]) => row.id);

  const developerAdminRole = await knex("roles")
    .where({ name: "developer_admin" })
    .first();

  // Assign all permissions to developer_admin
 /*  for (const permission_id of allPermissionIds) {
    await knex("role_permissions").insert({
      role_id: developerAdminRole.id,
      permission_id,
      created_by: 1,
    });
  } */
};
