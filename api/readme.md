## Files

- [edgedb](edgedb) - [EdgeDB](https://www.edgedb.com) used as main server database
  - [dbschema](edgedb/dbschema)
    - [default.esdl](edgedb/dbschema/default.esdl) - [EdgeDB schema](https://www.edgedb.com/docs/intro/schema) defining all models and relations
    - [migrations](edgedb/dbschema/migrations) - migration files get generated after running `bun db:migrate`
  - [crud](edgedb/crud) - CRUD functions on models (imported either from grafbase resolvers or from [cli](edgedb/cli))
- [grafbase](grafbase)
  - [resolvers](grafbase/resolvers) - are [server functions](https://grafbase.com/docs/edge-gateway/resolvers) Grafbase uses to make its GraphQL endpoint
  - [grafbase.config.ts](grafbase/grafbase.config.ts) - [Grafbase's config](https://grafbase.com/docs/config). You create file in resolvers folder, then extend grafbase.config.ts. Can use [Pathfinder](https://pathfinder.dev) to test query. Then call it from anywhere using some GraphQL client.
