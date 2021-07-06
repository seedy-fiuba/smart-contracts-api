run:
		docker-compose up --build

deploy-heroku:
		heroku container:login
		heroku container:push web --app seedy-fiuba-smart-contract
		heroku container:release web --app seedy-fiuba-smart-contract
