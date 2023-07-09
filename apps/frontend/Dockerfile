# Build the docker image with `npx nx docker-build backend-order`.
# Tip: Modify "docker-build" options in project.json to change docker build args.
FROM nginx:1.25-alpine3.17

COPY dist/apps/frontend /usr/share/nginx/html
COPY infra/api-gateway/conf.d /etc/nginx/conf.d
COPY infra/api-gateway/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
