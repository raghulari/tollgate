# AI Gateway API Specification

The Tollgate AI Gateway exposes an OpenAI-compatible API to allow drop-in replacement in any existing SDK or agent library.

## Base URL

- Development: `http://localhost:8787`
- Production: `https://gateway.tollgate.dev`

## Authentication

Every request to the gateway requires a Tollgate virtual API key passed via the `Authorization` header:

```http
Authorization: Bearer tg_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## Endpoints

### 1. Health Check

`GET /health`

**Response (200 OK):**

```json
{
  "status": "ok",
  "service": "tollgate-gateway",
  "timestamp": "2026-11-04T13:30:00.000Z"
}
```

### 2. Readiness Check

`GET /ready`

**Response (200 OK):**

```json
{
  "status": "ready",
  "service": "tollgate-gateway",
  "timestamp": "2026-11-04T13:30:00.000Z"
}
```

### 3. Chat Completions

`POST /v1/chat/completions`

**Request Body (JSON):**

```json
{
  "model": "gpt-4o-mini",
  "messages": [
    { "role": "system", "content": "You are a helpful assistant." },
    { "role": "user", "content": "Hello!" }
  ],
  "temperature": 0.7,
  "stream": false
}
```

**Response (200 OK):**

```json
{
  "id": "chatcmpl-9xxxx",
  "object": "chat.completion",
  "created": 1730727000,
  "model": "gpt-4o-mini",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Hello! How can I assist you today?"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 19,
    "completion_tokens": 9,
    "total_tokens": 28
  }
}
```
