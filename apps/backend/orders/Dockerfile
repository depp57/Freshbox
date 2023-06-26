# Build the docker image with `npx nx docker-build backend-orders`.
# Tip: Modify "docker-build" options in project.json to change docker build args.

# No need for "multi-stage build" because the "npx nx docker-build app" command already builds the application
# and places the build in dist/apps/backend/app
FROM node:18-alpine

ENV PORT=3000
ENV NODE_ENV production

WORKDIR /app

# more security, run as the node user (created by the base node image) rather than the root user
USER node

COPY --chown=node:node dist/apps/backend/orders backend-orders

RUN npm --prefix backend-orders --omit=dev ci

CMD [ "node", "backend-orders/main.js" ]
