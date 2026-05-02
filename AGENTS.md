# AGENTS.md — crud-express

## Commands

```bash
pnpm run dev    # nodemon with --trace-warnings
pnpm run start  # production
```

No test/lint/typecheck scripts defined yet. Use `pnpm` (packageManager field).

## Architecture

Layered MVC: **Routes → Middleware → Controller → Service → Model → MongoDB**

- **Routes** (`src/routes/`) — Express Router, attach middleware chains
- **Middlewares** (`src/middlewares/`) — `asyncHandler` (wraps controllers), `auth` (JWT), `validate` (Zod), `requestId`
- **Controllers** (`src/controllers/`) — HTTP request/response only. Always wrapped in `asyncHandler`, errors passed to `next(err)`
- **Services** (`src/services/`) — Business logic. Pure functions, throw on failure
- **Models** (`src/models/`) — Database queries only. MongoDB native driver
- **Utils** (`src/utils/`) — logger, jwt, password, validation schemas

## Conventions

- **ES Modules** with subpath imports: `#utils/*`, `#routes/*`, `#models/*`, `#services/*`, `#controllers/*`, `#middlewares/*`, `#config/*`
- **API version**: all routes under `/api/v1/`
- **Auth routes** (`/api/v1/auth/`) are public (register, login, whoami). Everything else requires `Authorization: Bearer <jwt>`
- **Pagination**: `?page=1&limit=10` query params on all list endpoints. Response includes `meta: { total, page, limit, totalPages }`
- **Validation**: Zod schemas in `src/utils/validation.schema.js`, applied via `validate(schema)` middleware on POST/PATCH routes
- **Never use `console.log`/`console.error`** — use `import logger from "#utils/logger.js"`

## Logger (`src/utils/logger.js`)

- **`exitOnError: false`** — logger never kills the process
- **Console**: raw ANSI color codes (no `colorize()` transport — it conflicts)
- **Files** (`logs/`): daily rotation via `winston-daily-rotate-file`, zipped, retained per `LOG_RETENTION_DAYS` (default 30)
- **`combined-DATE.log`**: all ≥ info, clean text (grep-safe)
- **`error-DATE.log`**: errors only
- **`structured-DATE.log`**: JSON lines for log aggregators
- **Redaction**: passwords, tokens, secrets, keys, auth headers → `[REDACTED]` in all outputs
- **Never `console.*`** in app code — logger has its own fallback for retention errors

## Error handling

- Controllers wrapped in `asyncHandler` — catches errors, passes to `next(err)`
- Global error handler in `app.js` logs full stack + request context, returns sanitized message in production
- Server recovers from uncaught exceptions and unhandled rejections without exiting
- Port-in-use: retries after 5s

## Environment

`.env` keys: `PORT`, `MONGODB_URI`, `DB_NAME`, `JWT_SECRET`, `NODE_ENV`, `LOG_RETENTION_DAYS`, `LOG_MAX_SIZE`, `SERVICE_NAME`

JWT tokens expire in 24h (HS256). Payload: `{ userId, username }`.

## Testing

REST files in `tests/` — use VS Code REST Client extension. Always register + login first to get a token, then replace `YOUR_JWT_TOKEN_HERE`.
