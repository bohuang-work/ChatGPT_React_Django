# ChatGPT Clone

![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Django](https://img.shields.io/badge/django-%23092E20.svg?style=for-the-badge&logo=django&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![MUI](https://img.shields.io/badge/MUI-%230081CB.svg?style=for-the-badge&logo=mui&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)

A full-stack ChatGPT Clone built with Django and React, you can choose the model between `GPT-4o` and `GPT-4o mini` and adjust the temperature settings.
You can also use the `weather function calling` to get the real-time weather data.

![Demo](demo.gif)


## Prerequisites

- Docker
- VS Code with "Dev Containers" extension
- Git

## Development with Dev Container

1. Clone the repository:
```bash
git cloen https://github.com/bohuang-work/ChatGPT_React_Django.git
cd ChatGPT_React_Django
```

2. Setup the environment file:
Backend requires a `.env` file with under the `/backend` directory:
```
AZURE_OPENAI_ENDPOINT=your_azure_openai_endpoint
AZURE_OPENAI_API_KEY=your_azure_openai_api_key
```

3. Start with Dev Container:
   - Open VS Code
   - Press F1 or Ctrl+Shift+P
   - Select "Dev Containers: Open Folder in Container"
   - Select the project folder
   - Wait for container build (first run may take several minutes)

4. Start the services:

Backend: http://localhost:8000
```bash
cd backend
./run.sh
```

Frontend: http://localhost:5173
```bash
cd frontend
yarn dev
```

## Run with Docker Compose

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
#### Model Selection & Configuration
- [x] Switch between GPT-4o and GPT-4o mini models  
- [x] Adjustable temperature settings (0.2, 0.7, 0.9)

#### Chat Interface
- [x] Markdown formatting support
- [x] Code block syntax highlighting
- [x] Copy functionality:
  - [x] Copy entire message
  - [x] Copy code blocks individually
- [x] Message regeneration capability

#### Function Calling Features
- [x] Weather information function calling for real time weather data

#### Documentation
- [x] Comprehensive docstrings
- [x] Code comments
- [x] Type hints
- [x] README documentation

#### Deployment to Cloud
- [x] Add terraform to deploy to Azure VM

---
