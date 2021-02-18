const router = require('express').Router();
const { logger } = require('../utils/logger');
const db = require('../utils/connect');

router.post('/comment/add', async (req, res, next) => {
    try {
        const { Pid, content, username, replyCid } = req.body;
        console.log(req.body);
        const result = await db.query(`
     INSERT INTO
     comment
     VALUES(
        null,${Pid},${replyCid || 'null'},'${content}',now(),'${username}'
        
     )
    `);
        //重新从数据库 查询 对应 id 的评论 并返回给 浏览器
        const { insertId } = result;
        const post = await db.query(
            `
            SELECT * 
            FROM comment
            WHERE Cid=${insertId}
            `
        );
        res.send({
            data: post[0],
            ok: 1,
        });
        logger.info(result);
    } catch (err) {
        next(err);
    }
});

router.get('/comment/getByPid', async (req, res, next) => {
    try {
        //查询 并按照 时间排序
        const data = await db.query(`
        SELECT *
        FROM comment
        WHERE Pid=${req.query.Pid}
        ORDER BY commentTime DESC
        `);
        res.send({
            data,
            ok: 1,
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
