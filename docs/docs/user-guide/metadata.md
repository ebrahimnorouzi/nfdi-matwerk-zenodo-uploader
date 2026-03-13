# Step 2 – Filling in Metadata

The wizard collects metadata across **three sub-steps** before you upload files.

---

## 2a – Basic Information

| Field | Required | Notes |
|-------|----------|-------|
| **Title** | ✅ | Min 3 chars, max 500. Be descriptive — this is indexed by Zenodo search. |
| **Description** | ✅ | Min 10 chars. Supports Markdown (bold, links, lists). |

**Good title examples**

- `Molecular dynamics trajectories for Fe-C alloys at 800 K (LAMMPS)`
- `XRD diffractograms of AM-processed Ti-6Al-4V at varying scan speeds`

---

## 2b – Creators & Authors

You can add **multiple creators**. Each entry has:

| Field | Required | Notes |
|-------|----------|-------|
| **Full Name** | ✅ | Use "Last, First" format for Zenodo compatibility |
| **Affiliation** | — | Institution or project name |
| **ORCID** | — | Format: `0000-0000-0000-0000` — strongly recommended |

!!! tip "ORCID"
    Including an ORCID ensures the deposit is automatically linked to your
    researcher profile and counts toward your publication list.

---

## 2c – Upload Details

| Field | Required | Notes |
|-------|----------|-------|
| **Upload type** | ✅ | dataset / software / publication / poster / presentation / image |
| **Publication date** | ✅ | Defaults to today. ISO 8601 format (YYYY-MM-DD). |
| **License** | ✅ | See table below |
| **Keywords** | — | Type and press **Enter** or **,** to add. Recommended: `RDF`, `knowledge graph`, `materials science` |

### Available licenses

| License | Best for |
|---------|----------|
| CC BY 4.0 | General datasets — attribution required |
| CC BY-SA 4.0 | Datasets where derivatives must share alike |
| CC0 (Public Domain) | Maximum openness, no restrictions |
| MIT | Software / scripts |
| Apache 2.0 | Software with patent protection |

### Community

All deposits are automatically submitted to the
**[nfdi-matwerk](https://zenodo.org/communities/nfdi-matwerk)** community.
This cannot be changed — it is the purpose of this uploader.
