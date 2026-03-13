# About

## NFDI-MatWerk Zenodo Uploader

This project was created to make it easy for researchers in the
[NFDI-MatWerk](https://nfdi-matwerk.de) consortium to publish datasets to
the [nfdi-matwerk Zenodo community](https://zenodo.org/communities/nfdi-matwerk)
with proper metadata, a reserved DOI, and zero friction.

## Design principles

- **No data storage** — files are streamed directly to Zenodo; nothing persists on the server.
- **Zenodo-native auth** — users sign in with their existing Zenodo account; no separate user database.
- **Reproducible infrastructure** — a single `docker compose up` starts everything.
- **Open source** — MIT licensed; contributions welcome.

## Technology stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Zustand, Tailwind CSS, Framer Motion |
| Backend | Python 3.12, FastAPI, httpx, Starlette sessions |
| Docs | MkDocs Material |
| Infrastructure | Docker, Docker Compose, nginx |

## Contributing

Pull requests are welcome! Please read `CONTRIBUTING.md` in the repository root before submitting.
