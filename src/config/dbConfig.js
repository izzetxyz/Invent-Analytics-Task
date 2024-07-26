const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
    useUnifiedTopology: true, 
    useNewUrlParser: true,
    useNewUrlParser: true
})
.then(()=>console.log('Connected to the database'))
.catch(hata => console.log(`Database connection error ${hata}`));