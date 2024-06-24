/* eslint-disable */
import express from "express";
import cors from "cors";
import { OpenAI } from "openai";

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const API_URL = process.env.API_URL;
const API_KEY = process.env.API_KEY;

const openai = new OpenAI({
  apiKey: API_KEY,
  baseURL: API_URL,
});

app.post("/api/aihelper", async (req, res) => {
  const payload = req.body;

  try {
    const response = await openai.chat.completions.create(
      {
        model: "gpt-4o",
        messages: [{ role: "system", content: payload.prompt }],
        stream: true,
        temperature: 0.2,
      },
      { responseType: "stream" }
    );
    for await (const part of response) {
      if (part.choices[0].finish_reason === "stop") {
        res.end();
        return;
      }
      res.write(part.choices[0]?.delta?.content || "");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
