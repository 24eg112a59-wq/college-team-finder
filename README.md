# College Project Team Finder

This project is a full-stack web application for college students to find project teammates based on technical skills and project requirements.

## Project goal

Students can:
- register and login
- manage their profile and technical skills
- create and manage projects
- define required skills
- search for teammates
- receive skill-match percentages
- send and accept team invitations
- view project teams

Admins can:
- login to a simple admin dashboard
- view registered students
- view projects and team requests
- manage the basic workflow

## Frontend

The React frontend is implemented in this workspace under `src/` with pages for:
- Home
- About
- Login
- Registration
- Student dashboard
- Profile
- Skill management
- Create project
- My projects
- Find teammates
- Invitations
- My teams
- Admin login and dashboard

## Backend

A Spring Boot backend is included under `backend/` with the required package structure:
- controller
- service
- repository
- entity
- dto
- config
- exception

## Quick start

### Frontend

```bash
cd "c:\Users\SNEHITH\authrole-frontend"
npm install
npm run dev
```

### Backend

Set connection values in the same VS Code PowerShell terminal. Enter the password only at the hidden prompt; do not put it in this file or commit it:

```powershell
$env:JAVA_HOME = "C:\Users\SNEHITH\OneDrive\Desktop\full\IntelliJ IDEA 2026.2\jbr"
$env:Path = "$env:JAVA_HOME\bin;$env:Path"
$env:DB_HOST = "localhost"
$env:DB_PORT = "3306"
$env:DB_NAME = "teamfinder"
$env:DB_USERNAME = Read-Host "MySQL username"
$secure = Read-Host "MySQL password" -AsSecureString
$env:DB_PASSWORD = [System.Net.NetworkCredential]::new("", $secure).Password

cd "C:\Users\SNEHITH\authrole-frontend\backend"
& "C:\Users\SNEHITH\Downloads\apache-maven-3.10.0-bin\apache-maven-3.10.0\bin\mvn.cmd" spring-boot:run
```

## MySQL setup

Connect to your existing MySQL Server in MySQL Workbench. Create the database if it does not exist:

```sql
CREATE DATABASE IF NOT EXISTS teamfinder;
```

The backend reads the following values from the process environment. Localhost, port 3306, and database `teamfinder` are defaults; username and password are required:

```properties
spring.datasource.url=jdbc:mysql://${DB_HOST:localhost}:${DB_PORT:3306}/${DB_NAME:teamfinder}?serverTimezone=UTC
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
```

Do not commit real passwords to GitHub. Hibernate uses `ddl-auto=update`; it updates the mapped schema without dropping existing tables.

## Login accounts

Register a student through the registration form, then sign in with that email and password. Passwords are stored as BCrypt hashes.

Admin login requires a database user whose `role` is `ADMIN`. No admin credentials are seeded or hard-coded.

## Skill matching algorithm

The matching percentage is calculated using:

```text
matchingSkills / requiredSkills * 100
```

Example:
- required: Java, React, MySQL, Spring Boot
- candidate: Java, React, MySQL, Python
- matching skills = 3
- percentage = 75%

## Project structure

```text
backend/
  src/main/java/com/example/teamfinder/
    config/
    controller/
    dto/
    entity/
    exception/
    repository/
    service/
    TeamFinderApplication.java
  src/main/resources/application.properties
  pom.xml

src/
  components/
  context/
  pages/
  services/
  utils/
  App.jsx
  main.jsx
  index.css
```

## API overview

Authentication:
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me
- POST /api/auth/logout

Users:
- GET /api/users
- GET /api/users/{id}
- GET /api/users/search?name=&skill=&branch=&year=
- PUT /api/users/{id}
- DELETE /api/users/{id}

Skills:
- GET /api/skills
- POST /api/skills
- POST /api/users/{id}/skills
- DELETE /api/users/{id}/skills/{skillId}

Projects:
- GET /api/projects
- GET /api/projects/{id}
- POST /api/projects
- PUT /api/projects/{id}
- DELETE /api/projects/{id}
- GET /api/projects/{projectId}/matches

Team requests:
- POST /api/team-requests
- GET /api/team-requests/received
- GET /api/team-requests/sent
- PUT /api/team-requests/{id}/accept
- PUT /api/team-requests/{id}/reject

## Testing

Frontend verification:

```bash
cd "c:\Users\SNEHITH\authrole-frontend"
npm run build
```

Backend verification:

```powershell
$env:JAVA_HOME = "C:\Users\SNEHITH\OneDrive\Desktop\full\IntelliJ IDEA 2026.2\jbr"
$env:Path = "$env:JAVA_HOME\bin;$env:Path"
cd "C:\Users\SNEHITH\authrole-frontend\backend"
& "C:\Users\SNEHITH\Downloads\apache-maven-3.10.0-bin\apache-maven-3.10.0\bin\mvn.cmd" test
```

## Notes

The frontend uses session cookies for API authentication. Spring Security loads student credentials from MySQL through the `users` table and requires the `ADMIN` role for admin endpoints. Start/restart the Spring Boot backend after changing its code or connection environment variables.
