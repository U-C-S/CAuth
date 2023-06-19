# CAuth

## Technologies Used

- Rust + Tokio

  - Axum
  - SQLx

- NodeJs

  - pnpm (package manager)
  - TypeScript
  - React + Mantine UI + Nextjs
  - Fastify + Prisma

- PostgreSQL (3 databases)

## Proxy Protocol

Typical HTTP is of the form:

```
HTTP (URL)
- headers (content-type: application/json)
- body
- method
```

But CAuth uses a proxy protocol to communicate with the services. The proxy protocol is of the form:

```
HTTP (http://localhost:3721/query)
- headers
  - service-name: Info API
  - service-endpoint: /auth/login
  - service-headers: {}
  - Authorization (bearer token)
- body
- method
```
