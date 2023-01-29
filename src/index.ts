
import { Prisma, PrismaClient } from '@prisma/client';
import express from 'express';
const prisma = new PrismaClient();
const app = express();
var jwt = require('jsonwebtoken');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//認証無しAPI
app.get('/', function (req:any, res:any) {
    res.json({ status: "OK" });
})

//認証+Tokenの発行
app.post('/login', function (req:any, res:any) {

    //ID,PW取得
    var username = req.body.username;
    var password = req.body.password;

    console.log(username)

    //認証
    //実際はDB等と連携
    if (username === "hoge" && password === "password") {
        //token生成（フォマットは適当だが、有効期限を設定）
        const token = jwt.sign({ username: username }, 'my_secret', { expiresIn: '1h' });
        res.json({
            token: token
        });
    } else {
        res.json({
            error: "auth error"
        });
    }

})

//認証有りAPI
app.get('/protected', verifyToken, function (req:any, res:any) {
    res.send("Protected Contents");
})

function verifyToken(req:any, res:any, next:any) {
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
            } catch (e:any) {
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


const server = app.listen(3000, () =>
  console.log(`
🚀 Server ready at: http://localhost:3000
⭐️ UMAXIAOTIAN`),
)


















// import { Prisma, PrismaClient } from '@prisma/client'
// import express from 'express'

// const prisma = new PrismaClient()
// const app = express()

// app.use(express.json())

// app.post(`/signup`, async (req, res) => {
//   const { name, email, posts } = req.body

//   const postData = posts?.map((post: Prisma.PostCreateInput) => {
//     return { title: post?.title, content: post?.content }
//   })

//   const result = await prisma.user.create({
//     data: {
//       name,
//       email,
//       posts: {
//         create: postData,
//       },
//     },
//   })
//   res.json(result)
// })

// app.post(`/post`, async (req, res) => {
//   const { title, content, authorEmail } = req.body
//   const result = await prisma.post.create({
//     data: {
//       title,
//       content,
//       author: { connect: { email: authorEmail } },
//     },
//   })
//   res.json(result)
// })

// app.put('/post/:id/views', async (req, res) => {
//   const { id } = req.params

//   try {
//     const post = await prisma.post.update({
//       where: { id: Number(id) },
//       data: {
//         viewCount: {
//           increment: 1,
//         },
//       },
//     })

//     res.json(post)
//   } catch (error) {
//     res.json({ error: `Post with ID ${id} does not exist in the database` })
//   }
// })

// app.put('/publish/:id', async (req, res) => {
//   const { id } = req.params

//   try {
//     const postData = await prisma.post.findUnique({
//       where: { id: Number(id) },
//       select: {
//         published: true,
//       },
//     })

//     const updatedPost = await prisma.post.update({
//       where: { id: Number(id) || undefined },
//       data: { published: !postData?.published },
//     })
//     res.json(updatedPost)
//   } catch (error) {
//     res.json({ error: `Post with ID ${id} does not exist in the database` })
//   }
// })

// app.delete(`/post/:id`, async (req, res) => {
//   const { id } = req.params
//   const post = await prisma.post.delete({
//     where: {
//       id: Number(id),
//     },
//   })
//   res.json(post)
// })

// app.get('/users', async (req, res) => {
//   const users = await prisma.user.findMany()
//   res.json(users)
// })

// app.get('/user/:id/drafts', async (req, res) => {
//   const { id } = req.params

//   const drafts = await prisma.user
//     .findUnique({
//       where: {
//         id: Number(id),
//       },
//     })
//     .posts({
//       where: { published: false },
//     })

//   res.json(drafts)
// })

// app.get(`/post/:id`, async (req, res) => {
//   const { id }: { id?: string } = req.params

//   const post = await prisma.post.findUnique({
//     where: { id: Number(id) },
//   })
//   res.json(post)
// })

// app.get('/feed', async (req, res) => {
//   const { searchString, skip, take, orderBy } = req.query

//   const or: Prisma.PostWhereInput = searchString
//     ? {
//         OR: [
//           { title: { contains: searchString as string } },
//           { content: { contains: searchString as string } },
//         ],
//       }
//     : {}

//   const posts = await prisma.post.findMany({
//     where: {
//       published: true,
//       ...or,
//     },
//     include: { author: true },
//     take: Number(take) || undefined,
//     skip: Number(skip) || undefined,
//     orderBy: {
//       updatedAt: orderBy as Prisma.SortOrder,
//     },
//   })

//   res.json(posts)
// })

// const server = app.listen(3000, () =>
//   console.log(`
// 🚀 Server ready at: http://localhost:3000
// ⭐️ See sample requests: http://pris.ly/e/ts/rest-express#3-using-the-rest-api`),
// )
