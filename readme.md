# 💰 Digital Wallet API

A secure, role-based RESTful API for a Digital Wallet system using **Express.js**, **MongoDB**, and **JWT Authentication**.  
Supports three user roles: **User**, **Agent**, and **Admin**.

---

## 🚀 Live Demo

🔗 **Frontend:** [https://paynex.vercel.app](#)  
🔗 **Backend API:** [https://digital-wallet-backend-orpin.vercel.app](#)

---

## 📌 Features

- ✅ Role-Based Access Control (User / Agent / Admin)
- 🔐 Secure JWT Authentication
- 💸 Wallet Operations (Send, Withdraw, Cash-in/out, Add Money)
- 📄 Transaction History
- 🛡️ Admin Features (User/Agent management, Wallet Blocking)
- 📦 Input validation using Zod
- 🧪 Tested via Postman (no frontend required)

---

## 👥 Roles & Permissions

| Role   | Accessible Routes                                                                 |
|--------|-----------------------------------------------------------------------------------|
| Public | `POST /auth/login`, `POST /users/register`                                       |
| User   | `/wallet/send-money`, `/wallet/withdraw`, `/wallet/cash-out`, `/wallet/add-money`, `/wallet/my-wallet`, `/transactions/my-transaction` |
| Agent  | `/wallet/cash-in`, `/wallet/my-wallet`, `/transactions/my-transaction`           |
| Admin  | `/admin/users`, `/admin/agents`, `/admin/wallets`, `/admin/transactions`, `/admin/wallets/block/:id`, `/admin/agents/status/:id` |

---

## 📦 REST API Endpoints

### 🔐 Auth

| Method | Endpoint         | Description     |
|--------|------------------|-----------------|
| POST   | `/auth/login`    | Login a user    |
| POST   | `/auth/logout`   | Logout a user   |

---

### 👤 User

| Method | Endpoint              | Role  | Description           |
|--------|-----------------------|-------|-----------------------|
| POST   | `/users/register`     | Public | Register as user/agent |

---

### 💳 Wallet (USER & AGENT)

| Method | Endpoint                | Role    | Description           |
|--------|-------------------------|---------|-----------------------|
| POST   | `/wallet/send-money`    | User    | Send money to user    |
| POST   | `/wallet/withdraw`      | User    | Withdraw from wallet  |
| POST   | `/wallet/add-money`     | User    | Add self-fund money   |
| POST   | `/wallet/cash-out`      | User    | Cash-out to agent     |
| POST   | `/wallet/cash-in`       | Agent   | Cash-in to user       |
| GET    | `/wallet/my-wallet`     | User, Agent | Get own wallet      |

---

### 📜 Transactions

| Method | Endpoint                    | Role         | Description            |
|--------|-----------------------------|--------------|------------------------|
| GET    | `/transactions/my-transaction` | User, Agent | Get own transactions   |

---

### 🛠️ Admin

| Method | Endpoint                      | Description                     |
|--------|-------------------------------|---------------------------------|
| GET    | `/admin/users`                | View all users                  |
| GET    | `/admin/agents`               | View all agents                 |
| GET    | `/admin/wallets`              | View all wallets                |
| GET    | `/admin/transactions`         | View all transactions           |
| PATCH  | `/admin/wallets/block/:id`    | Block or unblock a wallet       |
| PATCH  | `/admin/agents/status/:id`    | Approve or reject an agent      |

---

## 🧪 Testing with Postman

1. 🔐 Login as a user/agent/admin:  
   → Save the returned `accessToken`.

2. 🔑 For protected routes, add this in Postman headers:

---


3. 📦 Test routes by role:
- User: Try `/wallet/send-money`
- Agent: Try `/wallet/cash-in`
- Admin: Try `/admin/users`

---

## 🛠️ Technologies Used

- Express.js
- MongoDB with Mongoose
- Zod (for request validation)
- JSON Web Tokens (JWT)
- TypeScript (Optional, if used)
- bcryptjs (for PIN hashing)
- dotenv (for config management)

---

## 🔒 Security Features

- Password/PIN hashing with bcrypt
- JWT-based authentication
- Role-based authorization on all routes
- Request schema validation with Zod

---

## 📥 Clone & Run Locally
### Follow these steps to clone and run the project on your machine:

#### 1. Clone the repository
git clone https://github.com/AbidShazid3/B5-Assignment-5.git

#### 2. Install dependencies
npm install

##### 3. Create a .env file in the root folder and add environment variables
cp .env.example .env
#### Then fill in your own values inside .env

#### 4. Run the development server
npm run dev

#### The API will be running on: http://localhost:5000


---

## 🧑‍💻 Developer

- **Name**: Abid Shadat Noor
- **GitHub**: [AbidShazid3](https://github.com/AbidShazid3)
- **Project**: Digital Wallet API

---