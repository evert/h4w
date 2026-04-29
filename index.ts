import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import fs from 'fs/promises';
import { HTTPException } from 'hono/http-exception';

const app = new Hono();

app.use(logger());

app.use('/*', serveStatic({ root: './frontend' }));
app.get('/menu/:name', async (c) => {
  const name = c.req.param('name');

  if (name.match(/^[a-zA-Z0-9_-]+\.json$/) === null) {
    throw new HTTPException(401, { message: 'Invalid menu name' });
  }
  try {
    await fs.access('data/menu/' + name, fs.constants.F_OK);
  } catch {
    throw new HTTPException(404, { message: 'Menu not found' });
  }

  const json = JSON.parse(
    await fs.readFile('data/menu/' + name, 'utf-8')
  );
  return c.json(json)

});

const port = Number(process.env.PORT ?? 3111);

console.log(`Server listening on http://localhost:${port}\n`);

serve({
  fetch: app.fetch,
  port,
});
