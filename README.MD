# Employee Evaluation & Project Management System

## 📌 Project Description
This system is a **web-based platform** for **employee evaluation and project management** at Bytelogic. The application helps **managers, employees, and clients** manage projects and evaluate employee performance based on feedback from both clients and managers.

## 🎯 Key Features
- **🔐 Authentication & Authorization**
  - Role-based login: Manager, Employee, and Client
  - Security implemented using **JWT Authentication**
  
- **📊 Dashboard**
  - Displays ongoing and completed projects
  - History of previous projects

- **📂 Project Management**
  - **Manager**: Create, Read, Update, Delete (CRUD) projects, assign clients and employees
  - **Employee**: Update project progress
  - **Client**: View progress of their ordered projects

- **📑 Performance Evaluation**
  - **Clients & Managers** can provide performance ratings for employees
  - Evaluation uses a **Likert scale (1-5)**
  - Evaluation results are viewable by **Managers & the evaluated Employees**

---

### 🛠️ Backend Tech Stack
- **Node.js & Express.js**
- **MongoDB** for the database
- **JWT** for authentication
- **Swagger** for API documentation

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/fhira21/be_bytelogic.git
cd REPO-NAME
``` 

### 2. Install Dependencies
#### Backend:
```sh
cd be_penilaian
npm install
```

### **3. Configure Environment Variables**
Create a .env file inside the backend folder and fill in the following configuration:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### **4. Run The Backend Server**
```sh
cd be_penilaian
npm start
```


## 📖 API Documentation (Swagger)
Once the backend is running, Open your browser and go to:
```
http://localhost:5000/api-docs
```

## 📌 Contributors
- **Fhira Triana Maulani**
- **Nur Wahyu Suci Rahayu**

---
💡 *Feel free to contribute and improve this project!* 🎉
