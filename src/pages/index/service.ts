import Request from '../../utils/request';


export const demo = data => Request({
  url: '/www',
  method: 'POST',
  data,
});
