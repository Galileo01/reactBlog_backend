const router = require('express').Router();
const db = require('../utils/connect');
//添加 帖子
router.post('/post/add', async (req, res, next) => {
    try {
        const { title, type, keywords, content, desc } = req.body;
        let str = content.replace('`', '`');
        str = str.replace("'", "'");
        str = str.replace('\r', '');
        str = str.replace('?', '?');
        str = str.replace(':', ':');
        str = str.replace('\r', 'CHAR(10)');
        str = str.replace('\n', 'CHAR(13)');
        console.log(content);
        const result = await db.query(`
         INSERT INTO post
         VALUES (
             null,'${title}',${type},'${keywords}','${desc}',now(),'${str}' 
         )
         `);
        //DEBUG: 插入带有换行符的 字符串报错 特殊字符
        // console.log(result);
        res.send({
            data: result.insertId,
            ok: 1,
        });
    } catch (err) {
        next(err);
    }
});

router.post('/post/deleteByPid', async (req, res, next) => {
    try {
        const result = await db.query(`
    DELETE FROM post
    where Pid=${req.body.Pid}
    `);
        res.send({
            ok: 1,
        });
    } catch (err) {
        next(err);
    }
});

//更新帖子
router.post('/post/update', async (req, res, next) => {
    try {
        const { title, type, keywords, content, desc, Pid } = req.body;
        const result = await db.query(`
        UPDATE post
        SET 
        content='${content}',
        type=${type},
        keywords='${keywords}',
        des='${desc}'
        WHERE Pid=${Pid}
        `);
    } catch (err) {
        next(err);
    }
});
//根据条件 查询
router.get('/post/query', async (req, res, next) => {
    try {
        const { type, keyword, limit, offset } = req.query;

        const where = [];
        keyword &&
            where.push(
                `title LIKE "%${keyword}%" OR keywords LIKE "%${keyword}%"`
            );
        type !== 'all' && where.push(`type=${type}`);
        console.log(where);
        //拼接WhERE子句 and 分割
        const result = await db.query(`
        SELECT *
        FROM post
        ${where.length > 0 ? 'where ' + where.join(' and ') : ''} 
        `);
        const total = result.length;
        const startIndex = offset * limit;
        const endIndex = parseInt(startIndex) + parseInt(limit); //字符 转为 数字 再做加法
        const postList = result.slice(startIndex, endIndex); //偏移和 个数,
        res.send({
            data: {
                postList,
                total,
            },
            ok: 1,
        });
    } catch (err) {
        next(err);
    }
});

router.get('/post/getAll', async (req, res, next) => {
    try {
        const data = await db.query(
            'SELECT Pid,title,type,keywords,`desc`,updateTime FROM post'
        );
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
