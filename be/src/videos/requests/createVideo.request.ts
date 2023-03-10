import BaseRequest from '../../common/requests/base.request';

interface createVideoRequest extends BaseRequest<{ id: string }, unknown, { data: string; count: number }> {}

export default createVideoRequest;
