
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

//認証+Tokenの発行
router.post('/login', async (req, res) => {

    //ID,PW取得
    var username = req.body.username;
    var password = req.body.password;
    var getDbUser = {};

    //DBGETUSER
    try {
        getDbUser = await prisma.user.findFirstOrThrow({
            where: { name: username }
        });    
    } catch (error) {
        return res.status(401).json({
            error: "auth error"
        });
    }

    //認証
    //実際はDB等と連携
    if (username === getDbUser.name && password === getDbUser.password) {
        //token生成（フォマットは適当だが、有効期限を設定）
        const token = jwt.sign({ username: username }, 'my_secret', { expiresIn: '1h' });
        return res.status(200).json({
            Bearer: token
        });
    } else {
        res.status(404).json({
            error: "auth error"
        });
    }

})

//認証有りAPI
router.get('/protected', verifyToken, function (req, res) {
    res.send("Protected Contents");
})

function verifyToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    //HeaderにAuthorizationが定義されているか
    if (authHeader !== undefined) {
        //Bearerが正しく定義されているか
        if (authHeader.split(" ")[0] === "Bearer") {
            try {
                const token = jwt.verify(authHeader.split(" ")[1], 'my_secret');
                //tokenの内容に問題はないか？
                //ここでは、usernameのマッチと有効期限をチェックしているが必要に応じて発行元、その他の確認を追加
                //有効期限はverify()がやってくれるみたいだがいちおう・・・
                if (token.username === "hoge" && Date.now() < token.exp * 1000) {
                    console.log(token);
                    //問題がないので次へ
                    next();
                } else {
                    res.json({ error: "auth error" })
                }
            } catch (e) {
                //tokenエラー
                console.log(e.message);
                res.json({ error: e.message })
            }
        } else {
            res.json({ error: "header format error" });
        }
    } else {
        res.json({ error: "header error" });
    }
}




module.exports = router;

