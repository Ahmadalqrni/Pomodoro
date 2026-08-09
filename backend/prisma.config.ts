import "dotenv/config";

// Prisma v7+ expects runtime configuration such as database URLs to be
// provided via a `prisma.config.ts` file when `url` is no longer allowed in
// schema.prisma. This file should export a config object that the Prisma CLI
// and runtime can consume.

export default {
  datasources: {
    db: {
      provider: "sqlite",
      url: process.env.DATABASE_URL || "file:./dev.db",
    },
  },
};
