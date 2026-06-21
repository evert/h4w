import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import path from 'path';
import { firstStart } from './first-start.ts';

firstStart();

const rootDir = path.resolve(import.meta.dirname, '..');
const frontendDir = path.join(rootDir, 'frontend');
const dataDir = path.join(rootDir, 'data');

const app = new Hono();

app.use(logger());

app.use('/*', serveStatic({ root: frontendDir }));
app.use('/*', serveStatic({ root: dataDir }));

const port = Number(process.env['PORT'] ?? 3111);

console.log(`Server listening on http://localhost:${port}\n`);

serve({
  fetch: app.fetch,
  port,
});
