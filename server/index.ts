import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import fs from 'fs/promises';
import path from 'path';
import { HTTPException } from 'hono/http-exception';
import { neighbourhood } from './mdns.ts';
import { firstStart } from './first-start.ts';

firstStart();

const rootDir = path.resolve(import.meta.dirname, '..');
const frontendDir = path.join(rootDir, 'frontend');
const menuDir = path.join(rootDir, 'data', 'menu');

const app = new Hono();

app.use(logger());
app.route('/', neighbourhood);

app.use('/*', serveStatic({ root: frontendDir }));
app.get('/menu/:name', async (c) => {
  const name = c.req.param('name');

  if (name.match(/^[a-zA-Z0-9_-]+\.json$/) === null) {
    throw new HTTPException(401, { message: 'Invalid menu name' });
  }
  const menuPath = path.join(menuDir, name);
  try {
    await fs.access(menuPath, fs.constants.F_OK);
  } catch {
    throw new HTTPException(404, { message: 'Menu not found' });
  }

  const json = JSON.parse(
    await fs.readFile(menuPath, 'utf-8')
  );
  return c.json(json)

});

const port = Number(process.env['PORT'] ?? 3111);

console.log(`Server listening on http://localhost:${port}\n`);

serve({
  fetch: app.fetch,
  port,
});
