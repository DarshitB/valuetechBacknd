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
    
    "view_bank",
    "add_bank",
    "edit_bank",
    "delete_bank",
    "view_bank_branch",
    "add_bank_branch",
    "edit_bank_branch",
    "delete_bank_branch",
    "view_branch_officer",
    "add_branch_officer",
    "edit_branch_officer",
    "delete_branch_officer",

    "view_category",
    "add_category",
    "edit_category",
    "delete_category",
    "view_sub_category",
    "add_sub_category",
    "edit_sub_category",
    "delete_sub_category",
    "view_child_category",
    "add_child_category",
    "edit_child_category",
    "delete_child_category",
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
