# 🏥 MedCore AI - Medical Diagnosis RAG System

> AI-powered clinical decision support system using Retrieval-Augmented Generation (RAG) and BioMistral-7B

![System Status](https://img.shields.io/badge/status-development-yellow)
![License](https://img.shields.io/badge/license-MIT-blue)
![Python](https://img.shields.io/badge/python-3.9+-blue)
![Node](https://img.shields.io/badge/node-22+-green)

---

## 🌟 Features

- ✅ **RAG-Based Diagnosis**: AI analyzes patient symptoms using your medical knowledge base
- ✅ **Document Upload**: Index clinical guidelines, textbooks, and protocols
- ✅ **Source Citation**: Every diagnosis shows which medical documents were used
- ✅ **Real-time Analysis**: Powered by HuggingFace BioMistral-7B model
- ✅ **Beautiful UI**: Modern glassmorphism design with React + Tailwind
- ✅ **Docker-Ready**: One command to start all services
- ✅ **HIPAA-Compliant Ready**: Local deployment option for sensitive data

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
```

---

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- HuggingFace Account (free)

### 1. Clone & Configure

```bash
git clone https://github.com/yourusername/medcore-ai.git
cd medcore-ai

# Copy environment template
cp .env.example .env

# Add your HuggingFace token to .env
# Get token from: https://huggingface.co/settings/tokens
```

### 2. Start Services

```bash
docker-compose up --build
```

Wait 30 seconds for all services to start, then visit:
- **Client**: http://localhost:5173
- **API**: http://localhost:3000/health
- **AI Service**: http://localhost:8000

### 3. Upload Medical Documents

```bash
curl -X POST http://localhost:3000/upload-documents \
  -F "documents=@./your_medical_guideline.pdf"
```

### 4. Start Diagnosing!

Go to http://localhost:5173 and click "Start New Diagnosis"

---

## 📚 Documentation

- [Complete Setup Guide](./SETUP_GUIDE.md) - Detailed installation & usage
- [API Reference](./API_REFERENCE.md) - All endpoints documented
- [Architecture Deep Dive](./ARCHITECTURE.md) - System design details

---

## 🛠️ Tech Stack

### Frontend
- **React 19** + TypeScript
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Lucide Icons** - UI icons

### Backend
- **Node.js 22** + Express + TypeScript
- **PostgreSQL 15** - Database
- **Multer** - File uploads

### AI Service
- **Python 3.9** + FastAPI
- **ChromaDB** - Vector database
- **Sentence Transformers** - Embeddings
- **HuggingFace Inference API** - BioMistral-7B
- **LangChain** - RAG framework

---

## 📊 API Examples

### Generate Diagnosis

```bash
curl -X POST http://localhost:3000/diagnose \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": "P-2024-001",
    "age": 45,
    "gender": "Male",
    "symptoms": "Persistent dry cough, fever, fatigue",
    "duration": "2 weeks",
    "history": "Non-smoker, no chronic diseases"
  }'
```

### Upload Medical Documents

```bash
curl -X POST http://localhost:3000/upload-documents \
  -F "documents=@clinical_guideline.pdf" \
  -F "documents=@treatment_protocol.pdf"
```

### List Indexed Documents

```bash
curl http://localhost:3000/documents
```

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

## 🤝 Contributing

Contributions welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) first.

---

## ⚖️ License

MIT License - See [LICENSE](./LICENSE) for details

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

- 📧 Email: support@medcore.ai
- 💬 Discord: [Join our community](#)
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/medcore-ai/issues)

---

## 🙏 Acknowledgments

- **BioMistral** team for the medical LLM
- **HuggingFace** for the inference API
- **ChromaDB** for the vector database
- **LangChain** for the RAG framework

---

**Built with ❤️ for the medical community**