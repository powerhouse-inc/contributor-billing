#!/bin/sh
set -e

# Install prisma CLI and regenerate client for current platform
echo "[entrypoint] Installing Prisma CLI..."
pnpm add -g prisma@5.17.0

echo "[entrypoint] Patching Prisma schema to include linux-musl-openssl-3.0.x target..."
sed -i 's/binaryTargets = \["native", "linux-musl", "debian-openssl-3.0.x"\]/binaryTargets = ["native", "linux-musl", "debian-openssl-3.0.x", "linux-musl-openssl-3.0.x"]/' \
    node_modules/document-drive/dist/prisma/schema.prisma

echo "[entrypoint] Regenerating Prisma client for current platform..."
prisma generate --schema node_modules/document-drive/dist/prisma/schema.prisma

# Run migrations if DATABASE_URL is postgres and migrations not skipped
if [ -n "$DATABASE_URL" ] && echo "$DATABASE_URL" | grep -q "^postgres" && [ "$SKIP_DB_MIGRATIONS" != "true" ]; then
    echo "[entrypoint] Running Prisma db push..."
    prisma db push --schema node_modules/document-drive/dist/prisma/schema.prisma --skip-generate
    echo "[entrypoint] Running migrations..."
    pnpm ph-cli switchboard --migrate
fi

echo "[entrypoint] Starting switchboard on port ${PORT:-3000}..."
exec pnpm ph-cli switchboard --port ${PORT:-3000}
