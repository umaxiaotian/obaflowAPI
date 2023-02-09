
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
router.use(session({ secret: 'keyboard cat', cookie: { maxAge: maxage * 60000 } }))

// セッション管理関数
const sessionCheck = (req, res, next) => {
  if (req.session.email) {
    next();
  } else {
    res.status(440).json({ message: 'セッション切れです' })
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
    if (email === reqEmail && hashed(password) === hashed(reqPass)) {
      req.session.email = { name: req.body.email };
      res.send(200)
    }
    else {
      res.status(401).json({ message: 'メールアドレス/パスワードが一致しません' })
    }
  }
  catch (error) {
    res.status(500).json({ message: 'error' })
  }
});

router.get('/', (req, res, next) => {
  sessionCheck(req, res, next)
  res.sendStatus(200)
})


module.exports = router;