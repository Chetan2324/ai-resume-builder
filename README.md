# AI Resume Builder

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![OpenAI API](https://img.shields.io/badge/OpenAI_API-412991?style=for-the-badge&logo=openai&logoColor=white)

A full-stack AI-powered resume builder that helps users draft, edit, enhance, preview, and export resumes with a clean web experience.

## Features

- Interactive resume editor for personal info, experience, education, skills, and custom sections
- AI-assisted suggestion generation for experience bullet improvements
- MongoDB-backed resume save and load by ID
- Local “recently saved” ID history in the browser
- PDF export using HTML canvas rendering
- Responsive React + Tailwind UI

## Tech Stack

- **Frontend:** React, Tailwind CSS, Axios, React Toastify
- **Backend:** Node.js, Express, Mongoose
- **Database:** MongoDB
- **AI:** Google Gemini API (`@google/generative-ai`)
- **Export:** jsPDF + html2canvas

## Architecture Overview

- `client` provides the resume editor/preview experience.
- `server` exposes REST endpoints for persistence and AI suggestions.
- The frontend calls backend APIs via `REACT_APP_API_URL`.
- The backend uses `MONGODB_URI` for data storage and `GOOGLE_API_KEY` for AI suggestions.

## Folder Structure

```text
ai-resume-builder/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── data/
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── server/
│   ├── models/
│   ├── routes/
│   ├── index.js
│   └── package.json
├── docs/
├── .github/
└── README.md
```

## Screenshots

> Add screenshots after deployment.

- `docs/screenshots/home.png` – Home/editor view
- `docs/screenshots/preview.png` – Resume preview
- `docs/screenshots/pdf-export.png` – Export workflow

## Installation Guide

### Prerequisites

- Node.js 18+
- npm 9+
- MongoDB instance (local or cloud)
- Google AI API key

### Clone and install

```bash
git clone https://github.com/Chetan2324/ai-resume-builder.git
cd ai-resume-builder

cd server && npm install
cd ../client && npm install
```

## Environment Variables

See `.env.example`, `client/.env.example`, and `server/.env.example`.

### Server (`server/.env`)

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
GOOGLE_API_KEY=your_google_ai_api_key
CORS_ORIGIN=http://localhost:3000
```

### Client (`client/.env`)

```env
REACT_APP_API_URL=http://localhost:5000
```

## Running Locally

In separate terminals:

```bash
cd server
npm run dev
```

```bash
cd client
npm start
```

## Build Instructions

```bash
cd client
npm run build
```

## Deployment

### Frontend (Vercel)

1. Import repository in Vercel.
2. Set root directory to `client`.
3. Add `REACT_APP_API_URL` environment variable pointing to backend URL.
4. Deploy.

### Backend (Render)

1. Create a new Web Service from this repository.
2. Set root directory to `server`.
3. Build command: `npm install`
4. Start command: `npm start`
5. Set `MONGODB_URI`, `GOOGLE_API_KEY`, `CORS_ORIGIN`, and optional `PORT`.

## API Endpoints

Base URL: `/resumes`

- `POST /add` – Create a new resume
- `GET /:id` – Retrieve a resume by MongoDB ID
- `PUT /update/:id` – Update an existing resume
- `POST /suggest` – Generate AI suggestion for a description

## Future Improvements

- Authentication and user accounts
- Rich text editing and section templates
- Unit and integration test coverage
- Resume theme variants and internationalization
- CI pipeline with automated lint/build checks

## Contributing

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) before opening a PR.

## License

Distributed under the MIT License. See [LICENSE](./LICENSE).

## Repository Metadata Recommendations

See [docs/repository-metadata.md](./docs/repository-metadata.md).

## Author

- GitHub: [@Chetan2324](https://github.com/Chetan2324)
- LinkedIn: [Add your LinkedIn profile URL](https://www.linkedin.com/in/your-profile/)
