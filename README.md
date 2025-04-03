# OCI-Project 🚀

Welcome to the **OCI Project** – a full-stack cloud native application developed to efficiently manage tasks and projects using Oracle Cloud Infrastructure (OCI). This project uses **Spring Boot** for the backend and **React** for the frontend, offering user authentication, role-based dashboards, and intuitive sprint and task management.



## 💡 Project Objective

The main goal of this project is to deliver a scalable, secure, and modern task management solution powered by **OCI**. It allows users and administrators to manage projects, assign tasks, and track progress through a clean and responsive interface.


## 🛠️ Initial Setup

- **Backend:** Java + Spring Boot  
- **Frontend:** React  
- **Database:** Oracle Autonomous Database (ATP)  
- **Cloud Platform:** Oracle Cloud Infrastructure (OCI)  



## 🚀 Getting Started

Follow the steps below to get the backend up and running:

### 1. Clone the repository

```bash
git clone https://github.com/juanvalos/OCI-Project.git
cd OCI-Project
```

### 2. Create the `run-backend.bat` script

Inside the `backend` directory, create a new file named `run-backend.bat` with the Sensitive Configuration Data and the command "mvn spring-boot:run"

```bat
@echo off

echo.

// Sensitive Configuration Data

echo.
mvn spring-boot:run

pause
```

This script simplifies launching the Spring Boot server.


### 3. Build the backend project

Run the following command in the `backend` directory:

```bash
mvn clean install
```

### 4. Start the backend server

Now you can start the backend using the `.bat` script:

```bash
.\run-backend.bat  
```


## 📌 Features

- 🧑‍💼 Admin and user role separation  
- 🔐 Secure authentication with password encryption  
- 📊 Dashboards for task and project overview  
- 🚧 Sprint creation and assignment tracking
- 
---

## 🧪 Coming Soon

- Deployment scripts for OCI
- CI/CD integration
---
