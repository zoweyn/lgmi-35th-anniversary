# LGMI Balbalungao 35th Anniversary

A web-based anniversary website created for **Living Gospel Ministries Inc. (LGMI) Balbalungao** to celebrate its **35th Anniversary**.

The website provides a digital space where the church community can explore the church's story, share memories, upload photos, and leave messages for the anniversary celebration.

---

##  Live Website

**LGMI Balbalungao 35th Anniversary**

https://lgmi-35th-anniversary.netlify.app/

---

##  Anniversary Details

- **Church:** Living Gospel Ministries Inc. – Balbalungao
- **Event:** 35th Anniversary
- **Date:** November 22, 2026
- **Time:** 8:00 AM

---

##  Features

###  Home

The homepage introduces the 35th anniversary celebration and provides quick access to the main sections of the website.

Features include:

- Anniversary hero section
- Countdown to the anniversary
- Church story preview
- Community highlights
- Website QR code
- Responsive navigation

###  Our Story

A dedicated section presenting the journey and history of LGMI Balbalungao.

###  Memories

Church members and visitors can share meaningful memories from their time with the church.

Submitted memories are displayed publicly without requiring administrator approval.

###  Photos

Visitors can upload anniversary-related photos directly through the website.

Uploaded photos are stored securely using Supabase Storage and are displayed on the public photo gallery.

###  Messages

Visitors can leave messages, greetings, and anniversary wishes for the church community.

Messages are displayed publicly after submission.

###  Admin Dashboard

The website includes a protected administrator area.

Administrators can:

- Log in securely
- View submitted memories
- View submitted messages
- View uploaded photos
- Delete inappropriate or unwanted submissions
- Manage community content

Administrative functions are protected using Supabase Authentication and application-level authorization.

###  QR Code

The website includes a QR code that allows church members and guests to quickly access the anniversary website using their mobile devices.

---

##  Technologies Used

### Frontend

- Angular
- TypeScript
- HTML5
- SCSS
- Angular Router
- Angular Signals

### Backend / Database

- Supabase
- PostgreSQL
- Supabase Authentication
- Supabase Storage
- Row Level Security (RLS)

### Deployment

- GitHub
- Netlify

### Development Tools

- Visual Studio Code
- Git
- Node.js
- npm
- Angular CLI

---

##  Project Structure

```text
lgmi-35th-anniversary/
│
├── public/
│   └── images/
│
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   └── supabase/
│   │   │
│   │   ├── pages/
│   │   │   ├── home/
│   │   │   ├── story/
│   │   │   ├── memories/
│   │   │   ├── photos/
│   │   │   ├── messages/
│   │   │   └── admin/
│   │   │
│   │   └── shared/
│   │       ├── navbar/
│   │       └── qr-code/
│   │
│   ├── environments/
│   │
│   ├── styles.scss
│   └── main.ts
│
├── README.md
├── angular.json
├── package.json
└── tsconfig.json

Getting Started
Prerequisites
Make sure the following are installed:
Node.js
npm
Angular CLI
Git
Check your installed versions:
node -v
npm -v
ng version
git --version

Installation
Clone the repository: git clone https://github.com/zoweyn/lgmi-35th-anniversary.git

Navigate into the project:
cd lgmi-35th-anniversary
Install dependencies:
npm install

Environment Configuration
The application uses Supabase for database, authentication, and storage services.

Create the required environment configuration inside:
src/environments/environment.ts
Example:
export const environment = {
  production: false,

  supabaseUrl: 'YOUR_SUPABASE_URL',

  supabasePublishableKey:
    'YOUR_SUPABASE_PUBLISHABLE_KEY'
};

Important
Do not expose or commit your Supabase secret/service-role key.
Only the public/publishable key should be used by the Angular frontend.

Development Server
Start the development server: ng serve

Then open:
http://localhost:4200/

The application automatically reloads whenever source files are modified.

Production Build
To create a production build:
ng build
The compiled application will be generated inside:
dist/

Testing
Run unit tests with:
ng test

Admin Access
The admin area is available through:
/admin
The administrator must authenticate before accessing the dashboard.
Protected routes include:
/admin/dashboard
/admin/memories
/admin/photos
/admin/messages

The application uses:
Supabase Authentication
Admin authorization
Angular route guards
Supabase Row Level Security (RLS)
Regular website visitors do not have access to administrative management functions.

Database
The project uses Supabase PostgreSQL.
Main tables include:
memories
photos
church_messages
admin_users
Memories
Stores memories submitted by church members and visitors.

Photos
Stores photo information and references to images stored in Supabase Storage.
Church Messages
Stores anniversary greetings and messages.
Admin Users
Used for administrator authorization.

Photo Storage
Uploaded anniversary photos are stored using the Supabase Storage bucket:
anniversary-photos

Public submissions are stored under:
public/

The system allows visitors to upload and view anniversary photos while restricting modification and deletion privileges.
Administrators can remove photos through the admin dashboard.

Security
The application uses several security mechanisms:
Supabase Authentication
Row Level Security (RLS)
Admin route guards

Restricted database modification policies
Restricted Storage operations
Public/publishable Supabase key for frontend access

Administrative operations such as deleting submitted content are restricted to authorized administrators.

Responsive Design
The website is designed to work across:
Desktop
Laptop
Tablet

Mobile devices
The interface follows a consistent visual design inspired by the church's anniversary theme.

Deployment
The project is connected to GitHub and Netlify.
The deployment workflow is:
Local Development
       ↓
   ng build
       ↓
   git add .
       ↓
   git commit
       ↓
   git push
       ↓
     GitHub
       ↓
    Netlify
       ↓
 Live Website

Every push to the main branch can trigger a new Netlify deployment.

Available Routes
Public
/
 /story
 /memories
 /photos
 /messages

Administration
/admin
/admin/dashboard
/admin/memories
/admin/photos
/admin/messages

Project Purpose
The LGMI Balbalungao 35th Anniversary Website was developed to provide the church community with a centralized digital platform for:

Celebrating 35 years of God's faithfulness
Preserving church memories
Collecting anniversary photos
Sharing messages and greetings
Presenting the church's journey
Providing easy access to anniversary information

Developer
Developed as a web development project for:
Living Gospel Ministries Inc. – Balbalungao

Acknowledgment
"35 Years of God's Faithfulness"
This website is created to celebrate the faithfulness of God throughout the journey of LGMI Balbalungao and to preserve the memories and testimonies of the church community.

License
This project was developed specifically for the LGMI Balbalungao 35th Anniversary celebration.

### After replacing `README.md`

Run:

```powershell
git add README.md
git commit -m "Update project README"
git push