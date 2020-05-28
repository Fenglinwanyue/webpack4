const Mock = require('mockjs');
import { data } from './test';
Mock.mock(
    /abc\/def\/ghi\/jk/, //请求的url，需要\来转义
    {
        code: '0',
        msg: 'ok',
        data: data
    }
);
