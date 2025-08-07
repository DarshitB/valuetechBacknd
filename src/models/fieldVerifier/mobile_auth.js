const db = require("../../../db");

const mobile_auth = {
  // Find verifier by mobile
  findByMobile: (mobile) =>
    db("field_verifiers")
      .select(
        "id",
        "name",
        "mobile",
        "username",
        "password",
        "valid_minutes",
        "is_active"
      )
      .where({ mobile })
      .whereNull("deleted_at")
      .first(),

  // Find verifier by mobile OR username
  findByMobileOrUsername: (identifier) =>
    db("field_verifiers")
      .select("id", "name", "mobile", "username", "password", "is_active")
      .where(function () {
        this.where("mobile", identifier).orWhere("username", identifier);
      })
      .whereNull("deleted_at")
      .first(),

  // Save login session with token and expiry
  logLogin: (data) => db("field_verifier_logins").insert(data).returning("*"),

  // Invalidate a token manually (logout)
  logoutById: (id) =>
    db("field_verifier_logins").where({ id }).update({
      deleted_at: new Date(),
    }),

  // Check if token is still valid and not expired (custom check logic)
  findValidSession: (token) =>
    db("field_verifier_logins")
      .leftJoin(
        "field_verifiers",
        "field_verifier_logins.field_verifier_id",
        "field_verifiers.id"
      )
      .select(
        "field_verifier_logins.*",
        "field_verifiers.name as verifier_name",
        "field_verifiers.mobile"
      )
      .where("field_verifier_logins.token", token)
      .where("field_verifier_logins.expires_at", ">", new Date())
      .whereNull("field_verifier_logins.deleted_at")
      .first(),
};

module.exports = mobile_auth;