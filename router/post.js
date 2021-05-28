const router = require('express').Router();
const db = require('../utils/connect');
const { translate } = require('../utils/utils');
//添加 帖子
router.post('/post/add', async (req, res, next) => {
    try {
        const { title, type, keywords, content, desc } = req.body;
        //执行sql 之前 转义特殊字符
        const str = translate(content);
        // console.log(content);
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
            title='${title}',
            content='${content}',
            type=${type},
            keywords='${keywords}',
            post.desc='${desc}'
            updateTime=now()
        WHERE Pid=${Pid}
        `);
        res.send({
            data: result,
            ok: 1,
        });
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
        //获取并按照 更新时间 排序
        const data = await db.query(
            'SELECT Pid,title,type,keywords,`desc`,readCount,updateTime FROM post ORDER BY updateTime DESC'
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
    ORDER BY updateTime DESC
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
            data: {
                ...data[0],
                content: translate(data[0].content, 2), //返回之前 转义回去
            },
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
            data: {
                ...data[0],
                content: translate(data[0].content, 2), //返回之前 转义回去
            },
            ok: 1,
        });
    } catch (err) {
        next(err);
    }
});

//新增 帖子的 阅读次数
router.post('/post/increCount', async (req, res, next) => {
    const { Pid } = req.body;
    const data = await db.query(`
    UPDATE post
    SET
        readCount=readCount+1
    WHERE Pid=${Pid}
    `);
    const { affectedRows } = data;
    res.send({
        data: affectedRows === 1 ? Pid : 'no such Pid',
        ok: affectedRows,
    });
});

module.exports = router;
