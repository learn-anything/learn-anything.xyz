<p align="center">
  <a href="https://learn-anything.xyz">
    <img alt="Learn-Anything.xyz" src="https://raw.githubusercontent.com/learn-anything/docs/main/brand/learn-anything-banner.png" width="800" />
  </a>
</p>

# [Learn-Anything.xyz](https://learn-anything.xyz) [![Discord](https://img.shields.io/badge/Discord-100000?style=flat&logo=discord&logoColor=white&labelColor=black&color=black)](https://discord.com/invite/bxtD8x6aNF)

> Organize world's knowledge, explore connections and curate learning paths

End goal of Learn Anything is to become the best place and tool for keeping track of what you know. What ideas you have. What you want to learn next. What you don't know yet. And how you can learn that in most optimal way possible given what you know already.

[Try website yourself first to get feel for it](https://learn-anything.xyz).

It is fully open source project with active community on [Discord](https://discord.com/invite/bxtD8x6aNF). There is great focus on both DX of developing everything LA and even more, end user UX.

#### Contents

- [Files](#files)
- [Setup](#setup)
- [Run GraphQL server (Grafbase)](#run-graphql-server-grafbase)
- [Run website (Solid)](#run-website-solid)
- [Contribute](#contribute)
- [Docs](#docs)
- [Design](#design)
- [Tasks / Explore](#tasks--explore)
- [Commands](#commands)

## Files

- [api](api) - [Grafbase](https://grafbase.com) GraphQL API layer + [EdgeDB](https://www.edgedb.com)
- [app](app) - desktop app built with Tauri/Solid
- [cli](cli) - clis for internal/external use
- [shared](shared) - shared TS functions (can be used by any part of monorepo)
- [website](website) - learn-anything.xyz website code in Solid

## Setup

[PNPM](https://pnpm.io) is used to manage dependencies. [Bun](https://bun.sh) is used to run things.

```
pnpm i
bun setup
```

`bun setup` runs `bun cmd.ts setup` (see [cmd.ts](cmd.ts) code for what it does). In short it will setup the project ready for development with all the deps, `.env` files necessary. Together with working EdgeDB database. Just follow instructions in the setup script.

All next actions assume `bun setup` was done correctly, you will receive `Setup completed` after `bun setup` completes succesfully.

All commands you can run are seen [here](#commands). Below goes over important ones.

> [!WARNING]
> If you get any problems with setup, reach out on [Discord](https://discord.com/invite/bxtD8x6aNF)

## Run GraphQL server (Grafbase)

```
bun grafbase
```

Then open `http://localhost:4000` either in browser or [Pathfinder](https://pathfinder.dev).

## Run website (Solid)

```
bun web
```

Then open `http://localhost:3000` in browser.

## Contribute

Always open to useful ideas or fixes in form of issues or PRs.

Current [issues](../../issues) are organised with [labels](../../labels). Issues currently in focus are labeled with [Current Month](../../labels/Current%20Month) label.

If issue is not already present ([do search](../../issues) first), open [new issue](../../issues/new/choose), [start discussion](../../discussions) or ask about it on [Discord](https://discord.com/invite/bxtD8x6aNF).

It's okay to submit draft PR as you can get help along the way to make it merge ready.

Any issues with setup or making your first feature or trying to fix a bug will be resolved asap. Same goes for discussing ideas on how to make the tool even better than it is now.

## Docs

All docs can be seen in [docs.learn-anything.xyz](https://github.com/learn-anything/docs).

It is advisable you read them, before you start developing anything as they provide a lot of context and general knowledge.

There is big focus on documentation and clarity in the project. All code should be clear and understandable and well documented.

Check [Dev Tips](https://github.com/learn-anything/docs/blob/main/docs/dev-tips.md) for some advice on development together with [tech stack explanation](https://docs.learn-anything.xyz/tech-stack).

## Design

All design is done in [Figma](https://www.figma.com/file/cJbTJZLDUpz8QPI5Q9Etiu/LA) and [FigJam](https://www.figma.com/file/GelB3DWCdjQ2tU4v3kbHOj/LA-Think).

If you're designer and want to help out or have ideas, mention it on [Discord](https://discord.com/invite/bxtD8x6aNF)'s [#design channel](https://discord.com/channels/428579844046192640/490987127891558400).

## Tasks / Explore

There is separate repo of [tasks](https://github.com/learn-anything/tasks) with goal to take the tasks used in LA and generalise it for use by community.

Together with [explore](https://github.com/learn-anything/explore) for prototyping of various kind.

## Commands

### bun setup

> bun cmd.ts setup

Fully sets up LA for development (website, desktop, mobile, api, ..).

### bun web

> cd website && bun dev

Run website.

### bun app

> cd app && bun tauri:dev

Run desktop app built with Tauri.

### bun cli

> cd api/edgedb && bun --watch ../../cli/cli.ts

Run CLI to quickly execute TS code (run queries and more..).

### bun db:ui

> cd grafbase/edgedb && edgedb ui

Open EdgeDB UI to run queries and more.

### bun grafbase

> bun cmd.ts grafbase

Run Grafbase in development mode.

### bun graphql

> bun cmd.ts graphql

Generate queries for GQL client.

### bun cmd

> bun --watch cmd.ts

Run command in [cmd.ts](cmd.ts)

### bun ios

> cd mobile && pnpm run ios

Run mobile app with Expo.

### 🖤

[![Discord](https://img.shields.io/badge/Discord-100000?style=flat&logo=discord&logoColor=white&labelColor=black&color=black)](https://discord.com/invite/bxtD8x6aNF) [![X](https://img.shields.io/badge/learnanything-100000?logo=X&color=black)](https://twitter.com/learnanything_)
