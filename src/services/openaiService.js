const { OpenAI } = require("openai");
const openai = new OpenAI(process.env.OPENAI_API_KEY);

module.exports = async (input) => {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: `${input} tell me the output of the following code along with th explaination of the code`,
      },
    ],
  });
  console.log(response.data);
  return response.choices[0].message.content;
};
