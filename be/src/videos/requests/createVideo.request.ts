import BaseRequest from '../../common/requests/base.request';

interface createVideoRequest extends BaseRequest<{ id: string }, unknown, { data: string; chunkNumber: number }> {}

export default createVideoRequest;
