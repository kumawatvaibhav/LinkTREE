# LinkTREE

This is the backend for a platform that provides user management features, such as registration, login, referral tracking, and password management. It is built with Node.js, Express, and PostgreSQL, and it can be hosted on Render, a cloud platform for deploying web applications.

## Features
- User registration and login with JWT authentication
- Password reset functionality
- Referral system with unique referral links
- Secure password hashing
- RESTful API endpoints for managing users and referrals

## Technologies Used
- **Node.js**: JavaScript runtime for the backend
- **Express.js**: Web framework for building APIs
- **Sequelize**: ORM for interacting with PostgreSQL
- **PostgreSQL**: Relational database for data storage
- **JWT**: For secure user authentication
- **Bcryptjs**: For password hashing

## Installation

Follow these steps to set up the project locally:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/kumawatvaibhav/LinkTREE.git
   cd linktree
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up the database:**
   - Ensure PostgreSQL is installed on your system.
   - Create a new database:
     ```sql
     CREATE DATABASE your_db_name;
     ```
   - Create a database user and grant privileges:
     ```sql
     CREATE USER your_db_user WITH PASSWORD 'your_secure_password';
     GRANT ALL PRIVILEGES ON DATABASE your_db_name TO your_db_user;
     ```

4. **Configure environment variables:**
   - Create a `.env` file in the project root:
     ```bash
     touch .env
     ```
   - Add the following variables (replace with your values):
     ```
     DB_NAME=your_db_name
     DB_USER=your_db_user
     DB_PASSWORD=your_secure_password
     DB_HOST=localhost
     JWT_SECRET=your_jwt_secret_key
     NODE_ENV=development
     ```

5. **Run database migrations (if using Sequelize CLI):**
   ```bash
   npx sequelize-cli db:migrate
   ```

## Running the Application Locally

1. **Start the server:**
   ```bash
   npm start
   ```
   - The application will run on `http://localhost:3000` by default (adjust the port if necessary).

2. **Run tests (if applicable):**
   ```bash
   npm test
   ```

## Hosting on Render

Render is a cloud platform that simplifies deploying and hosting web applications. Follow these steps to host your backend on Render:

### Step 1: Create a Render Account
- Sign up or log in at [Render](https://render.com/).

### Step 2: Set Up a New Web Service
1. From your Render dashboard, click **New** and select **Web Service**.
2. Connect your GitHub repository (push your project to GitHub first if not already done).
3. Select the branch to deploy (e.g., `main`).

### Step 3: Configure the Web Service
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Environment:** Select **Node** as the runtime.

### Step 4: Set Environment Variables
- In the Render dashboard, go to your web service and click **Environment**.
- Add the following variables (use production values):
  ```
  DB_NAME=your_production_db_name
  DB_USER=your_production_db_user
  DB_PASSWORD=your_production_db_password
  DB_HOST=your_production_db_host
  JWT_SECRET=your_jwt_secret_key
  NODE_ENV=production
  ```

### Step 5: Connect to a Database
- Render offers a managed PostgreSQL service:
  1. From your Render dashboard, click **New** and select **PostgreSQL**.
  2. Configure the database and note the connection details (e.g., host, user, password, database name).
  3. Update the `DB_*` environment variables in your web service with these details.

### Step 6: Deploy the Application
- Click **Create Web Service** to start the deployment.
- Render will build and deploy your application. Once complete, you’ll get a live URL (e.g., `https://your-app-name.onrender.com`).

## API Endpoints
Here are some example endpoints (adjust based on your implementation):
- **POST /api/register**: Register a new user.
- **POST /api/login**: Log in and receive a JWT token.
- **POST /api/forgot-password**: Request a password reset.
- **GET /api/referrals**: Retrieve referral data for the authenticated user.

## Contributing
- Fork the repository.
- Create a feature branch:
  ```bash
  git checkout -b feature/your-feature
  ```
- Commit your changes:
  ```bash
  git commit -m 'Add your feature'
  ```
- Push to the branch:
  ```bash
  git push origin feature/your-feature
  ```
- Open a pull request.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

### Notes:
- Replace placeholders (`yourusername`, `your-backend-repo`, `your_db_name`, etc.) with your actual project details.
- Ensure your `.env` file is not committed to GitHub; use Render’s environment variables for production.
- If your project uses additional tools or services (e.g., Redis, email services), add relevant setup instructions.
- Test the deployment steps to confirm they work for your specific setup.

This README provides a clear guide for setting up your backend locally and hosting it on Render. Let me know if you need further customization!