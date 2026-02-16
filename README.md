Fullstack Shopping Cart - Setup Instructions


1. Clone the repository
git clone https://github.com/saessei/fullstack-shopping-cart.git
cd fullstack-shopping-cart

2. Install dependencies
Frontend:
  cd backend 
  npm install

Backend:
  cd backend
  npm install

3. Configure environment variables
Backend (backend/.env):
  PORT=9000
  SUPABASE_URL=postgres://<username>:<password>@localhost:5432/<dbname>
  SUPABASE_KEY=your_secret_key


4. Run the application
Backend:
  cd backend
  npm run dev
  (Backend will run on http://localhost:9000)

5. Integration test
- Start backend 
- npm test

6. Run tests
Backend tests:
  cd backend
  npm test