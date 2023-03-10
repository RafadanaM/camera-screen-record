import 'dotenv/config';
import App from '../../app';
import validateEnv from '../../src/common/utils/validateEnv';
import VideosController from '../../src/videos/controllers/videos.controller';

validateEnv();

const app = new App([new VideosController()], parseInt(process.env.PORT || '5000'));
app.listen();
