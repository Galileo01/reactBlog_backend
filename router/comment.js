const router = require('express').Router();
const { logger } = require('../utils/logger');
const db = require('../utils/connect');

router.post('/comment/add', async (req, res, next) => {
    try {
        const { Pid, content, username } = req.body;
        console.log(req.body);
        const result = await db.query(`
     INSERT INTO
     comment
     VALUES(
         null,${Pid},'${content}',now(),'${username || '匿名用户'}'
     )
    `);
        res.send({
            data: result,
            ok: 1,
        });
        logger.info(result);
    } catch (err) {
        next(err);
    }
});

router.get('/comment/getByPid', async (req, res, next) => {
    try {
        const data = await db.query(`
        SELECT *
        FROM comment
        WHERE Pid=${req.query.Pid}
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
