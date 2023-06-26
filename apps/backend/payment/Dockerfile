# Build the docker image with `npx nx docker-build backend-orders`.
# Tip: Modify "docker-build" options in project.json to change docker build args.
FROM node:18-alpine

ENV PORT=3000
ENV NODE_ENV production

WORKDIR /app

# more security, run as the node user (created by the base node image) rather than the root user
USER node

COPY --chown=node:node dist/apps/backend/payment backend-payment

RUN npm --prefix backend-payment --omit=dev ci

CMD [ "node", "backend-payment/main.js" ]
