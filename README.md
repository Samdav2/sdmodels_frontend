# 3D Marketplace Frontend

A Next.js-based marketplace for buying and selling 3D models with advanced features like automatic quality checks, live previews, and AR support.

## Features

- 🎨 Browse 3D models with interactive previews
- 📊 Automatic technical analysis (polygon count, topology health)
- 🎬 Live animation preview support
- 📱 AR mode for viewing models in real space
- 🔍 AI-powered smart search
- 💰 Transparent fee breakdown

## Tech Stack

- Next.js 14 (App Router)
- React Three Fiber for 3D rendering
- TypeScript
- Tailwind CSS
- Google Model Viewer

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── app/
│   ├── page.tsx           # Home/Gallery page
│   ├── model/[id]/        # Individual model viewer
│   └── upload/            # Upload new models
├── components/
│   ├── ModelCard.tsx      # Gallery card component
│   └── ModelViewer.tsx    # 3D viewer component
└── public/
    └── models/            # Sample 3D models
```

## Next Steps

1. Connect to FastAPI backend for model uploads
2. Implement real 3D model loading
3. Add authentication
4. Integrate payment processing
5. Add AR mode with WebXR
6. Implement AI-powered search
