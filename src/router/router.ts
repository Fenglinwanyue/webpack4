// tslint:disable:max-line-length 忽略此文件中每行字数限制问题
/**
 * meta 可配置参数
 * @param {boolean} icon 页面icon
 * @param {boolean} keepAlive 是否缓存页面
 * @param {string} title 页面标题
 */
export default [
    {
        path: '/',
        redirect: '/helloword'
    },
    {
        path: '/msg',
        name: '/msg',
        component: () => import('@/types/views/msg.vue')
    },
    {
        path: '/helloword',
        name: 'helloword',
        // vue的异步组件
        // component:resolve =>  require(['../components/PromiseDemo'], resolve)
        // es异步组件技术
        // 下面2行代码，没有指定webpackChunkName，每个组件打包成一个js文件。
        // const ImportFuncDemo1 = () => import('../components/ImportFuncDemo1')
        // const ImportFuncDemo2 = () => import('../components/ImportFuncDemo2')
        // 下面2行代码，指定了相同的webpackChunkName，会合并打包成一个js文件。
        // const ImportFuncDemo = () => import(/* webpackChunkName: 'ImportFuncDemo' */ '../components/ImportFuncDemo')
        // const ImportFuncDemo2 = () => import(/* webpackChunkName: 'ImportFuncDemo' */ '../components/ImportFuncDemo2')
        component: () => import('@/types/views/helloword.vue'),
        meta: {
            icon: '',
            keepAlive: true,
            title: 'helloword'
        }
    }
];
