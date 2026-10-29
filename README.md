# GauSSCol.SI — Web Demo

[![WebGPU](https://img.shields.io/badge/WebGPU-Supported-blue.svg)](https://w3c.github.io/webgpu/)
[![Companion Server](https://img.shields.io/badge/Companion%20Server-GauSSColVision-emerald.svg)](https://github.com/sreenvenkitr/GauSSColVision)
[![License: MIT](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)

Live Web Demo: **[https://sreenvenkitr.github.io/GauSSCol-Demo/](https://sreenvenkitr.github.io/GauSSCol-Demo/)**

**GauSSCol.SI** is a high-performance 3D Gaussian Splatting viewer and spatial intelligence system that runs entirely in modern web browsers via **WebGPU** and **WebAssembly**.

---

## Architecture Overview

GauSSCol.SI employs a two-tier architecture:

```text
┌──────────────────────────────────────────────┐
│       GauSSCol-Demo (This Repository)        │
│       Served publicly via GitHub Pages       │
│  - WebGPU real-time 3D Gaussian Splat render │
│  - Interactive orbit/fly camera navigation   │
│  - 2D Lasso / point seed selection           │
│  - Zero installation required for 3D viewing │
└───────────────────────┬──────────────────────┘
                        │
                        │ HTTP / localhost:8010
                        ▼
┌──────────────────────────────────────────────┐
│     GauSSColVision (Optional Local Server)    │
│  https://github.com/sreenvenkitr/GauSSColVision │
│  - FastAPI backend on your machine           │
│  - Multimodal VLM reasoning (Google Gemini)  │
│  - Meta SAM 2.1 2D-to-3D semantic uplifting  │
│  - User API key stays local in .env          │
└──────────────────────────────────────────────┘
```

1. **Web Demo (GitHub Pages):** Renders 3D Gaussian Splats (`room-7k.splat`) using WebGPU. You can freely inspect scenes, rotate cameras, and perform geometric lasso selections without installing anything.
2. **Companion Vision Server (`GauSSColVision`):** An optional lightweight service running locally on your PC. When running, it unlocks the **Ask GauSSCol.SI** AI panel, allowing you to prompt the scene in natural language (e.g., *"select the chair"*, *"find the bucket"*), grounded by Gemini VLM and Segment Anything 2 (SAM 2.1).

---

## Setting Up the Local Vision Server

To enable the AI **Ask GauSSCol.SI** features:

### 1. Clone the Companion Repository
```bash
git clone https://github.com/sreenvenkitr/GauSSColVision.git
cd GauSSColVision
```

### 2. Install Dependencies
```bash
# Windows quick setup:
setup_vision.bat

# Or manual installation:
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Configure Your API Key (`.env`)
Copy `.env.example` to `.env` inside `GauSSColVision/`:
```ini
VISION_PROVIDER=gemini
GEMINI_API_KEY=your_gemini_api_key_here
VISION_GEMINI_MODEL=gemini-flash-lite-latest
```
> **Get a Gemini API Key:** Free API keys are available at [Google AI Studio](https://aistudio.google.com/).

### 4. Start the Vision Server
```bash
run_server.bat
```
The FastAPI server will start listening at `http://127.0.0.1:8010`.

### 5. Connect from the Web Application
1. Open the [GauSSCol.SI Web Demo](https://sreenvenkitr.github.io/GauSSCol-Demo/).
2. In the right-hand panel, expand **Ask GauSSCol.SI**.
3. If it shows 🔴 **Offline**, click **⟳ Retry Connection**.
4. Once connected, the status indicator changes to 🟢 **Online**, and you can begin issuing semantic queries.

---

## Privacy & Security Guarantee

- **Zero Cloud Leakage of Credentials:** Your API key is stored exclusively in your local `.env` file on your machine. It is never transmitted to GitHub Pages or any GauSSCol web server.
- **Local Loopback Communication:** The browser web page only sends requests to `http://127.0.0.1:8010` on your own computer.
- **Direct VLM Calls:** Viewpoint images are forwarded directly from your local Python server to your selected AI provider (Google Gemini).

---

## Browser Requirements

- Google Chrome 113+ or Microsoft Edge 113+ (with WebGPU enabled).
- Hardware-accelerated GPU recommended for optimal 3D Gaussian Splatting framerates.
