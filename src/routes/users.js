
var express = require('express');
var router = express.Router();
router.use(express.json());
var jwt = require('jsonwebtoken')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const session = require('express-session')
var crypto = require("crypto");

// Cross Originを有効化
router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    next();
  });


// Optionsも
router.options('*', (req, res) => {
    res.sendStatus(200);
  });
  
  // セッションの生存時間（分で指定）
  const maxage = 1;
  
  // セッション管理設定
  router.use(session({ secret: 'keyboard cat', cookie: { maxAge: maxage * 60000 }}))
  
  
  
  // セッション管理関数
  const sessionCheck = (req, res, next) => {
    if (req.session.email) {
      next();
    } else {
      res.status(440).json({message: 'セッション切れです'})
    }
  }
  
  
  const email = 'email@email.com'
  const password = 'hogehoge'
  
  // sha-512で暗号化
  const hashed = password => {
    let hash = crypto.createHmac('sha512', password)
    hash.update(password)
    const value = hash.digest('hex')
    return value;
  }
  
  // ログイン処理
  router.post('/login', (req, res, next) => {
    const reqEmail = req.body.email
    const reqPass = req.body.password
    try {
      if(email === reqEmail && hashed(password) === hashed(reqPass)) {
        req.session.email = {name: req.body.email};
        res.send(200)
      }
      else {
        res.status(401).json({message: 'メールアドレス/パスワードが一致しません'})
      }
    }
    catch (error){
      res.status(500).json({message: 'error'})
    }
  });
  
  router.get('/', (req, res, next) => {
    sessionCheck(req, res, next)
    res.sendStatus(200)
  })


module.exports = router;





// import express from 'express';
// import jwt from 'jsonwebtoken'
// import { Prisma, PrismaClient } from '@prisma/client'
// import users from ('./routes/users')
// const prisma = new PrismaClient()
// const app = express();
// router.use(express.json());
// router.use(express.urlencoded({ extended: true }));


// //認証無しAPI
// router.get('/', function (req, res) {
//     res.json({ status: "OK" });
// })

// //認証+Tokenの発行
// router.post('/login', async (req, res) => {

//     //ID,PW取得
//     var username = req.body.username;
//     var password = req.body.password;
//     var getDbUser = {};

//     //DBGETUSER
//     try {
//         getDbUser = await prisma.user.findFirstOrThrow({
//             where: { name: username }
//         });    
//     } catch (error) {
//         return res.status(401).json({
//             error: "auth error"
//         });
//     }

//     //認証
//     //実際はDB等と連携
//     if (username === getDbUser.name && password === getDbUser.password) {
//         //token生成（フォマットは適当だが、有効期限を設定）
//         const token = jwt.sign({ username: username }, 'my_secret', { expiresIn: '1h' });
//         return res.status(200).json({
//             Bearer: token
//         });
//     } else {
//         res.status(404).json({
//             error: "auth error"
//         });
//     }

// })

// //認証有りAPI
// router.get('/protected', verifyToken, function (req, res) {
//     res.send("Protected Contents");
// })

// function verifyToken(req, res, next) {
//     const authHeader = req.headers["authorization"];
//     //HeaderにAuthorizationが定義されているか
//     if (authHeader !== undefined) {
//         //Bearerが正しく定義されているか
//         if (authHeader.split(" ")[0] === "Bearer") {
//             try {
//                 const token = jwt.verify(authHeader.split(" ")[1], 'my_secret');
//                 //tokenの内容に問題はないか？
//                 //ここでは、usernameのマッチと有効期限をチェックしているが必要に応じて発行元、その他の確認を追加
//                 //有効期限はverify()がやってくれるみたいだがいちおう・・・
//                 if (token.username === "hoge" && Date.now() < token.exp * 1000) {
//                     console.log(token);
//                     //問題がないので次へ
//                     next();
//                 } else {
//                     res.json({ error: "auth error" })
//                 }
//             } catch (e) {
//                 //tokenエラー
//                 console.log(e.message);
//                 res.json({ error: e.message })
//             }
//         } else {
//             res.json({ error: "header format error" });
//         }
//     } else {
//         res.json({ error: "header error" });
//     }
// }
