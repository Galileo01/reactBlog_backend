const router = require('express').Router();
const db = require('../utils/connect');
router.get('/test', async (req, res, next) => {
    try {
        const sql = `
    select * 
    from post`;
        const data = await db.query(sql);
        res.send({
            data: data,
        });
    } catch (err) {
        next(err);
    }
});

//验证用户名 密码 
router.post('/user/login', async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const data = await db.query(
            `
            SELECT password,Uid
            FROM user
            WHERE name="${username}"
            `
        );
        console.log(data);
        const response = {
            data: '',
            ok: 1,
        };
        if (data.length === 0) {
            response.data = '用户不存在';
            response.ok = 0;
        } else if (data[0].password !== password) {
            response.data = '用户名或密码错误';
            response.ok = 0;
        } else {
            response.data = data[0].Uid;
        }
        console.log(response);
        res.send(response);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
