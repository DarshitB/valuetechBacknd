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
npx knex seed:make 003_seed_roles

# to run seed 
npx knex seed:run # use package.json

knex seed:run --env production # use package.json

npx knex seed:run --specific=004_seed_order_status_master.js --env development

# to remove all git branch from windows
Remove-Item -Recurse -Force .git
# Confirm delete
Get-ChildItem -Force 



on 
onDelete("RESTRICT") it will now allow to delte the perent if this is set to any child table with forain key
onDelete("CASCADE") it will delete all the child if perent will deleted


# old api
POST - https://test.buydesigns.in/api/fetch-cities
POST - https://test.buydesigns.in/api/fetch-sub-categories
POST - https://test.buydesigns.in/api/fetch-branches

POST - https://test.buydesigns.in/api/v1/login
POST - https://test.buydesigns.in/api/v1/verify-otp
POST - https://test.buydesigns.in/api/v1/resend-otp

now this apis after login
POST - https://test.buydesigns.in/api/v1/me
POST - https://test.buydesigns.in/api/v1/tokens
POST - https://test.buydesigns.in/api/v1/logout
GET - https://test.buydesigns.in/api/v1/jobs
POST - https://test.buydesigns.in/api/v1/job-media/{job_id}


order media image video
id , order id, uploader type, uploader id, media url, media type , status, created at, updated at, updated by

order media report collage
id, order id, 