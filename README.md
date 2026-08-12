# 🏥 Pulse AI - Symptom Education RAG System
> Retrieval-augmented symptom education. Describe how you feel in plain language and get background drawn from public health literature, with every source cited

![System Status](https://img.shields.io/badge/status-development-yellow)
![License](https://img.shields.io/badge/license-MIT-blue)
![Python](https://img.shields.io/badge/python-3.9+-blue)
![Node](https://img.shields.io/badge/node-22+-green)

---

## 🌟 Features

- ✅ Grounded Generation: Answers are built from a curated corpus of public health documents (NIH, CDC, NIAMS) rather than model recall alone
- ✅ Distance-Thresholded Retrieval: Chunks beyond RAG_MAX_DISTANCE are discarded before the model sees them
- ✅ Honest Fallback: When nothing in the corpus is close enough, the response is flagged as general knowledge instead of being passed off as sourced
- ✅ Source Citation: Every response lists the documents it drew from
- ✅ Loud Failures: A failed inference call returns a 503 — never plausible-looking substitute text
- ✅ Passwordless Auth: Single-use emailed sign-in links, valid 15 minutes, no password stored
- ✅ Local Embeddings: Document text never leaves the host to be embedded
- ✅ Docker-Ready: One command brings up the whole stack

---

## 🏗️ Architecture
```
┌─────────────────┐
│  React Client   │ ← Beautiful UI with diagnosis forms
└────────┬────────┘
         │
┌────────▼────────┐
│  Node.js Server │ ← API Gateway + Database
└────────┬────────┘
         │
    ┌────┴─────────────────────┐
    │                          │
┌───▼────────┐        ┌────────▼──────┐
│ PostgreSQL │        │  AI Service   │
│            │        │  ┌─────────┐  │
│ - Patients │        │  │ChromaDB │  │ ← Vector Database
│ - History  │        │  └────┬────┘  │
└────────────┘        │       │       │
                      │  ┌────▼────┐  │
                      │  │HuggingFace│ ← BioMistral-7B
                      │  └─────────┘  │
                      └───────────────┘


## 🛠️ Tech Stack

### Frontend
React 19 + TypeScript
Vite - Build tool
Tailwind CSS v4 - Styling, with a CSS-variable token system
Lucide Icons - UI icons

### Backend
Node.js 22 + Express + TypeScript
PostgreSQL 15 - Users and check history
JWT middleware - Applied to all data routes
Multer - File uploads

### AI Service
Python 3.9 + FastAPI
ChromaDB - Vector database, persisted to a named volume
Sentence Transformers (all-MiniLM-L6-v2) - Local embeddings
Groq (openai/gpt-oss-120b) - Inference, JSON mode with a structured schema

Infrastructure
Docker Compose - Separate dev and production configs
AWS EC2 + nginx
Let's Encrypt - TLS with automated renewal hooks
GitHub Actions - CI/CD
---


## 🔐 Security

- ✅ API tokens stored in environment variables
- ✅ `.env` excluded from Git
- ✅ PostgreSQL password configurable
- ✅ CORS properly configured
- ⚠️ Add authentication before production deployment

---

## 💰 Cost

### Development (Free Tier)
- HuggingFace API: Free tier (30K chars/month)
- Local Docker: Free
- **Total: $0/month**

### Production
- HuggingFace API: ~$20/month
- AWS EC2 t3.medium: ~$30/month
- RDS PostgreSQL: ~$15/month
- **Total: ~$65/month**

---

## 🎯 Roadmap

### Phase 1 (Current)
- [x] RAG system with document upload
- [x] Basic diagnosis generation
- [x] Source citation
- [x] Docker deployment

### Phase 2 (Next)
- [ ] Medical image analysis (X-ray, MRI)
- [ ] Drug interaction checker
- [ ] Patient risk assessment
- [ ] Authentication & user management

### Phase 3 (Future)
- [ ] Mobile app (React Native)
- [ ] Real-time collaboration
- [ ] Clinical notes auto-generation
- [ ] Multi-language support

---



## ⚠️ Disclaimer

**This is a clinical decision support tool, NOT a replacement for professional medical judgment.**

- Always validate AI suggestions with clinical expertise
- Conduct proper physical examinations
- Order appropriate diagnostic tests
- Follow established medical protocols
- This tool is for research and educational purposes

---

## 📞 Support

- 📧 Email: raed.hassaan@gmaail.com
- 💬 Discord: [Join our community](#)
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/medcore-ai/issues)

---

## 🙏 Acknowledgments

NIH, CDC and NIAMS for the public health documents the corpus is built from
Groq for the inference API
ChromaDB for the vector database
Sentence Transformers for the embedding mode
---

**Built with ❤️ for the medical community**
