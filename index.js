const express = require('express')
const cors = require('cors')
const app = express();
const port = process.env.PORT || 5000;

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

//middleware 
app.use(cors())
app.use(express.json())

// sanjeda6244611
// lrvDEZ2JhgFtQO5o



const uri = "mongodb+srv://sanjeda6244611:lrvDEZ2JhgFtQO5o@cluster0.p7haruv.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        const productCollection = client.db('productDB').collection('products')


        app.get('/products', async (req, res) => {
            const cursor = productCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })


        app.post('/products', async (req, res) => {
            const newProduct = req.body;
            console.log(newProduct);
            const result = await productCollection.insertOne(newProduct)
            res.send(result)
        })

        //specific band name products

        app.get('/products/brand/:brandName', async (req, res) => {
            const brandName = req.params.brandName;

            try {

                const products = await productCollection.find({ brand: brandName }).toArray();
                res.send(products);
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });

        app.get('/products/:productId', async (req, res) => {
            const productId = req.params.productId;
            const query = {_id : new ObjectId(productId)}
            const result = await productCollection.findOne(query)
            res.send(result)
        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Brand shop server running')
})

app.listen(port, () => {
    console.log(`Brand shop is running on ${port}`);
})