# 🤝 Contributing to ImoyaFlow AI

First off, thanks for taking the time to contribute! 🎉  
We welcome contributions from everyone, whether it's fixing a typo, suggesting an idea, or building a new feature.

---

## 🛠 Ways to Contribute

- **Report bugs** → Open an [issue](../../issues) and describe the problem clearly.  
- **Suggest features** → Share your idea in an [issue](../../issues) or [discussion](../../discussions).  
- **Fix bugs or add features** → Pick an open issue or create a new one to discuss before coding.  
- **Improve documentation** → Help make instructions clearer for new developers.  

---

## 🚀 Getting Started (for developers)

### Prerequisites
- [Node.js](https://nodejs.org/) (v20 or later)
- [pnpm](https://pnpm.io/) (recommended package manager)
- [Postgres](https://www.postgresql.org/) (local or Docker)

### Setup steps
1. Fork this repo and clone your fork:
   ```bash
   git clone https://github.com/<your-username>/imoyaflow.git
   cd imoyaflow
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Start services:
   - Backend: `cd apps/backend && pnpm dev`
   - Frontend: `cd apps/frontend && pnpm dev`

4. Visit the frontend (default: `http://localhost:5173`)  
   Backend API runs on `http://localhost:4000`

---

## 🌿 Branching & Pull Requests

- Work on a feature branch:  
  ```bash
  git checkout -b feat/my-new-feature
  ```

- Make commits that are **clear and concise**.  
- Push and open a Pull Request (PR) to `main`.  
- Link the issue your PR addresses (e.g. “Fixes #12”).  

---

## 🧪 Tests

Please write or update tests when adding new code.  
Run all tests before submitting a PR:

```bash
pnpm test
```

---

## 🧭 Code of Conduct

By participating in this project, you agree to uphold our [Code of Conduct](./CODE_OF_CONDUCT.md).

---

## 🙌 Need help?

- Check the [Notion Project Page](https://brainitconsulting.notion.site/ImoyaFlow-AI-Project-267961fe630180a18c7bcc19ab8bb28d)  
- Open an [issue](../../issues) or [discussion](../../discussions)  
- Or just ask in your PR!

Let's build **ImoyaFlow AI** together 💡
