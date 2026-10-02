import config from "./config/config.js";
import app from "./app.js";
import connectDB from "./db/db.connection.js";

connectDB().then(()=>{app.listen(config.port,()=>{
        console.log(`App is listening on port : ${config.port}`);
    });
}).catch((error)=>{
       console.log("Db connection error",error);
       process.exit(1);
});