 ShoppyBag

ShoppyBag is a full-stack e-commerce application designed to provide a seamless online shopping experience. It features a robust Spring Boot backend and a dynamic React frontend.

 Project Overview

- Backend: Built with Java and Spring Boot, handling business logic, database interactions, and authentication.
- Frontend: Built with React and Vite, providing a responsive and interactive user interface.
- Database: PostgreSQL is used for data persistence.

 Tech Stack

 Backend
- Framework: Spring Boot 3.5.6
- Language: Java 17
- Build Tool: Gradle
- Database: PostgreSQL
- Security: Spring Security, JJWT (JSON Web Tokens)
- Payment: Razorpay Integration
- Documentation: SpringDoc OpenAPI (Swagger UI)

 Frontend
- Framework: React 18
- Build Tool: Vite
- Styling: Bootstrap 5, React Bootstrap
- HTTP Client: Axios
- Routing: React Router DOM

 Prerequisites

Ensure you have the following installed on your machine:
- Java 17 or higher
- Node.js (v18+ recommended) and npm
- PostgreSQL

 Getting Started

 Backend Setup

1.  Navigate to the root directory.
2.  Configure your database settings in `src/main/resources/application.properties` (if required).
3.  Run the application using Gradle:

    ```bash
    ./gradlew bootRun
    ```

    The backend server will start on `http://localhost:8080`.

 Frontend Setup

1.  Navigate to the frontend directory:

    ```bash
    cd shoppybag-frontend
    ```

2.  Install dependencies:

    ```bash
    npm install
    ```

3.  Start the development server:

    ```bash
    npm run dev
    ```
