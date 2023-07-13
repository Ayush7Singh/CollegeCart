const mongoose = require("mongoose");


const connectdatabase=()=>{
    mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true});
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function () {
        console.log(`connection established`);
    });
}

module.exports=connectdatabase;

