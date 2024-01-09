const { Configuration, OpenAIApi } = require("openai")

const configuration = new Configuration({
  apiKey: "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"     // Don't worries. This API key is from taobao
})
const openai = new OpenAIApi(configuration)


const express = require('express');
const app = express();  // app of express
const port = 8383;

var keyphrases;
var user_input
app.use(express.static('public'));  // public folder
app.use(express.json());  // accept data in json format
app.use(express.urlencoded());  // decode the data send through html form


app.post('/', (req, res) => {
    const {parcel} = req.body;
    console.log("Design requriement:", parcel);
    if(!parcel){
        return res.status(400).send({status: 'failed'});
    }
    res.status(200).send({status: 'received'});
    user_input = parcel;
})

async function go(user_input) {
    const completion = await openai.createChatCompletion({
        messages: [
            {"role": "system", "content": 
            `
                You will be provided with a block of text, and your task is to extract a list of keywords from it.
            `},
            {"role": "user", "content": user_input},
        ],
        model: "gpt-3.5-turbo",
      });

      keyphrases = completion.data.choices[0].message.content;
      console.log("Keyphrases: ", completion.data.choices[0].message.content);
      console.log("Keyphrases: ", completion)
}

app.get('/info', async(req, res) => {
    await go(user_input);
    console.log("Sending request");
    if (keyphrases != '') {
            res.status(200).json({ info: keyphrases });
        } 
    else {
            res.status(204).json({ info: null });
        }
})


// Listen to port
app.listen(port, () => console.log(`Example app listening on port ${port}!`));