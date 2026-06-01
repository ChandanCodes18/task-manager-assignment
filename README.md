# Task Manager API + Simple UI (Assignment)

Hi, this is my backend intern assignment project.
I made auth + role based access + task CRUD and one simple frontend for testing APIs.

## Tech used
- Node.js + Express
- MongoDB + Mongoose
- JWT + HttpOnly cookie
- Joi validation
- React + Axios

## Project folders
- `backend` -> api code
- `frontend` -> simple ui for testing
- `backend/docs/postman_collection.json` -> api documentation (postman)

## How to run backend
```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

Backend runs on: `http://localhost:5000`

## How to run frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: `http://localhost:3000`

## .env values (backend)
```env
MONGO_URI=mongodb://127.0.0.1:27017/assignment_db
PORT=5000
JWT_SECRET=replace_with_strong_secret
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

## Main APIs
User APIs:
- `POST /api/users/register`
- `POST /api/users/login`
- `GET /api/users/me`
- `POST /api/users/logout`

Task APIs:
- `POST /api/tasks`
- `GET /api/tasks`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`

## Role logic i implemented
- both admin and user can view all tasks
- admin can edit/delete any task
- user can edit/delete only own task
- user cannot edit/delete task created by admin

## Frontend features
- register
- login
- logout
- create task
- edit task
- delete task
- in dashboard task owner is visible

## API documentation
Only Postman collection is provided as required:
- file: `backend/docs/postman_collection.json`

Steps:
1. Import collection in Postman
2. Set `baseUrl` as `http://localhost:5000`
3. Run: Register -> Login -> Create Task -> Get Tasks -> Update/Delete

## short scalability note
Right now this is monolithic structure but layered (`routes -> middleware -> controllers -> models`) so easy to maintain. If app traffic grows i can split auth and task into separate services, put redis cache for frequently requested data, and run multiple backend instances behind load balancer. Also can use message queue for async jobs.

## push to github
```bash
cd C:\Users\smmoh\Documents\Assignment
git add .
git commit -m "assignment backend+frontend done"
git branch -M main
git remote add origin <repo-url>
git push -u origin main
```