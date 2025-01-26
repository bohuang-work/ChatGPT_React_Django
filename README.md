# ChatGPT Clone

![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Django](https://img.shields.io/badge/django-%23092E20.svg?style=for-the-badge&logo=django&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![MUI](https://img.shields.io/badge/MUI-%230081CB.svg?style=for-the-badge&logo=mui&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)

A full-stack ChatGPT Clone built with Django and React, featuring a modern UI, real-time chat interface, and advanced AI capabilities.

## Prerequisites

- Docker
- VS Code with "Dev Containers" extension
- Git

## Quick Start with Dev Container

1. Clone the repository:
```bash
git clone <repository-url>
cd chatgpt-clone
```

2. Copy the environment file:
```bash
cp backend/.env.example backend/.env
# Edit backend/.env with your API keys and settings
```

3. Start with Dev Container:
   - Open VS Code
   - Press F1 or Ctrl+Shift+P
   - Select "Dev Containers: Open Folder in Container"
   - Select the project folder
   - Wait for container build (first run may take several minutes)

4. Start the services:

Backend:
```bash
cd backend
./run.sh
```

Frontend:
```bash
cd frontend
yarn dev
```

## Docker Compose Setup

Alternative to Dev Container, you can use Docker Compose:

```bash
# Build and start all services
docker-compose up --build

# Stop all services
docker-compose down
```

Services will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:8000

## Features Implementation Checklist

Model Selection & Configuration:
- [x] Switch between GPT-4o and GPT-4o mini models
- [x] Adjustable temperature settings (0.2, 0.7, 0.9)
- [x] Real-time model parameter updates

Chat Interface:
- [x] Markdown formatting support
- [x] Code block syntax highlighting
- [x] Copy functionality:
  - [x] Copy entire message
  - [x] Copy code blocks individually
- [x] Message regeneration capability

Function Calling Features:
- [x] Weather information function calling for real time weather data

Documentation:
- [x] Comprehensive docstrings
- [x] Code comments
- [x] Type hints
- [x] README documentation


### Environment Variables

Backend requires a `.env` file with under the `backend` directory:
```
OPENAI_API_KEY=your_api_key
WEATHER_API_KEY=your_weather_api_key
```