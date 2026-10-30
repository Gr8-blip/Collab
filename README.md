# ...something BIG 🚀

# Collab

**A real-time collaboration platform built around shared spaces, focused conversations, and interactive experiences.**

Collab is designed to bring people together in shared digital workspaces where they can organize conversations, communicate in real time, and eventually participate in collaborative activities.

Instead of treating collaboration as one endless chat, Collab organizes it into a hierarchy of **Rooms → Spots → Messages**.

---

## ✨ The Vision

Collaboration shouldn't feel like digging through an endless pile of messages to find the one conversation that matters.

Collab introduces a more organized approach: create a shared space, divide it into focused areas, and let people communicate within the context of each area.

The current release focuses on the core experience: authentication, Rooms, Spots, and real-time communication. It establishes the foundation for a broader collaborative workspace where interactive activities can live alongside conversations.

## 🧩 How Collab Works

### 1. Rooms — The Collaborative Space

A Room is the foundation of every collaborative experience.

Rooms can be:

- **Public:** Discoverable and joinable by other users.
- **Private:** Restricted to users who have been granted access.

The user who creates a Room becomes its owner. Rooms provide the shared context in which members can discover Spots and collaborate.

### 2. Spots — Focused Spaces Within a Room

A Spot is a focused space inside a Room, designed to keep conversations organized around specific topics or activities.

For example, a team working on a project could organize its Room into Spots for planning, development, and general discussion.

Each Room includes a General Spot, giving members a default place to start communicating.

### 3. Messages — Communication in Context

Messages live inside Spots, keeping discussions connected to the topic they're about.

Collab uses WebSockets to support real-time interaction between connected users.

Together, these pieces create a structured collaboration flow:

**Room → Spot → Message**

---

## 🚀 Core Features

### 🔐 Authentication
- User registration and login.
- JWT-based authentication.
- Automatic access-token refresh.

### 🌐 Room Management
- Create collaborative Rooms.
- Choose between public and private visibility.
- Discover public Rooms.
- Join accessible Rooms.
- Identify Room ownership and organize members.

### 🗂️ Spot Management
- Create Spots within a Room.
- Organize discussions into focused spaces.
- Navigate between Spots.
- Use the General Spot as the default conversation space.

### ⚡ Real-Time Communication
- WebSocket-based messaging architecture.
- Live communication between connected users.
- Message history retrieval.

### 🎨 Interactive Workspace
- Dashboard for navigating collaborative spaces.
- Shared Room workspace with sidebar navigation.
- Contextual content that changes when users switch between Spots.
- Focused chat interface for communicating within a selected Spot.

---

## 🏗️ Architecture

Collab combines a React frontend, a Django-powered backend, a relational database, and a real-time communication layer.

| Layer | Technology | Responsibility |
|---|---|---|
| Frontend | React + TypeScript | User interface and interactions |
| Styling | Tailwind CSS | UI styling |
| Backend | Django | Application logic |
| REST API | Django REST Framework | API operations |
| Database | SQLite (development) | Persistent application data |
| Real-time communication | Django Channels + WebSockets | Live communication |
| Authentication | Simple JWT | Token-based authentication |

### How the Pieces Work Together

1. The frontend handles user interactions, authentication, Room navigation, and messaging.
2. The REST API handles conventional application operations and communicates with backend data models.
3. SQLite stores persistent application data.
4. The WebSocket layer supports real-time communication between connected clients.

REST and WebSockets serve different purposes: REST handles request-response operations, while WebSockets provide a channel for live events.

---

## 🛠️ Technology Stack

**Frontend**
- React
- TypeScript
- Tailwind CSS
- Vite
- Axios
- React Router
- Lucide React

**Backend**
- Python
- Django
- Django REST Framework
- Django Channels
- Daphne
- Django REST Framework Simple JWT

**Database & Communication**
- SQLite
- WebSockets
- Redis support through Channels Redis (optional for the current in-memory configuration)

---

## 💻 Getting Started

Follow these instructions to run Collab locally.

### Prerequisites

Make sure you have the following installed:

- Python (compatible with Django 6.1)
- Node.js and npm
- Git

SQLite is used by default, so no separate database server is required.

### 1. Clone the Repository

```bash
git clone YOUR_REPOSITORY_URL
cd Collab
```

### 2. Set Up the Backend

Navigate into the backend directory:

```bash
cd backend
```

Create a Python virtual environment:

```bash
python -m venv venv
```

Activate the virtual environment.

**Windows:**

```bash
venv\Scripts\activate
```

**macOS / Linux:**

```bash
source venv/bin/activate
```

Install the backend dependencies:

```bash
pip install -r requirements.txt
```

### 3. Configure the Backend

The backend needs a Django secret key.

Before running the project, configure the Django `SECRET_KEY` through an environment variable and ensure it is not committed to Git.

For local development, generate a new key rather than reusing the original development key.

The current development configuration uses:

- SQLite as the default database.
- Django's in-memory channel layer for WebSocket communication.
- Development CORS settings.

No Redis server is required for the current in-memory channel configuration.

### 4. Apply Database Migrations

From the backend directory, run:

```bash
python manage.py migrate
```

Optionally, create an administrator account:

```bash
python manage.py createsuperuser
```

### 5. Start the Backend Server

```bash
python manage.py runserver
```

The backend should now be accessible at:

```text
http://127.0.0.1:8000/
```

Keep this terminal running.

### 6. Set Up the Frontend

Open another terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

### 7. Configure the Frontend

Create a `.env` file inside the frontend directory:

```env
VITE_API_URL=http://127.0.0.1:8000/
```

This variable defines the backend API base URL used by Axios.

If you're using a different backend address or port, update the value accordingly.

### 8. Start the Frontend

```bash
npm run dev
```

Vite will provide a local development URL, usually:

```text
http://localhost:5173/
```

Open that address in your browser.

**Congratulations! Collab is now running locally. 🎉**

---

## 🗺️ Current Scope and Roadmap

Collab is currently focused on its Minimum Viable Product (MVP): establishing the essential collaboration experience before expanding into more advanced interactive features.

### Current MVP

- User authentication.
- Public and private Rooms.
- Room discovery and joining.
- Spot creation and navigation.
- General Spot for each Room.
- Structured messaging experience.
- WebSocket-based real-time communication.

### Planned for Future Releases

- **Live Board:** A shared board for interactive visual collaboration.
- **Interactive Activities:** Additional ways for users to participate in collaborative experiences within shared spaces.
- **Expanded Collaboration Tools:** More capabilities built on the existing Room and Spot architecture.

These planned features are not part of the current MVP.

---

## 🎯 Design Principles

- **Structured collaboration:** Keep conversations organized instead of placing everything in one feed.
- **Context matters:** Conversations belong to Spots, and Spots belong to Rooms.
- **Real-time interaction:** Make communication feel immediate for connected users.
- **Extensibility:** Build a foundation that can accommodate future interactive tools.

---

## 🌱 What's Next?

The MVP is the starting point, not the final destination.

The long-term direction is to evolve Collab from a structured communication platform into a richer collaborative workspace, where conversations and interactive activities coexist within the same environment.

The foundation is being built one layer at a time.

**One Room. Multiple Spots. A whole lot more to come.**

---

*Collab is an evolving project. Features and architecture may change as development continues.*