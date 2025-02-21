Meitav Project React 
Meitav Project React  is a React.js-based project featuring a responsive interface, side navigation (Offcanvas), Dark Mode support, and user role management with different permissions.

Features
React Router for dynamic page navigation
User authentication and role management (Admin, Business, User, Guest)
Dark Mode / Light Mode support
Search functionality
Responsive design using Bootstrap 5
Side navigation menu (Offcanvas)
Business card management interface
Favorite cards system
Formik + Yup for form handling and validation
Toastify for interactive notifications
Technologies and Tools
React.js
React Router
Bootstrap 5
Formik + Yup
React Icons
Toastify
CSS3 + Custom Styling
Installation and Setup
Clone the repository
bash
Copy
Edit
git clone https://github.com/username/ProjectReactMeitav.git
cd ProjectReactMeitav
Install dependencies
bash
Copy
Edit
npm install
Start the development server
bash
Copy
Edit
npm run dev
Build the project for production
bash
Copy
Edit
npm run build
Project Structure
php
Copy
Edit
ProjectReactMeitav
│── public/                 # Static files  
│── src/                    # Source code  
│   ├── components/         # Reusable components  
│   ├── hooks/              # Custom hooks  
│   ├── pages/              # Application pages  
│   ├── services/           # API services  
│   ├── css/                # Stylesheets  
│   ├── App.js              # Main application file  
│   ├── main.js             # React entry point  
│── .gitignore  
│── package.json  
│── README.md  
Main Pages
/home – Homepage
/about – About the project
/profile – User profile management
/favorites – User's favorite cards
/mycards – Personal card management (Admin & Business users)
/createcard – Create a new business card
/editcard/:id – Edit an existing business card
/login – User login
/register – User registration
Environment Variables
Create a .env file with the required variables
env
Copy
Edit
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key
Credits
This project was developed by Meitav.