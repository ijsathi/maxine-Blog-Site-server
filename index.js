// const express = require("express");
// const cors = require("cors");
// const ObjectId = require("mongodb").ObjectId;
// require("dotenv").config();
// const { MongoClient } = require("mongodb");
// const app = express();
// const port = process.env.PORT || 5000;

// // middleware
// app.use(cors());
// app.use(express.json());

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vsocy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// async function run() {
//     try {
//         await client.connect();
//         console.log("database connected successfully");

//         const database = client.db("blogSite");
//         const blog = database.collection("allBlog");

//         // GET API FOR BLOG
        // app.get('/blog', async(req, res)=>{
        //     const cursor = blog.find({})
        //     const blog = await cursor.toArray();
        //     res.send(blog)
        // });

//     }

//     finally {
//     }
// }

// run().catch(console.dir);

// app.get("/", (req, res) => {
//     res.send("hello from Blog site");
// });

// app.listen(port, () => {
//     console.log("listening to port", port);
// });

const express = require('express')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;


// middleware
app.use(cors())
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vsocy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run (){
    try {
        await client.connect();
        const database = client.db("blogSite");
        const blogCollection = database.collection("allBlogs");
       

        // GET API
        app.get('/blog', async(req, res)=>{
            console.log(req.query);
            const cursor = blogCollection.find({});
            const page = req.query.page;
            const size = parseInt(req.query.size);
            const count = await cursor.count();
            let blog;
            if(page){
                blog = await cursor.skip(page*size).limit(size).toArray();
            }
            else{
                blog = await cursor.toArray();
            }
            res.send({
                count,
                blog
            })
        });

        // GET SINGLE API
        app.get('/blog/:id', async(req, res)=>{
            const id = req.params.id;
            console.log(id);
            const query = {_id: ObjectId(id)};
            const blog = await blogCollection.findOne(query);
            res.json(blog)

        })

    }
    finally{

    }
}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('Wedding server is running');
})

app.listen(port, () => {
    console.log("server is running", port);
})