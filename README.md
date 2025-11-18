# DevHub - Developer Task & Project Management App

## 1. Overview

DevHub is a task and project management application built as a training project for engineers learning Ruby on Rails. Its purpose is to simulate a realistic, production-grade environment, applying Rails architecture and idioms in a hands-on context.

The application allows users to:
- Create and manage Projects and Tasks.
- Assign tasks to Users.
- Asynchronously track the history of changes via background jobs.
- Expose all data through a GraphQL API.

## 2. System Architecture

The application follows a modular architecture using **Rails Engines** to separate core business logic from administrative functions. It is designed to be a scalable and maintainable Rails backend.

-   **Application Core**: The main Rails application serves as the entry point and handles shared configuration, routing, and authentication.
-   **Core Engine (`/`)**: This engine contains the primary business logic, including data models, services, and the GraphQL API. It's the heart of the application's functionality.
-   **Admin Engine (`/admin`)**: Mounted at `/admin`, this engine is reserved for future administrative features like dashboards and reporting.
-   **GraphQL API (`/graphql`)**: A `graphql-ruby`-based API provides a single endpoint for clients (like the planned React frontend) to query and mutate data. The GraphiQL interface is available at `/graphiql` in the development environment for easy testing and exploration.
-   **Background Processing**: Asynchronous tasks, such as logging activities, are handled by `Sidekiq` and `ActiveJob` to ensure the web application remains responsive.
-   **Service Objects**: Business logic is encapsulated in Service Objects (e.g., `TaskStatusUpdater`) located in `app/services` to keep controllers and models lean.

## 3. Project Structure

The project is organized as a standard Rails application with a focus on modularity through engines.

```
dev_hub/
├── app/
│   ├── controllers/      # Main application controllers (GraphQL, Auth)
│   ├── graphql/          # GraphQL schema, types, mutations, and queries
│   ├── jobs/             # ActiveJob classes (e.g., ActivityLoggerJob)
│   ├── models/           # Main application models (User, UserSession)
│   └── ...
├── config/
│   └── routes.rb         # Mounts engines and defines main routes
├── engines/
│   ├── admin/            # Admin Engine (for dashboards, reports)
│   │   └── app/
│   └── core/             # Core Engine (main business logic)
│       ├── app/
│       │   ├── models/   # Core models (Project, Task, Activity)
│       │   └── services/ # Service Objects for business logic
│       └── db/
│           └── migrate/  # Migrations for core tables
├── spec/                 # RSpec tests (models, requests, etc.)
└── Gemfile               # Project dependencies
```

## 4. Tech Stack

- **Backend:** Ruby `3.3.6`, Rails `7.1.6`
- **Database:** PostgreSQL
- **API:** `graphql-ruby`
- **Authentication:** `Authlogic`
- **Background Jobs:** `Sidekiq`
- **Web Server:** `Puma`
- **Testing:** `RSpec`, `FactoryBot`, `Shoulda Matchers`, `Faker`

## 5. Data Model

The core data models are organized within the `Core` engine.

- **`User`**: Manages authentication and task assignments.
    - **Key Attributes**: `name`, `email`, `password_digest`
- **`Core::Project`**: The main container for tasks. A project has many tasks.
    - **Key Attributes**: `name`, `description`
- **`Core::Task`**: Represents a unit of work. It belongs to a `Project` and can be assigned to a `User` via a polymorphic association (`assignee`).
    - **Key Attributes**: `title`, `description`, `status`, `project_id`, `assignee_type`, `assignee_id`
- **`Core::Activity`**: Logs a history of changes to records (e.g., status changes on a `Task`).
    - **Key Attributes**: `record_type`, `record_id`, `action`

## 6. Getting Started

### Prerequisites
- Ruby `3.3.6`
- Bundler
- A running PostgreSQL server

### Installation and Setup

1.  **Clone the repository:**
    ```bash
    git clone <REPOSITORY_URL>
    cd dev_hub
    ```

2.  **Install dependencies:**
    ```bash
    bundle install
    ```

3.  **Configure the database:**
    Ensure your `config/database.yml` is correctly configured for your local PostgreSQL environment. A template is provided in the file.

4.  **Create and migrate the database:**
    ```bash
    bin/rails db:create
    bin/rails db:migrate
    ```

5.  **(Opcional) Seed the database with sample data:**
    ```bash
    bin/rails db:seed
    ```

### Running the Application

1.  **Start the Rails server:**
    ```bash
    bin/rails server
    ```
    The application will be available at `http://localhost:3000`.

2.  **Start Sidekiq (for background jobs):**
    In a separate terminal, run:
    ```bash
    bundle exec sidekiq
    ```

## 7. Running Tests

To run the RSpec test suite, use the following command:

```bash
bin/rails spec
```