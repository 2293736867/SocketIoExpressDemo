var app = require('express')()
var http = require('http').createServer(app)
var io = require('socket.io')(http)
const router = require('./router')
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({extended: false}))

http.listen(3000)

app.all('*', ((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header('Access-Control-Allow-Methods', '*')
    res.header("Access-Control-Allow-Headers", "*");
    next()
}))

app.use(router)

io.on('connection',socket=>{
    socket.on('private',data=>{
        io.emit('private'+data.target,data.msg)
    })

    socket.on('public',data=>{
        io.emit('public',data)
    })
})