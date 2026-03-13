# NFDI-MatWerk Zenodo Uploader

> A guided, browser-based upload wizard for publishing research datasets to the
> [nfdi-matwerk](https://zenodo.org/communities/nfdi-matwerk) Zenodo community.

![CI](https://github.com/ebrahimnorouzi/nfdi-matwerk-zenodo-uploader/actions/workflows/ci.yml/badge.svg)
![License: MIT](https://img.shields.io/badge/License-MIT-teal.svg)
![Docker](https://img.shields.io/badge/Docker-ready-blue)
![Zenodo](https://img.shields.io/badge/Zenodo-sandbox%20%2F%20production-orange)

---

## ✨ Features

- 🔐 **Zenodo OAuth login** — sign in with your existing Zenodo account, no separate registration
- 🧙 **5-step guided wizard** — title, description, creators (with ORCID), keywords, license, files
- 📦 **Up to 100 files / 50 GB** per deposit (Zenodo limits)
- ⚡ **Real-time upload progress** per file, with retry on failure
- 🏷️ **Reserved DOI** assigned before publish — cite it in papers immediately
- 🌍 **Auto-submitted** to the `nfdi-matwerk` Zenodo community
- 🚫 **Zero data storage** — files stream directly to Zenodo, nothing persists on the server
- 📖 **Full MkDocs documentation** served alongside the app
- 🐳 **One-command Docker Compose** setup — fully reproducible

## 🌐 Production deployment

1. Set `ZENODO_BASE_URL=https://zenodo.org` (remove sandbox)
2. Register a **production** Zenodo OAuth app with your real domain
3. Set `FRONTEND_URL=https://your-domain.example.com`
4. Generate a strong `SECRET_KEY`: `openssl rand -hex 32`
5. Add HTTPS (Caddy or nginx reverse proxy recommended)
6. In `backend/app/main.py` set `https_only=True` for the session middleware

See [Deployment docs](http://localhost:8080/developer/deployment/) for full details.

---

## 🤝 Contributing

Pull requests are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## 📄 License

MIT — see [LICENSE](LICENSE).

---

## 🔗 Links

- [NFDI-MatWerk](https://nfdi-matwerk.de)
- [MatWerk Zenodo Community](https://zenodo.org/communities/nfdi-matwerk)
- [Zenodo sandbox](https://sandbox.zenodo.org)
- [Zenodo REST API docs](https://developers.zenodo.org)
