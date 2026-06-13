# Ecommerce Assignment

A monorepo for an ecommerce coding assignment containing a React frontend and a Spring Boot backend.

## Project Structure

```
ecommerce-assignment/
├── frontend/          # React + Vite shopping cart application
├── backend/           # Spring Boot API (to be implemented)
├── README.md
└── .gitignore
```

## Frontend

The frontend is a React application built with Vite, Tailwind CSS, Zustand, and React Router.

```bash
cd frontend
npm install
npm run dev
```

The dev server runs at `http://localhost:5173` by default.

See [frontend/README.md](frontend/README.md) for feature details and screenshots.

## Backend

The backend folder is reserved for a Spring Boot application. Add your Spring Boot project here as part of the assignment.

## Scripts

| Location   | Command           | Description              |
|------------|-------------------|--------------------------|
| `frontend` | `npm run dev`     | Start development server |
| `frontend` | `npm run build`   | Production build         |
| `frontend` | `npm run preview` | Preview production build |
