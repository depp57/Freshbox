# Build the docker image with `npx nx docker-build backend-order`.
# Tip: Modify "docker-build" options in project.json to change docker build args.

# No need for "multi-stage build" because the "npx nx docker-build app" command already builds the application
# and places the build in dist/apps/backend/app
FROM node:20-alpine3.18

ENV PORT=3000
ENV NODE_ENV production

# more security, run as the node user (created by the base node image) rather than the root user
USER node

COPY --chown=node:node dist/apps/backend/payment /app

WORKDIR /app

RUN npm --omit=dev i && rm package*.json && npm cache clean --force

CMD [ "node", "main.js" ]
