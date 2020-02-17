const express = require('express');
const mongodb = require('mongodb');
const routes = require('./routes/index.js');
const session = require('express-session');
const app = express();
const router=express.Router();
app.use(express.json());
let sess;

app.use(express.static("views"));
//app.use('/static', express.static(path.join(__dirname, 'views')));

app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/About.html');
});

//use sessions for tracking login
app.use(session({
    secret: 'ObsCuR3d',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false
    }
}));

const DB_URI = 'mongodb+srv://anirudh:rj13sl1608@cluster0-lcda6.mongodb.net/test?retryWrites=true&w=majority';
const port = process.env.PORT || 3000;

//const HOSTNAME = '127.0.0.1';
//const PORT = '8080';

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});



mongodb.MongoClient.connect(DB_URI, (error, dbClient) => {
    if(error) {
        console.log('error connecting to database', error)
        return
    }

    console.log('successfully connected to database instance');
    const database = dbClient.db('carbon-footprinting');
    database.collection('user-profiles').createIndex( { email: 1 }, { unique: true },{required:true} );
    routes(app,database);
    app.listen(port, () => {
        console.log(`Server started at ${port}`);
    });

    // app.listen(PORT, HOSTNAME, () => {
    //     console.log(`Server started at http://${HOSTNAME}:${PORT} ......`);
    // })

})
