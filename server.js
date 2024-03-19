var express = require('express')
var bodyParser = require('body-parser')
var app = express() //reference Variabel
var http = require('http').Server(app)
var io = require('socket.io')(http)

app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

var server = http.listen(3000, function () {
    console.log("port server adalah", server.address().port)
})   


var pesan = [
    { nama: 'fulan', pesan: 'pesan dari fulan'},
    { nama: 'ikhsan', pesan: 'pesan dari ikhsan'}
]
app.get('/pesan', function (req, res) {
    res.send(pesan)
})

app.post('/pesan', function (req, res) {
    pesan.push(req.body)
    io.emit('pesan', req.body)
    res.sendStatus(200)
})

io.on('connection', function (socket) {
    console.log('a user connected')
})