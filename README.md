# Sveltekit Job Board

A sveltekit job posting board that utilizes sveltekit for the entire fullstack framework, to save time

## Tech Stack
- Sveltekit: Fullstack framework (uses nodeJS adapter)
- Typescript: Language
- Prisma: ORM for databases
- Docker: for the local infrastructure
- Yarn: package manager
- Vite: Builder

## Setting up

```bash
# create an env file from the example env (you can just the one provided for local projects)
cp .env.example .env
```

```bash
# start up the docker image for the database and mailhog
docker compose up
```

```bash
# install the required dependencies
yarn install

# run the prisma migration
npx prisma migrate dev
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
yarn dev

# or start the server and open the app in a new browser tab
yarn dev -- --open
```

## Building

To create a production version of your app:

```bash
yarn build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
