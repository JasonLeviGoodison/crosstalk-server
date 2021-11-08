# Has to be run from project root

rm backend.zip

mv .env .env.local

mv .env.prod .env

rm -R node_modules

zip -r backend.zip .

mv .env .env.prod

mv .env.local .env
