# ChatGPT Clone

A ChatGPT Clone built with Django and React, featuring a clean UI and real-time chat interface.

## Development Setup

1. Install Docker Desktop and VS Code with the "Dev Containers" extension
2. Clone this repository
3. Open the project in VS Code
4. Press F1 or Ctrl+Shift+P and select "Dev Containers: Open Folder in Container"
5. Select the project folder and click "Open"
6. Wait for the container to build and start (this may take a few minutes on first run)
7. Once inside the container, open two terminals:
   - In first terminal: `cd backend && python manage.py runserver`
   - In second terminal: `cd frontend && npm start`

## Project Structure

- `/backend` - Django backend API with SQLite database
- `/frontend` - React frontend with Material UI components
  - `/src/components` - React components including chat interface
  - `/src/index.css` - Global styles
  - `/src/App.js` - Main application component

## Development

The development environment is configured using Dev Containers. All necessary dependencies including Python, Node.js, and required packages are installed automatically when the container is built.

### Features

- Real-time chat interface
- Code block support with syntax highlighting
- Copy to clipboard functionality
- Response regeneration
- Adjustable model parameters

### Ports

- Django backend: http://localhost:8000
- React frontend: http://localhost:3000
