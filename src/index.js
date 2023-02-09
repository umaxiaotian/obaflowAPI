var express = require('express');
const app = express();
app.use(express.json());
var user = require('./routes/users');

//認証無しAPI
app.post('/', function (req, res) {
    console.log(req.body)
    return res.json({ status: "OK" });
})

//userに来たものは、すべてroutesのusersへ。。。
app.use("/user", user)

const server = app.listen(3000, () =>
    console.log(`🚀 Server ready at: http://localhost:3000\n⭐️ UMAXIAOTIAN`),
)