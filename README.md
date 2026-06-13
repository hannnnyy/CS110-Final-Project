# NeighborGood

## Project Overview
NeighborGood is a web application that solves the problem of people buying expensive, single-use items (like power tools) by providing a secure platform for neighbors to lend and borrow from each other. Our main goal is to help communities save money, promote trust among locals, and reduce the waste of money.

## Team Member Contributions
* **Juan Varela:** Frontend integration, UI navigation flow, DOM manipulation, and applying JavaScript fetch architecture to connect the frontend UI to backend.
* **Hanson Pan:** Backend server architecture, MongoDB database schemas, JWT authentication routing, and global CSS UI styling.

## Feature List
* **Secure Authentication:** User registration and login utilizing JWT for secure sign in.
* **Dynamic Item Feed:** A real time homepage feed that fetches local items from the database with category filtering.
* **Listing Creation:** Authenticated users can publish new items with custom borrowing conditions, availability dates, and photos.
* **Borrow System:** Users can select pickup/return dates and message item owners to request to borrow an item.
* **User Profile Dashboard:** A personalized dashboard tracking a user's active listings, successful borrows/lends, and community Trust Score.
* **Protected Admin Dashboard:** A route protected admin panel for managements of accounts and listings.

## Project Deployment Instructions
### Tech Stack (Tools, Libraries, Frameworks, APIs)
* **Frontend:** HTML, CSS, JavaScript, Python 3
* **Backend:** Node.js, Express.js
* **Database:** MongoDB Atlas
* **Version Control:** Git/GitHub

### How to Run
To deploy this application locally, you must start the backend API and the frontend client simultaneously in two separate terminal windows.

**1. Start the Backend Server**
Open a terminal, navigate to the `backend` directory, install dependencies, and start the server.
```bash
cd backend
npm install
npm run dev
```
**2. Start the Frontend Client**
Open a second terminal window, navigate to the `frontend` directory, and start a local Python HTTP server.

```bash
cd frontend
python3 -m http.server 3000
```

**3. Access the Application**
With both servers running, open your web browser and go to **`http://localhost:3000/`**
