const router = require('express').Router();
const db = require('../utils/connect');
router.post('/post/add', async (req, res, next) => {
    try {
        //  const {title,type,key}
        res.send('hahha');
    } catch (err) {
        next(err);
    }
});

router.get('/post/getAll', async (req, res, next) => {
    try {
        const data = await db.query('SELECT Pid,title,type,keywords,`desc`,updateTime FROM post');
        res.send({
            data,
            ok: 1,
        });
    } catch (err) {
        next(err);
    }
});

router.get('/post/getByType', async (req, res, next) => {
    try {
        const { type } = req.query;
        const data = await db.query(`
    SELECT * 
    FROM post
    WHERE type=${type}
    `);
        res.send({
            data,
            ok: 1,
        });
    } catch (err) {
        next(err);
    }
});

router.get('/post/getByPid', async (req, res, next) => {
    try {
        const { Pid } = req.query;
        const data = await db.query(`
        SELECT *
        FROM post 
        WHERE Pid=${Pid}
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
