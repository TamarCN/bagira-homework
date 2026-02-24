# 📘 Force Tree Project
---

## 🛠 Technologies
- **Back-End:** Node.js, Express, PostgreSQL  
- **Front-End:** React, Vite  
- **Request Management:** Axios, React Query  

---

## Installation and Running

### **Backend**
Navigate to the `backend` folder:
```bash
cd backend
npm install
npm start
```

### **Fronted**
Navigate to the `client` folder:
```
cd client
npm install
npm run build
npm run preview
```

## Database
1. Restore the forces table from the provided backup.
2. To improve the performance of data fetching, you can add an index on the parent_id column:
```
CREATE INDEX idx_forces_parent_id ON forces(parent_id)
```



