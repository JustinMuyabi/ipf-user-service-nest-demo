# syntax=docker/dockerfile:1

ARG NODE_VERSION=20.12.2

FROM node:${NODE_VERSION}-alpine AS base

WORKDIR /usr/src/app

FROM base AS deps

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

FROM deps AS build

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci

COPY . .

# Generate Prisma Client
RUN npx prisma generate

RUN npm run build

FROM base AS final

ENV NODE_ENV=production

COPY package.json .

COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist

COPY prisma/schema.prisma ./prisma/schema.prisma
COPY prisma/migrations ./prisma/migrations

COPY entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

EXPOSE 4000 4001

ENV DATABASE_URL="postgresql://admin:admin123@postgres:5432/users_id?schema=public"

RUN npx prisma generate

USER node

ENTRYPOINT ["./entrypoint.sh"]