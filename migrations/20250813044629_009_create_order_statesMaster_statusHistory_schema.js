/**
 * Orders Module Migration with Auto Order Number
 *
 * Tables:
 * 1. order_status_master - Stores predefined order statuses
 * 2. orders - Main orders table with current status
 * 3. order_status_history - Tracks status change history
 *
 * Auto Generates: order_number like "ORD00000001"
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  // Create 'order_status_master' table
  await knex.schema.createTable("order_status_master", (table) => {
    table.increments("id").primary(); // Status ID (PK)
    table.string("name", 100).notNullable(); // Status display name
    table.text("description").nullable(); // Optional description
  });

  // Create 'orders' table
  await knex.schema.createTable("orders", (table) => {
    table.increments("id").primary(); // Internal ID (auto increment)

    table.string("order_number", 20).unique().notNullable();
    // Custom formatted order number like 'ORD00000001' (set via trigger)

    table.string("customer_name", 255).notNullable();
    table.string("contact", 20).notNullable();
    table.string("alternative_contact", 20).nullable();
    
    table.integer("officer_id").unsigned().nullable()
    .references("id").inTable("users").onDelete("RESTRICT");
    
    table.integer("manager_id").unsigned().nullable()
    .references("id").inTable("users").onDelete("RESTRICT");
    
    table.string("registration_number").nullable();
    table.text("place_of_inspection").nullable();
    table.date("date_of_inspection").nullable();

    table.integer("current_status_id").unsigned().notNullable().defaultTo(1)
      .references("id").inTable("order_status_master").onDelete("RESTRICT");

    // Audit columns
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.integer("created_by").unsigned()
      .references("id").inTable("users").onDelete("SET NULL");
    table.timestamp("updated_at").nullable();
    table.integer("updated_by").unsigned()
      .references("id").inTable("users").onDelete("SET NULL");
    table.timestamp("deleted_at").nullable();
    table.integer("deleted_by").unsigned()
      .references("id").inTable("users").onDelete("SET NULL");
  });

  // Create 'order_status_history' table
  await knex.schema.createTable("order_status_history", (table) => {
    table.increments("id").primary();

    table.integer("order_id").unsigned().notNullable()
      .references("id").inTable("orders").onDelete("CASCADE");

    table.integer("status_id").unsigned().notNullable()
      .references("id").inTable("order_status_master").onDelete("RESTRICT");

    table.integer("changed_by").unsigned().notNullable()
      .references("id").inTable("users").onDelete("RESTRICT");

    table.timestamp("changed_at").defaultTo(knex.fn.now());
  });

  // Create function & trigger for auto order_number generation (PostgreSQL)
  await knex.raw(`
    CREATE OR REPLACE FUNCTION generate_order_number()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.order_number := 'ORD' || LPAD(NEW.id::text, 8, '0');
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `);

  await knex.raw(`
    CREATE TRIGGER set_order_number
    BEFORE INSERT ON orders
    FOR EACH ROW
    EXECUTE FUNCTION generate_order_number();
  `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  // Drop trigger & function first
  await knex.raw(`DROP TRIGGER IF EXISTS set_order_number ON orders;`);
  await knex.raw(`DROP FUNCTION IF EXISTS generate_order_number;`);

  // Drop tables
  await knex.schema.dropTableIfExists("order_status_history");
  await knex.schema.dropTableIfExists("orders");
  await knex.schema.dropTableIfExists("order_status_master");
};
