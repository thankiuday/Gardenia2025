# Gardenia 2025 - Elements: Live the Essence

A comprehensive event management platform for Garden City University's annual cultural fest "Gardenia 2025".

## 🎭 About Gardenia 2025

Gardenia 2025 is Garden City University's premier cultural festival featuring:
- **35+ Events** across 3 categories
- **Department Flagship Events** - Neo-Tribe: Find Your Clan
- **Signature Events** - Elements: Live the Essence  
- **Sports Events** - Arena: Play for Glory

## 🚀 Features

### Frontend (React + Vite)
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Page Transitions** - Smooth animations and loading states
- **Event Management** - Browse, view details, and register for events
- **User-Friendly Forms** - Streamlined registration process
- **Modern UI/UX** - Professional design with accessibility features

### Backend (Node.js + Express)
- **RESTful API** - Complete event management system
- **User Registration** - Individual and team event registration
- **PDF Generation** - Automatic ticket generation
- **QR Code Generation** - Unique registration codes
- **Database Integration** - MongoDB with Mongoose

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS v4** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Puppeteer** - PDF generation
- **QRCode** - QR code generation
- **Multer** - File upload handling

## 📁 Project Structure

```
Gardenia2025/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   ├── pages/          # Page components
│   │   ├── data/           # Static data and configurations
│   │   └── App.jsx         # Main application component
│   ├── public/             # Static assets
│   └── package.json        # Frontend dependencies
├── backend/                 # Node.js backend application
│   ├── routes/             # API route handlers
│   ├── models/             # Database models
│   ├── utils/              # Utility functions
│   └── server.js           # Main server file
└── README.md               # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/thankiuday/Gardenia2025.git
   cd Gardenia2025
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Setup**
   
   Create `.env` file in the backend directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/gardenia2025
   JWT_SECRET=your_jwt_secret_here
   ```

5. **Start the development servers**
   
   Backend (Terminal 1):
   ```bash
   cd backend
   npm start
   ```
   
   Frontend (Terminal 2):
   ```bash
   cd frontend
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 📱 Pages & Features

### Home Page
- Hero section with video background
- Event categories with filtering
- Statistics overview
- Smooth animations and transitions

### Events Page
- Complete event listing
- Category-based filtering
- Search functionality
- Event details and registration

### Registration System
- Individual and team registration
- Form validation
- PDF ticket generation
- QR code generation

### Admin Panel
- Event management
- Registration tracking
- User management
- Analytics dashboard

## 🎨 Design System

### Colors
- **Primary Blue**: Professional blue palette
- **Green Accents**: Success and action colors
- **Red Accents**: Alert and warning colors
- **Gray Scale**: Neutral colors for text and backgrounds

### Typography
- **Font Family**: Inter (Google Fonts)
- **Responsive Sizing**: Mobile-first typography scale
- **Accessibility**: WCAG compliant contrast ratios

### Animations
- **Page Transitions**: Route-specific animations
- **Loading States**: Progress indicators and spinners
- **Hover Effects**: Interactive element feedback
- **Staggered Animations**: Sequential element reveals

## 🔧 API Endpoints

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get specific event
- `POST /api/events` - Create new event (Admin)

### Registration
- `POST /api/register` - Register for event
- `GET /api/registrations` - Get all registrations (Admin)
- `GET /api/registrations/:id` - Get specific registration

### Admin
- `POST /api/admin/login` - Admin authentication
- `GET /api/admin/dashboard` - Dashboard data

## 🚀 Deployment

### Frontend (Render)
1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Set Node.js version: 18+

### Backend (Render)
1. Connect GitHub repository
2. Set build command: `npm install`
3. Set start command: `npm start`
4. Add environment variables
5. Set Node.js version: 18+

## 📄 License

This project is created for Garden City University's Gardenia 2025 event.

## 👥 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Contact

For questions or support, please contact:
- **Event Coordinator**: Garden City University
- **Address**: 16th KM, Old Madras Road, Bangalore – 560 049
- **Phone**: +91 (80) 66487600 / +91 90-1992-1992
- **Email**: pro@gcu.edu.in

---

**Gardenia 2025** - Elements: Live the Essence
*March 15-16, 2025*