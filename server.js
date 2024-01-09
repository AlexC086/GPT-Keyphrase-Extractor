const sys_prompt = 
`You will be provided with a block of text, and your task is to extract a list of keyphrases from it.
You should only extract keyphrases from user's input and list in numbered list.
Do not add any explination.
If the user's input is just 1 word, directly output the input as the output.
In the paragraph, if you see an "and" linking 2 nouns with 1 adjective in front, help me to pair an adjective for each noun and extract 2 pair of keywords, for example, "simple shapes and colors" should be extracted as "simple shapes" and "simple colors".
"colorful tiles and patterns" should be extracted as "colorful tiles" and "colorful patterns".
If verb and noun together, you should keep is as a whole,
for example, "moving and jumping on the screen" should be 1 keyword, "moving and jumping on the screen".
`;

console.log(sys_prompt);

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: "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"     // Don't worries. This API key is from taobao
});
const openai = new OpenAIApi(configuration);


const express = require('express');
const app = express();  // app of express
const port = 8383;

var keyphrases;
var user_input;
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
    console.time('Time elapsed')
    const completion = await openai.createChatCompletion({
        messages: [
            {"role": "system", "content": sys_prompt},
            {"role": "user", "content": user_input},
        ],
        model: "gpt-3.5-turbo",
      });

      keyphrases = completion.data.choices[0].message.content;
      console.log("Keyphrases: ", completion.data.choices[0].message.content);
      console.log("Keyphrases: ", completion)
      console.timeEnd('Time elapsed')
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