import { DatabaseService } from '@services/database.service';

process.env['NODE_CONFIG_DIR'] = __dirname + '/configs';

import 'dotenv/config';
import 'reflect-metadata';
import App from '@/app';
import AuthRoute from '@routes/auth.route';
import IndexRoute from '@routes/index.route';
import UsersRoute from '@routes/users.route';
import validateEnv from '@utils/validateEnv';
import TagsRoute from '@routes/tags.route';

validateEnv();

async function startApp() {
  await DatabaseService.init();
  const app = new App([new IndexRoute(), new UsersRoute(), new AuthRoute(), new TagsRoute()]);
  app.listen();
  process.on('SIGINT', function () {
    process.exit();
  });
}

startApp();
