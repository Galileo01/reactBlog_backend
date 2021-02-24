const express = require('express');
const { log4js, logger } = require('./utils/logger');
const router = require('./router');
const { Origins } = require('./config/express');
const app = express();
//设置跨域访问
app.all('*', function (req, res, next) {
    const referer = req.headers.referer;
    console.log(referer, Origins[referer]);

    if (Origins[referer]) {
        logger.info(`legal referer(合法 origin):${referer} fetch`);
        res.header('Access-Control-Allow-Origin', Origins[referer]);
    } else {
        logger.error(`illegal referer(非法) origin):${referer} fetch`);
    }
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Methods', '*');
    // res.header('Content-Type', 'application/json;charset=utf-8');
    next();
});
//解析post 请求参数
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//添加log4j 到express 在路由之前
app.use(
    log4js.connectLogger(logger, {
        level: 'auto',
        format: ':method :url  :status  :response-time ms',
    })
);
app.use(router);

//错误处理 中间件
app.use((err, req, res, next) => {
    logger.error(err);
    res.status(500).send({
        data: err,
        ok: 0,
    });
});

app.listen(5000, () => console.log('server is running at 5000'));
