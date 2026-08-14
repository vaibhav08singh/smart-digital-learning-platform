# CodeZen — API Specification

The CodeZen server API endpoints are hosted inside `src/app/api/`.

---

## 1. AI Tutor Engine (`POST /api/tutor`)

Handles AI tutoring queries using the RAG knowledge base.

- **Request Body**:
  ```json
  {
    "prompt": "Explain AVL Tree rotations with an example",
    "topicId": "avl"
  }
  ```
- **Response** (`200 OK`):
  ```json
  {
    "reply": "An AVL tree is a height-balanced binary search tree...",
    "sources": [
      { "label": "AVL Trees & Balance Factors", "url": "/courses/c-dsa-foundations" }
    ]
  }
  ```

---

## 2. Code Execution Engine (`POST /api/execute`)

Executes code via the Piston engine backend.

- **Request Body**:
  ```json
  {
    "language": "python",
    "sourceCode": "print('Hello from CodeZen!')"
  }
  ```
- **Response** (`200 OK`):
  ```json
  {
    "output": "Hello from CodeZen!\n",
    "executionTimeMs": 42,
    "exitCode": 0
  }
  ```

---

## 3. Code Assistant (`POST /api/ai/assist`)

Provides code debugging and refactoring tips inside the Coding Lab.

- **Request Body**:
  ```json
  {
    "code": "def solve(): pass",
    "language": "python",
    "task": "explain"
  }
  ```
- **Response** (`200 OK`):
  ```json
  {
    "explanation": "This function defines a placeholder python routine..."
  }
  ```
