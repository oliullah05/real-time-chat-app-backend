import app from "./app";
import server from "./app";
import config from "./app/config";
const port = config.port;


const main =()=>{
    try{
        server.listen(port,()=>{
            console.log(`Chat application server is running on port ${port}`);
        })
    }
    catch(err){
        console.log(err);
    }
}

main()