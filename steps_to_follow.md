# to create migration
npx knex migrate:make 008_create_field_verifiers_schema

# to run migration
npx knex migrate:latest   # use package.json

knex migrate:latest --env production # use package.json

# to rollback to all the migration
npx knex migrate:rollback --all

npm run migrate:down:dev 20250731045343_008_create_field_verifiers_schema.js


# to rollback last migration 
npx knex migrate:down

# to create seed
npx knex seed:make 002_seed_permissions

# to run seed 
npx knex seed:run # use package.json

knex seed:run --env production # use package.json

# to remove all git branch from windows
Remove-Item -Recurse -Force .git
# Confirm delete
Get-ChildItem -Force 
