const mongoose = require("mongoose");

module.exports.connectToDB = async ()=>{
    await mongoose.connect(process.env.MONGO_URL,
        ).then(
            ()=>console.log("Connected to DB"),
            (err)=>console.log("Failed to connect to DB")
        )
        
}



