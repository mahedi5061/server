const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser=require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.taqt5.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
 
app.use(bodyParser.json());
app.use(cors());

const port = process.env.PORT || 8000;

app.get("/", (req, res) => {
  res.send("hello from db it's working working");
});

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const courseCollection = client.db("sample-task").collection("courses");

  
  
  app.post("/addCourse", (req, res) => {
    const course = req.body;
    courseCollection.insertOne({ course }).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

   
   app.get("/allCourse", (req, res) => {
    courseCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.patch('/updateCourse/:id', (req, res)=>{
      
    courseCollection.updateOne({_id:ObjectId(req.params.id)},
    {
      $set: {courseId:req.body.courseId,curriculum:req.body.curriculum,class:req.body.class,subject:req.body.subject,participants:req.body.participants,seat:req.body.seat,startDate:req.body.startDate,endDate:req.body.endDate,classTime:req.body.classTime,fee:req.body.fee},
    })
    .then(result =>{
       res.send(result.modifiedCount>0)
    })
    
  })

  //delete a product from database.

  app.delete('/delete/:id', (req, res) =>{
    courseCollection.deleteOne({_id:ObjectId(req.params.id)})
    .then(result =>{
        res.send(result.deletedCount>0)
    })
  })
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
