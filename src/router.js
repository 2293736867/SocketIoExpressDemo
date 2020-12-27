const express = require('express')
const mysql = require('./mysql')
const jwt = require('jwt-simple')
const router = express.Router()
const secret = 'ccc'

router.get('/',((req, res) => {
    res.sendFile(__dirname+'/html/index.html')
}))

router.get('/login',((req, res) => {
    res.sendFile(__dirname+'/html/login.html')
}))

router.get('/private/:target',((req, res) => {
    res.sendFile(__dirname+'/html/private.html')
}))

router.get('/public',((req, res) => {
    res.sendFile(__dirname+'/html/public.html')
}))

router.post('/signInUp', (req, res) => {
    let obj = req.body
    mysql.query('select * from user where username = ?', [obj.username], (err, result) => {
        if (err) throw err
        if (result.length === 0) {
            mysql.query('insert into user values(?,?)', [obj.username, obj.password], (err, result) => {
                if (err){
                    res.json({
                        code:900
                    })
                    console.log(err)
                }
                token = jwt.encode(obj.username, secret)
                res.json({
                    code: 100,
                    token: token
                })
            })
        } else {
            mysql.query('select * from user where username = ? and password = ?', [obj.username, obj.password], (err, result) => {
                if (err){
                    res.json({
                        code:900
                    })
                    console.log(err)
                }
                if (result.length === 0)
                {
                    res.json({
                        code: 101
                    })
                }
                else {
                    token = jwt.encode(obj.username, secret)
                    res.json({
                        code: 102,
                        token: token
                    })
                }
            })
        }
    })
})

router.get('/get/users', ((req, res) => {
    mysql.query('select username from user', [], (err, result) => {
        if (err) {
            res.json({
                code:900
            })
            console.log(err)
        }
        var origin = jwt.decode(req.headers.token,secret)
        result = JSON.parse(JSON.stringify(result))
        var data = []
        for (var i = 0; i < result.length; ++i)
        {
            if (result[i]['username'] !== origin)
                data.push(result[i]['username'])
        }
        res.json({
            data
        })
    })
}))

module.exports = router