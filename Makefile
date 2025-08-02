up-dev:
	docker compose -f docker-compose.dev.yml -p profsummit-dev up -d --force-recreate
up:
	docker compose -f docker-compose.yml -p profsummit up -d --force-recreate