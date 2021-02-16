const express = require('express');
const { log4js, logger } = require('./utils/logger');
const router = require('./router');

const app = express();
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