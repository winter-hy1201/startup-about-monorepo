/**
 * 根据http methods判断 是否需要取消请求
 */
const REQUEST_CANCEL_MAP = [
  {
    key: 'get',
    value: true,
  },
  {
    key: 'post',
    value: false,
  },
  {
    key: 'put',
    value: false,
  },
  {
    key: 'delete',
    value: false,
  },
  {
    key: 'head',
    value: false,
  },
  {
    key: 'options',
    value: false,
  },
  {
    key: 'patch',
    value: false,
  },
  {
    key: 'trace',
    value: false,
  },
  {
    key: 'connect',
    value: false,
  }
]
export {
  REQUEST_CANCEL_MAP
};
