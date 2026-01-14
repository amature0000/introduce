import * as webllm from "https://esm.run/@mlc-ai/web-llm";

const engine = await webllm.CreateMLCEngine(
  "Qwen2.5-0.5B-Instruct-q4f32_1-MLC",
  {
    initProgressCallback: (r) => console.log(r.text),
  },
  {
    context_window_size: 256,
  }
);

const messages = [
  { role: "system", content: "You are a helpful assistant." },
  { role: "user", content: "What is the capital of France?" }
];

const reply = await engine.chat.completions.create({
  messages,
  max_tokens: 64,
});

console.log("AI:", reply.choices[0].message.content);