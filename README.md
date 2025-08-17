# Travel Memories Gallery

A beautiful travel photo gallery and journey tracker built with Next.js, featuring modern UI components and seamless photo management.

## Features

- 🎨 Beautiful modern design with smooth animations
- 📱 Responsive design for all devices
- 🗺️ Interactive travel carousel with auto-scroll
- 📸 Photo galleries and memory tracking
- 🖼️ Full-page photo viewing experience
- 📍 Location tracking with GPS coordinates
- 🏷️ Photo tagging and organization
- 🎯 Modern UI with shadcn/ui components
- ⚡ Built with Next.js 14 and TypeScript
- 🔄 Auto-scrolling carousel with smooth transitions

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Animations**: Tailwind CSS Animations
- **Backend**: ImageKit for image storage
- **Image Processing**: Canvas API for compression
- **Animations**: GSAP for smooth carousel animations
## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm
- ImageKit account (for photo storage)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd imalikas-pastel-journeys
```
abc
2. Install dependencies:
```bash
npm install
# or
# or
pnpm install
```

3. Set up ImageKit:
   - Create an ImageKit account at [ImageKit.io](https://imagekit.io/)
   - Get your public key, private key, and URL endpoint
   - Copy your ImageKit config to `.env.local` (see `env.example`)

4. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── gallery/           # Photo gallery page
│   └── globals.css        # Global styles
├── src/
│   ├── components/        # React components
│   │   ├── ui/           # shadcn/ui components
│   │   ├── Hero.tsx      # Hero section
│   │   ├── Navigation.tsx # Navigation bar
│   │   ├── Timeline.tsx  # Timeline component
│   │   ├── TripCard.tsx  # Trip card component
│   │   ├── PhotoUploadModal.tsx # Photo upload modal
│   │   └── PhotoGallery.tsx # Photo gallery component
│   └── lib/              # Utility functions
│       ├── firebase.ts   # Firebase configuration
│       └── photo-upload.ts # Photo upload utilities
├── public/               # Static assets
│   └── assets/          # Images and media
└── tailwind.config.ts   # Tailwind configuration
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Firebase Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Firestore Database
4. Enable Storage
5. Set up security rules for both services

### 2. Configure Environment Variables

Copy `env.example` to `.env.local` and fill in your Firebase config:

```bash
cp env.example .env.local
```

### 3. Security Rules

For Firestore:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /photos/{photoId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

For Storage:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /photos/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Customization

### Colors and Themes

The project uses CSS custom properties for theming. You can customize colors in `app/globals.css`:

```css
:root {
  --primary: 221.2 83.2% 53.3%;
  --background: 0 0% 100%;
  /* ... other color variables */
}
```

### Adding New Components

1. Create your component in `src/components/`
2. Use the existing shadcn/ui components as building blocks
3. Follow the established naming conventions and styling patterns

## Deployment

The project is ready to deploy on Vercel, Netlify, or any other platform that supports Next.js.

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).
# Updated by soni0021
