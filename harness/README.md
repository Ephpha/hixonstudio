# Hixon Harness

Local coding + language desk for this laptop. Not part of the public site.

**Machine:** HP Victus · AMD Ryzen 7 · RTX 4060 (usually 8 GB) · 144 Hz.

Run **one model at a time**. The harness unloads the other agent before a chat.

## Start

```bash
# once
ollama pull qwen2.5-coder:7b-instruct
ollama pull qwen3.5:9b

cd harness
npm install
npm run dev
```

Open [http://localhost:3100](http://localhost:3100).

Ollama 0.30+ is required for Qwen 3.5. Optional: `OLLAMA_HOST=http://127.0.0.1:11434`.

| Agent | Model | Job |
| --- | --- | --- |
| Coder | Qwen 2.5 Coder 7B Instruct · Q4 | code, diffs, repairs |
| Language | Qwen 3.5 9B · Q4 | writing, planning, talk |
