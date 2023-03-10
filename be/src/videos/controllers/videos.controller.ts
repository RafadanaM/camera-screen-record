import { NextFunction, Router } from 'express';
import BaseController from '../../common/controllers/base.controller';
import VideoService from '../services/videos.service';
import { BaseResponse } from '../../common/responses/base.response';
import createVideoRequest from '../requests/createVideo.request';

class VideosController implements BaseController {
  public path: string;
  public router: Router;

  private videosService: VideoService;

  constructor() {
    this.path = '/videos';
    this.router = Router();
    this.videosService = new VideoService();
    this.initRoutes();
  }

  private initRoutes() {
    this.router.post('/:id', this.createVideoHandler.bind(this));
  }

  async createVideoHandler(req: createVideoRequest, res: BaseResponse, next: NextFunction) {
    try {
      this.videosService.createVideo(req.params.id, req.body.data, req.body.chunkNumber);
      return res.status(201).send({ message: 'video created', statusCode: 201 });
    } catch (error) {
      return next(error);
    }
  }
}

export default VideosController;
