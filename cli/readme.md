# CLI

Purpose of [cli.ts](cli.ts) is to quickly iterate on LA contents like calling into EdgeDB (calling [edgedb-js](https://github.com/edgedb/edgedb-js) query builder functions from [crud](../api/edgedb/crud) folder and run them on local/production database).

## Setup

There should be `.env` file in this folder setup as part of `bun setup` with this content:

```
name=your-name
email=your-email@gmail.com
```

## Run

```
bun db
```
