const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const {MongoClient} = require('mongodb');
const ObjectID = require('mongodb').ObjectID;

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const database_name = 'imdb'
const MongoURL = `mongodb+srv://mongotest:Ac850wzNqM8j5qoj@cluster0.ci7lf.mongodb.net/${database_name}?retryWrites=true&w=majority`





let db;
MongoClient.connect(MongoURL, { useUnifiedTopology: true })
  .then(client => {
    const port = process.env.PORT || 5000;
    app.listen(port);
    console.log('Server running on ' + port)
    db = client.db(database_name);

  })
  .catch(err => console.log(err))


const getUser = async (req, res) => {
    try{
        const result = await db.find({email: req.body.email})
        res.status(200).json(
            {
            email: result[0].email,
            name: result[0].name,
            currency: result[0].currency,
            imagelink: result[0].imagelink
            }
        )

    }
    catch(err){
        console.log(err);
        res.status(400).json(err.message);
    }
}



const getSearchResults = async (req, res) => {

    let {type, text, sort} = req.body;
    const projection = {title: 1, year: 1, runtime: 1, plot: 1, type: 1, directors: 1, imdb: 1, countries: 1, genres: 1, poster: 1};
    let match;
    let sortType;

    switch(type){
        case 'Title':
            match = {title: text}
            break;
        case 'Actor':
            match = {cast: text}
            break;
        case 'Director':
            match = {directors: text}
            break;
        case 'Genre':
            match = {genres: text}
            break;

    }
    switch(sort){
        case 'None':
            sortType = {}
            break;
        case 'Rating':
            sortType = {"imdb.rating": -1}
            break;
        case 'Award Wins':
            sortType = {"awards.wins": -1}
            break;
        case 'Year':
            sortType = {"year": -1}
            break;
        case 'Runtime':
            sortType = {"runtime": -1}
            break;
        case 'Votes':
            sortType = {"imdb.votes": -1}
            break;
    }

    try{
        //collation helps to perform case sensitive search
        //to array returns an array documents
        result = await db.collection('movies').find(match, {projection: projection}).sort(sortType).collation(
            {locale: 'en', strength: 1 }
          ).toArray();
    
        res.status(200).json(result);

    }catch(err){
        console.log(err);
        res.status(400).json(err.message);
    }  
}

const getComments = async (req, res) => {
    let {movie_id} = req.body;
    let movieObjectID = new ObjectID(movie_id);

    try{

        result = await db.collection('comments').find({movie_id: movieObjectID}).collation(
            {locale: 'en', strength: 1 }
          ).toArray();
    
        res.status(200).json(result);

    }catch(err){
        console.log(err);
        res.status(400).json(err.message);
    }  
}

app.post('/search', (req, res) => getSearchResults(req, res))
app.post('/getComments', (req, res) => getComments(req, res))

            