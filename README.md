# 📚 Library Management Front-End

This is a **fully functional front-end application** for a digital library management system.  
Built with **React.js** and **Next.js**, it provides a responsive and user-friendly interface with server-side rendering (SSR) for SEO optimization.

The project is connected to a RESTful API back-end, which handles authentication, data persistence, and business logic.

🔗 **Back-End Repository:** [https://github.com/doaaalhaji1/Libraryproject]

---

## 🖥️ Front-End Overview

The front-end offers features for both regular users and administrators. It supports browsing, borrowing, and returning books, as well as full admin control over library data.

---

## ✨ Main Features

- 🔹 **Responsive and modern UI** for smooth experience on all devices  
- 🔹 **Book functionalities**: browse, search, borrow, and return  
- 🔹 **User profile management**: update or delete account  
- 🔹 **Admin dashboard**:
  - Manage books, authors, categories, and users  
  - Approve or deny borrow requests  
  - Confirm book returns

---

## 📦 Technologies Used

- **React.js** – Component-based UI development  
- **Next.js** – Server-side rendering and routing  
- **Tailwind CSS** – Utility-first responsive styling  
- **Axios** – HTTP client for API communication  
- **Next.js Routing** – Built-in page-based navigation

---

## 🚀 Installation & Running the Project

### 🔧 Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/en/) (v18 or above recommended)  
- npm or yarn

---

### 📥 Steps to Set Up and Run

```bash
# Clone the repository
git clone https://github.com/your-frontend-repo-link
cd your-frontend-repo-folder

# Install dependencies
# Using npm:
npm install
# Or using yarn:
yarn install

# Configure environment variables
# Create a .env.local file in the root directory and add the following:
echo "NEXT_PUBLIC_API_BASE_URL=https://your-api-base-url.com/api" > .env.local
# Replace https://your-api-base-url.com/api with your actual back-end URL.

# Run the development server
# Using npm:
npm run dev
# Or using yarn:
yarn dev
# The app will be available at: http://localhost:3000

# Build for Production
# To create an optimized production build:
npm run build
npm start

🙌 Contributing
Feel free to fork the project and submit pull requests. Contributions are welcome!

📄 License
This project is licensed under the MIT License.
