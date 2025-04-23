# Qred API Backend

A Node.js backend service for the Qred mobile app.

## Setup

1. Install dependencies: `npm install`
2. Configure environment variables in `.env`
3. Start development server: `npm run dev`
4. Build for production: `npm run build`

## API Endpoints

- `GET /api/companies/:id` - Get company details
- `GET /api/companies/:id/transactions` - Get company transactions
- `POST /api/companies/:id/cards/:cardId/activate` - Activate a card

## Database

The database schema is defined in `schema.sql`. Configure connection in `.env`.