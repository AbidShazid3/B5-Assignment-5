# 💸 Digital Wallet API

A secure, role-based digital wallet system built with Node.js, Express, and MongoDB.

---

## 📁 Features

### 👤 User:
- ✅ Register/Login (JWT + PIN-based auth)
- ✅ Wallet auto-created
- ✅ Send Money (min 50, 5tk fee if >100)
- ✅ Withdraw Money (via Agent)
- ✅ Cash-In (via Agent approval)
- ✅ Balance Check
- ✅ Transaction History (SENT / RECEIVED)

### 🧑‍💼 Agent:
- ✅ Register/Login (Pending until approved by Admin)
- ✅ Cash-In to users
- ✅ Cash-Out from users
- ✅ Transaction History

### 👨‍💼 Admin:
- ✅ View all users/agents/wallets/transactions
- ✅ Approve/Suspend Agents
- ✅ Block/Unblock Wallets

---

## 🚀 Technologies
- Node.js, Express.js
- MongoDB, Mongoose
- TypeScript
- JWT Authentication
- Bcrypt for PIN/password hashing
- Role-based Access Control
- Postman for testing

---

## 📦 API Endpoints

### 🔐 Auth
- `POST /auth/register` - Register (User/Agent)
- `POST /auth/login` - Login

### 👤 User (Protected)
- `POST /wallet/add-money`
- `POST /wallet/withdraw`
- `POST /wallet/send-money`
- `GET /wallet/balance`
- `GET /wallet/transactions`

### 🧑‍💼 Agent (Protected)
- `POST /agent/cash-in`
- `POST /agent/cash-out`
- `GET /agent/transactions`

### 👨‍💼 Admin (Protected)
- `GET /admin/users`
- `GET /admin/agents`
- `GET /admin/wallets`
- `PATCH /admin/wallets/block/:id`
- `PATCH /admin/agents/approve/:id`
- `GET /admin/transactions`

---

## 🔑 Authorization

Each request to protected endpoints must include:


---

## 🧪 Postman Testing

1. ✅ Register user & agent → `/auth/register`
2. ✅ Login → `/auth/login` → copy token
3. 🔐 Use token to access protected routes.
4. ✅ Create send, cash-in, cash-out transactions.
5. ✅ Test admin routes after login as admin.

---

## 🧑‍💻 Developer

- **Name**: Abid Shadat Noor
- **GitHub**: [AbidShazid3](https://github.com/AbidShazid3)
- **Project**: Digital Wallet API

---