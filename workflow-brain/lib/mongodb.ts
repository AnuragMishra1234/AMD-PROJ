import mongoose from "mongoose";

// Marked as possibly-undefined so TypeScript is honest about first-run state
declare global {
  // eslint-disable-next-line no-var
  var _mongooseCache:
    | { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null }
    | undefined;
}

export async function connectDB(): Promise<typeof mongoose> {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    throw new Error(
      "MONGODB_URI is not defined. Add it to .env.local and restart the server."
    );
  }

  // Initialise the singleton cache on first call
  if (!global._mongooseCache) {
    global._mongooseCache = { conn: null, promise: null };
  }
  const cached = global._mongooseCache;

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, { bufferCommands: false })
      .then((m) => {
        console.log("[MongoDB] Connected");
        return m;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
