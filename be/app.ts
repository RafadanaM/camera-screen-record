import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import errorMiddleware from './src/common/middlewares/error.middleware';
import NotFoundMiddleware from './src/common/middlewares/notfound.middleware';
import httpLogger from './src/common/logger/httpLogger';
import logger from './src/common/logger/logger';
import BaseController from './src/common/controllers/base.controller';
class App {
  public app: express.Application;

  public port: number;

  constructor(controllers: BaseController[], port: number) {
    this.app = express();
    this.initAppConfig();
    this.port = port;
    this.initMiddlewares();
    this.initControllers(controllers);
    this.initErrorHandling();
    this.initRouteNotFound();
    this.initUnhandledRejection();
    this.initUncaughtException();
  }

  private initAppConfig() {
    /* 
    Uncomment below if running under proxy like nginx, apache, etc
    so that req.ip returns the client's IP instead of the proxy's IP.
    (you can also use req.headers["x-forwarded-for"] but)
    */
    // this.app.set("trust proxy", "127.0.0.1")
    this.app.disable('x-powered-by');
  }

  private initMiddlewares() {
    this.app.use(helmet());
    this.app.use(cors({ origin: process.env.ORIGIN }));
    this.app.use(express.json({ limit: '100mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '100mb' }));
    this.app.use(express.raw({ type: 'application/octet-stream', limit: '100mb' }));
    this.app.use(httpLogger);
  }

  private initControllers(controllers: BaseController[]) {
    controllers.forEach((controller) => {
      this.app.use(`/api${controller.path}`, controller.router);
    });
  }

  private initErrorHandling() {
    this.app.use(errorMiddleware);
  }

  private initRouteNotFound() {
    this.app.use(NotFoundMiddleware);
  }

  private initUnhandledRejection() {
    process.on('unhandledRejection', (error: Error) => {
      throw error;
    });
  }

  private initUncaughtException() {
    process.on('uncaughtException', (error: Error) => {
      logger.error(error);
      process.exit(1);
    });
  }

  public listen() {
    this.app.listen(this.port, () => {
      logger.info(`🚀 Server ready at port: ${this.port}`);
    });
  }
}

export default App;
