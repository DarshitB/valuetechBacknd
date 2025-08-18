# to create migration
npx knex migrate:make 011_create_order_comment_tags_schema

# to run migration
npx knex migrate:latest   # use package.json

knex migrate:latest --env production # use package.json

# to rollback to all the migration
npx knex migrate:rollback --all

npm run migrate:down:dev 20250813044629_009_create_order_statesMaster_statusHistory_schema.js


# to rollback last migration 
npx knex migrate:down
# to rolleback cia file name
npx knex migrate:down 20250813044629_009_create_order_statesMaster_statusHistory_schema.js --env development
  
# to create seed
npx knex seed:make 003_seed_order_status_master

# to run seed 
npx knex seed:run # use package.json

knex seed:run --env production # use package.json

npx knex seed:run --specific=003_seed_order_status_master.js --env development

# to remove all git branch from windows
Remove-Item -Recurse -Force .git
# Confirm delete
Get-ChildItem -Force 



on 
onDelete("RESTRICT") it will now allow to delte the perent if this is set to any child table with forain key
onDelete("CASCADE") it will delete all the child if perent will deleted