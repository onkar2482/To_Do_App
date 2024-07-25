var express=require("express")
var mongoclient=require("mongodb").MongoClient;
var cors=require("cors");


var connectionString="mongodb://127.0.0.1:27017"

var app=express()
app.use(cors())
app.use(express.urlencoded({extended:true}))//send data through url
app.use(express.json())//send data json format

app.get("/",(req,resp)=>{
    resp.send("<h1>TO Do</h1>")
    console.log(`server started:http://127.0.0.1:4000`)
})

app.get("/appointments",(res,resp)=>{
    mongoclient.connect(connectionString).then(clientObject=>{
        var database=clientObject.db("todo");
        database.collection("appointments").find({}).toArray().then(documents=>{
            resp.send(documents)
            resp.end()
        })
    })
})

app.get("/appointments/:Id",(req,resp)=>{
    var Id=parseInt(req.params.Id)
    mongoclient.connect(connectionString).then(clientObject=>{
        var database=clientObject.db("todo")
            database.collection("appointments").find({Id:Id}).toArray().then(documents=>{
                resp.send(documents);
                resp.end();
            })
        
    })

})

app.post("/addtask",(req,resp)=>{
    var task={
        Id:parseInt(req.body.Id),
        Title:req.body.Title,
        Date:new Date(req.body.Date),
        Description:req.body.Description
    }
    mongoclient.connect(connectionString).then(clientObject=>{
        var database=clientObject.db("todo")
        database.collection("appointments").insertOne(task).then(()=>{
            console.log("task added successfully")
        })
    })

})

app.put("/edittask/:id",(req, res)=>{
    var id = parseInt(req.params.id);
    mongoclient.connect(connectionString).then(clientObject=>{
         var database = clientObject.db("todo");
         database.collection("appointments").updateOne({Id:id},{$set:{Id:parseInt(req.body.Id), Title: req.body.Title, Date: new Date(req.body.Date), Description: req.body.Description}}).then(()=>{
             console.log("Task Updated Successfully..");
             res.end();
         })
    })
 });

app.delete("/deletetask/:id", (req, res)=>{
        var id = parseInt(req.params.id);
        mongoclient.connect(connectionString).then(clientObject=>{
            var database = clientObject.db("todo");
            database.collection("appointments").deleteOne({Id:id}).then(()=>{
                console.log("Task Deleted Successfully..");
                res.end();
            })
        })
    });

app.listen(4000)