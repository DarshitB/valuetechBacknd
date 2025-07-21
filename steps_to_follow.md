# to create migration
npx knex migrate:make 004_create_activity_log_schema

# to run migration
npx knex migrate:latest

knex migrate:latest --env production

# to rollback to all the migration
npx knex migrate:rollback --all

# to rollback last migration 
npx knex migrate:down

# to create seed
npx knex seed:make 002_seed_permissions

# to run seed 
npx knex seed:run

knex seed:run --env production

# check connection with supabase database
psql "postgres://postgres:dr04LeEQaJweucXc@db.ruzlbabkzaillsgrbqvu.supabase.co:5432/postgres?sslmode=require"


postgresql://postgres:7pKNMOuV3X4mbLNy@db.sbohtnnailsqhuooupqg.supabase.co:5432/postgres
