var express = require('express')
var bodyParser = require('body-parser')
var app = express() //reference Variabel
var http = require('http').Server(app)
var io = require('socket.io')(http)
var mongoose = require('mongoose')

app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

mongoose.Promise = Promise

var dbUrl = 'mongodb+srv://frisrsyd:admin123@mongo-db-starter.uscqec7.mongodb.net/?retryWrites=true&w=majority&appName=mongo-db-starter'

var Message = mongoose.model('Message', {
    nama: String,
    pesan: String
})

// var pesan = [
//     { nama: 'fulan', pesan: 'pesan dari fulan'},
//     { nama: 'ikhsan', pesan: 'pesan dari ikhsan'}
// ]
app.get('/pesan', function (req, res) {
    Message.find({}).then((pesan) => {
        res.send(pesan)
    }).catch((err) => {
        res.sendStatus(500)
        return console.error(err)
    })
})

app.post('/pesan', function (req, res) {
    var message = new Message(req.body)
    message.save().then(() => {
        Message.findOne({pesan: 'badword'}).then((sensor) => {
            if (sensor) {
                console.log('badword found', sensor)
                Message.deleteMany({_id: sensor.id}).then(() => {
                    console.log('badword removed')
                })
            }
        })
        io.emit('pesan', req.body)
        res.sendStatus(200)
    }).catch((err) => {
        res.sendStatus(500)
        return console.error(err)
    })
})

io.on('connection', function (socket) {
    console.log('a user connected')
})

mongoose.connect(dbUrl).then(() => {
    console.log('Connected to db')
}).catch((err) => { console.error(err) })

var server = http.listen(3000, function () {
    console.log("port server adalah", server.address().port)
})  