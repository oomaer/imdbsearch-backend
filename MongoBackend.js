const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');


app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const database_name = 'Budget'
const MongoURL = `mongodb+srv://mongotest:Ac850wzNqM8j5qoj@cluster0.ci7lf.mongodb.net/${database_name}?retryWrites=true&w=majority`
const User = require(`./models/users`);
const Income = require(`./models/income`);

mongoose.connect(MongoURL, { useNewUrlParser: true, useUnifiedTopology:true, useCreateIndex:true})
    .then(result => {
        app.listen(process.env.PORT || 5000);
        console.log('server running');
    })
    .catch((err => console.log(err)));
   


const addIncome = async (req, res) => {
    const data = req.body;
    try{
        const income = new Income({
            amount: data.income,
            frequency: data.frequency,
            user_email: data.email
        })

        const result = await income.save()
        res.status(200).send(result._id);

    }catch(err){
        console.log(err);
    }
}


const getUser = async (req, res) => {
    try{
        const result = await User.find({email: req.body.email})
        res.status(200).json({
            email: result[0].email,
            name: result[0].name,
            currency: result[0].currency,
            imagelink: result[0].imagelink
        })

    }
    catch(err){
        console.log(err);
        res.status(400).json(err.message);
    }
}

const changeCurrency = async (req, res) => {
    try{
        const data = req.body;
        let result = await User.updateOne({email : data.email}, {
                $set : {currency: data.changed_curr[0]}
        })

        let rate_change = data.changed_curr[1] / data.prev_curr[1];

        result = await Income.updateMany({user_email: data.email}, {$mul: {amount: rate_change}})

        res.status(200).json(result);

    }
    catch(err){
        console.log(err);
    }

}

const getIncome = async (req, res) => {
    try{
        result = await Income.find({user_email: req.body.email}, {_id: 1, amount: 1, frequency: 1});
        res.status(200).json(result);

    }catch(err){
        console.log(err);
        res.status(400).json(err.message);
    }  
}

const editIncome = async (req, res) => {
    try{
        let result = await Income.updateOne({_id: req.body.id}, {$set : {amount: req.body.amount}});
        res.status(200).json(result);

    }catch(err){
        res.status(400).json(err.message);
        console.log(err);
    }
}

const deleteIncome = async (req, res) => {
    try{
        let result = await Income.deleteOne({_id: req.body.id});
        res.status(200).json(result);

    }catch(err){
        res.status(400).json(err.message);
        console.log(err);
    }
}

app.post('/getUser', (req, res) => getUser(req, res))
app.post('/addIncome', (req, res) => addIncome(req, res))
app.post('/getIncome', (req, res) => getIncome(req, res))
app.post('/editIncome', (req, res) => editIncome(req, res))
app.post('/deleteIncome', (req, res) => deleteIncome(req, res))
app.post('/changeCurrency', (req, res) => changeCurrency(req, res))
