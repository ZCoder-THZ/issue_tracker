# Issue Tracker

🚀 **Overview**

Issue Tracker is a full-stack web application designed to streamline project issue management, providing an intuitive interface for tracking bugs, feature requests, and tasks. Built with modern technologies, this application ensures efficiency and scalability for teams managing software development.

---

## 🌟 Features

- 📝 **Create & Manage Issues** – Track bugs, feature requests, and tasks with a structured workflow.
- 📌 **Labels & Status Updates** – Categorize issues with labels and update their status dynamically.
- 👥 **User Authentication** – Secure login and user management.
- 🔍 **Search & Filters** – Quickly find issues using powerful search and filtering options.
- 📊 **Analytics & Reporting** – Gain insights into project health and progress.
- 📡 **Real-time Updates** – Stay updated with issue changes using real-time synchronization.

---

## 🏗️ Tech Stack

### **Frontend**
- **Next.js** – Server-side rendering and optimized performance.
- **React.js** – Component-based UI development.
- **Tailwind CSS** – Modern styling framework for a sleek UI.
- **TanStack Query (React Query)** – Data fetching and state management.

### **Backend**
- **Node.js & Express.js** – Lightweight, high-performance API.
- **MySQL** – Reliable and scalable database.
- **Prisma ORM** – Simplified database management.
- **JWT Authentication** – Secure user authentication.
- **Socket.io** – Real-time issue commenting and notifications.

### **Deployment & Infrastructure**
- **Jenkins** – CI/CD pipeline for backend deployment using a Jenkinsfile.
- **AWS EC2** – Backend hosted on an Amazon EC2 instance for scalability.
- **Vercel** – Frontend deployed with Vercel for fast global delivery.
- **Docker** – Containerized application for consistent deployment.
- **CI/CD Pipeline** – Automated deployment with GitHub Actions.
- **AWS RDS** – Managed PostgreSQL database for secure data storage.

---

## 🚀 Live Demo

🔗 **Production URL:** [Issue Tracker](https://issue-tracker-six-mu.vercel.app/)

---

## 🛠️ Setup & Installation

### Clone the repositories:
```sh
 git clone https://github.com/ZCoder-THZ/issue_tracker.git
 git clone https://github.com/ZCoder-THZ/issue_tracker_backend.git
```

### Navigate into each project and install dependencies:
```sh
 cd issue_tracker && npm install
 cd ../issue_tracker_backend && npm install
```

### Set up environment variables:
- Create a `.env` file in both frontend and backend folders.
- Add necessary configurations (DB connection, JWT secret, etc.).

### Start the backend:
```sh
 npm run dev
```

### Start the frontend:
```sh
 npm run dev
```

### Access the application at:
[http://localhost:3000](http://localhost:3000)

---

## 🛡️ Security & Best Practices

- 🔒 **Environment variables** – Sensitive configurations are managed via `.env` files.
- 🔄 **Automated CI/CD** – Secure deployments with GitHub Actions.
- 🚀 **Optimized performance** – Next.js SSR and static optimizations.
- 📡 **Scalable infrastructure** – Hosted on AWS for reliability.

---

## 🤝 Contributing

Contributions are welcome! Follow these steps to contribute:

1. Fork the repository.
2. Create a new branch:
   ```sh
   git checkout -b feature-branch-name
   ```
3. Make your changes and commit:
   ```sh
   git commit -m 'Add new feature'
   ```
4. Push to the branch:
   ```sh
   git push origin feature-branch-name
   ```
5. Open a pull request.

---

## 📩 Contact

For any inquiries, feel free to reach out via GitHub Issues or email.

💡 *This project is actively maintained and open to feature suggestions.*

