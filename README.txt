================================================================================
                    HOTEL MANAGEMENT SYSTEM
                  Microservices Architecture
================================================================================

PROJECT OVERVIEW
================================================================================
A complete Hotel Management System built with modern microservices architecture.

Technology Stack:
- Backend: ASP.NET Core 8.0 (6 Microservices)
- API Gateway: Ocelot 20.0.0
- Frontend: React 18.2.0
- Database: SQL Server
- Authentication: JWT Bearer Tokens

================================================================================
PROJECT STRUCTURE
================================================================================

Hotel-Management-System-Submission/
├── Backend/
│   ├── ApiGateway/              [Port 5000] - Single entry point
│   │   └── ApiGateway/
│   │       ├── Program.cs
│   │       ├── ocelot.json      - Route configuration
│   │       └── appsettings.json - JWT & CORS settings
│   │
│   └── Services/
│       ├── AuthService/         [Port 5001] - User authentication
│       ├── GuestService/        [Port 5002] - Guest management
│       ├── RoomService/         [Port 5003] - Rooms, Types, Rates
│       ├── ReservationService/  [Port 5004] - Bookings
│       ├── BillingService/      [Port 5005] - Bills & Payments
│       └── ManagementService/   [Port 5006] - Staff, Inventory, Departments
│
└── Frontend/
    └── hotel-management-ui/     [Port 3000] - React Application
        ├── package.json
        ├── src/
        │   ├── components/      - 11 feature components
        │   ├── services/        - API integration
        │   └── context/         - Auth state management
        └── public/

================================================================================
FEATURES
================================================================================

✓ User Authentication (JWT)
✓ Role-Based Access Control (Owner, Manager, Receptionist)
✓ Guest Management (CRUD)
✓ Room & Room Type Management (CRUD)
✓ Room Availability Search
✓ Reservation Management (CRUD)
✓ Billing with Line Items
✓ Payment Recording
✓ Rate Management (Pricing)
✓ Staff Management (CRUD)
✓ Inventory Management (CRUD)
✓ Department Management (CRUD)
✓ User Management (CRUD)

================================================================================
IMPORTANT: CONFIGURATION REQUIRED BEFORE RUNNING
================================================================================

⚠️  The project requires configuration of sensitive data before it can run.

1. DATABASE CONNECTION STRINGS
   -----------------------------
   Update in ALL service appsettings.json files:
   
   Location: Backend/Services/[ServiceName]/[ServiceName]/appsettings.json
   
   Replace placeholder connection string:
   "DefaultConnection": "Server=localhost;Database=[DbName];User Id=YOUR_USER;Password=YOUR_PASSWORD;TrustServerCertificate=True;"
   
   Services to update:
   - AuthService/AuthService/appsettings.json        (Database: HotelAuthDb)
   - GuestService/GuestService/appsettings.json      (Database: HotelGuestDb)
   - RoomService/RoomService/appsettings.json        (Database: HotelRoomDb)
   - ReservationService/ReservationService/appsettings.json (Database: HotelReservationDb)
   - BillingService/BillingService/appsettings.json  (Database: HotelBillingDb)
   - ManagementService/ManagementService/appsettings.json (Database: HotelManagementDb)

2. JWT SECRET KEY
   ---------------
   Update in ALL service appsettings.json files (MUST BE IDENTICAL):
   
   "Jwt": {
     "Key": "YOUR_SECRET_KEY_HERE_MINIMUM_256_BITS_32_CHARACTERS",
     "Issuer": "HotelManagementSystem",
     "Audience": "HotelManagementSystemUsers"
   }
   
   ⚠️  CRITICAL: Use the SAME key across all 7 services (6 services + API Gateway)
   
   Generate a secure key (minimum 32 characters). Example:
   "MySecureHotelKey2024!@#$%^&*()"

3. API GATEWAY PORT CONFIGURATION
   -------------------------------
   Update: Backend/ApiGateway/ApiGateway/Properties/launchSettings.json
   
   Change "applicationUrl" to:
   "applicationUrl": "https://localhost:5000"

================================================================================
PREREQUISITES
================================================================================

Before running, ensure you have:

□ .NET 8.0 SDK installed
  Download: https://dotnet.microsoft.com/download/dotnet/8.0

□ Node.js (v16 or higher) installed
  Download: https://nodejs.org/

□ SQL Server running
  Options:
  - SQL Server Express (free)
  - SQL Server LocalDB
  - Docker: docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=YourPassword123" -p 1433:1433 -d mcr.microsoft.com/mssql/server:2022-latest

□ 7 Terminal windows/tabs available

================================================================================
SETUP INSTRUCTIONS
================================================================================

STEP 1: CONFIGURE CONNECTION STRINGS & JWT
-------------------------------------------
1. Open each appsettings.json file mentioned above
2. Replace placeholder connection strings with your SQL Server credentials
3. Replace placeholder JWT keys with your secure key (same key for all services)

STEP 2: CREATE DATABASES
-------------------------
Run Entity Framework migrations for each service:

# AuthService
cd Backend/Services/AuthService/AuthService
dotnet ef database update

# GuestService
cd ../../GuestService/GuestService
dotnet ef database update

# RoomService
cd ../../RoomService/RoomService
dotnet ef database update

# ReservationService
cd ../../ReservationService/ReservationService
dotnet ef database update

# BillingService
cd ../../BillingService/BillingService
dotnet ef database update

# ManagementService
cd ../../ManagementService/ManagementService
dotnet ef database update

This will create 6 databases with all required tables.

STEP 3: START BACKEND SERVICES (7 terminals)
---------------------------------------------

Terminal 1 - AuthService:
  cd Backend/Services/AuthService/AuthService
  dotnet run
  Wait for: "Now listening on: https://localhost:5001"

Terminal 2 - GuestService:
  cd Backend/Services/GuestService/GuestService
  dotnet run
  Wait for: "Now listening on: https://localhost:5002"

Terminal 3 - RoomService:
  cd Backend/Services/RoomService/RoomService
  dotnet run
  Wait for: "Now listening on: https://localhost:5003"

Terminal 4 - ReservationService:
  cd Backend/Services/ReservationService/ReservationService
  dotnet run
  Wait for: "Now listening on: https://localhost:5004"

Terminal 5 - BillingService:
  cd Backend/Services/BillingService/BillingService
  dotnet run
  Wait for: "Now listening on: https://localhost:5005"

Terminal 6 - ManagementService:
  cd Backend/Services/ManagementService/ManagementService
  dotnet run
  Wait for: "Now listening on: https://localhost:5006"

Terminal 7 - API Gateway:
  cd Backend/ApiGateway/ApiGateway
  dotnet run
  Wait for: "Now listening on: https://localhost:5000"

STEP 4: START FRONTEND
-----------------------
Open a new terminal:

cd Frontend/hotel-management-ui
npm install
npm start

Browser will automatically open to: http://localhost:3000

STEP 5: CREATE INITIAL USER
----------------------------
Before you can login, create at least one user:

Option A: Use Swagger UI
  1. Navigate to https://localhost:5001/swagger
  2. Accept HTTPS certificate warning
  3. Use POST /api/users endpoint
  4. Create user with JSON:
     {
       "username": "admin",
       "password": "Admin@123",
       "role": "Owner"
     }

Option B: Use curl
  curl -k -X POST https://localhost:5001/api/users \
    -H "Content-Type: application/json" \
    -d '{"username":"admin","password":"Admin@123","role":"Owner"}'

STEP 6: LOGIN & USE
--------------------
1. Go to http://localhost:3000
2. Login with credentials you created
3. Start using the system!

================================================================================
ROLE-BASED ACCESS CONTROL
================================================================================

Three roles with different permissions:

OWNER (Full Access)
  ✓ All features including Departments

MANAGER (Most Features)
  ✓ Guests, Rooms, Reservations, Bills, Payments, Rates, Staff, Inventory, Users
  ✗ Departments

RECEPTIONIST (Front Desk Operations)
  ✓ Guests, Room Search, Reservations, Bills
  ✗ Room Management, Payments, Rates, Staff, Inventory, Departments, Users

================================================================================
API DOCUMENTATION
================================================================================

Each service has Swagger documentation:

https://localhost:5001/swagger - AuthService (Users, Login)
https://localhost:5002/swagger - GuestService (Guests)
https://localhost:5003/swagger - RoomService (Rooms, RoomTypes, Rates)
https://localhost:5004/swagger - ReservationService (Reservations)
https://localhost:5005/swagger - BillingService (Bills, Payments)
https://localhost:5006/swagger - ManagementService (Staff, Inventory, Departments)

API Gateway routes all requests through: https://localhost:5000

================================================================================
TROUBLESHOOTING
================================================================================

PROBLEM: Services won't start
SOLUTION: 
  - Check ports 5000-5006 and 3000 are not in use
  - Verify .NET 8.0 SDK is installed: dotnet --version
  - Check for error messages in terminal

PROBLEM: Database connection errors
SOLUTION:
  - Verify SQL Server is running
  - Check connection strings match your SQL Server configuration
  - Verify SQL Server authentication is enabled
  - Test connection: sqlcmd -S localhost -U sa -P YourPassword

PROBLEM: "A network-related or instance-specific error"
SOLUTION:
  - SQL Server not running
  - Wrong server name in connection string
  - Firewall blocking port 1433

PROBLEM: JWT authentication errors / 401 Unauthorized
SOLUTION:
  - Ensure SAME JWT key in ALL appsettings.json files
  - Check JWT key is at least 32 characters
  - Try creating a new user and logging in again

PROBLEM: CORS errors in browser
SOLUTION:
  - Verify API Gateway is running on port 5000
  - Check browser console for exact error
  - Accept HTTPS certificate warnings

PROBLEM: "Unable to find migrations"
SOLUTION:
  - Run: dotnet ef migrations add InitialCreate
  - Then: dotnet ef database update

PROBLEM: Frontend can't connect to backend
SOLUTION:
  - Check .env file has: REACT_APP_API_URL=https://localhost:5000
  - Verify API Gateway is running
  - Check browser console for errors
  - Accept HTTPS certificate warnings

PROBLEM: Port already in use
SOLUTION:
  - Find and kill process: lsof -i :<port> (macOS/Linux)
  - Or change port in launchSettings.json

================================================================================
TESTING THE SYSTEM
================================================================================

Quick Test Workflow:

1. Login with Owner credentials

2. Create a Guest:
   - Navigate to "Guests" in sidebar
   - Click "+ Add Guest"
   - Fill form and submit

3. Create Room Type:
   - Navigate to "Rooms" → "Room Types" tab
   - Click "+ Add Room Type"
   - Example: "Deluxe Suite"

4. Create Room:
   - "Rooms" → "Rooms" tab
   - Click "+ Add Room"
   - Select room type created above

5. Search Availability:
   - Navigate to "Room Search"
   - Select dates and guest count
   - View available rooms with pricing

6. Create Reservation:
   - Navigate to "Reservations"
   - Click "+ New Reservation"
   - Select guest, room, dates

7. Create Bill:
   - Navigate to "Bills"
   - Click "+ Create Bill"
   - Add line items (e.g., "Room Charge", "Minibar")
   - Watch automatic total calculation

8. Record Payment:
   - Navigate to "Payments"
   - Click "+ Record Payment"
   - Select bill and enter payment details

================================================================================
DATABASE SCHEMA
================================================================================

6 Databases Created:

1. HotelAuthDb
   - Users (authentication)

2. HotelGuestDb
   - Guests

3. HotelRoomDb
   - Rooms
   - RoomTypes
   - Rates

4. HotelReservationDb
   - Reservations

5. HotelBillingDb
   - Bills
   - BillItems
   - Payments

6. HotelManagementDb
   - Staff
   - Inventory
   - Departments

================================================================================
ARCHITECTURE NOTES
================================================================================

Microservices Pattern:
- Each service has its own database (database per service pattern)
- Services are independent and can be deployed separately
- Communication via REST APIs
- API Gateway provides single entry point

Security:
- JWT tokens for authentication
- BCrypt for password hashing
- Role-based authorization
- HTTPS for all communications

Frontend:
- Single Page Application (SPA)
- Component-based architecture
- Centralized state management with Context API
- Responsive design

================================================================================
DEVELOPMENT NOTES
================================================================================

- This is a development setup with self-signed HTTPS certificates
- For production:
  * Use environment variables for secrets
  * Use proper SSL certificates
  * Implement proper logging and monitoring
  * Add rate limiting
  * Consider containerization (Docker)
  * Set up CI/CD pipeline

- All passwords shown in this README are examples only
- Never commit real credentials to version control
- Use strong passwords in production environments

================================================================================
FILE STRUCTURE NOTES
================================================================================

What's Included:
✓ All source code (.cs files)
✓ Project files (.csproj)
✓ Configuration files (appsettings.json)
✓ EF Core migrations
✓ React source code
✓ Package manifests (package.json)
✓ Frontend styles (CSS)
✓ API route configuration (ocelot.json)

What's Excluded (can be regenerated):
✗ node_modules (run: npm install)
✗ bin/obj folders (dotnet restores these)
✗ Build artifacts
✗ IDE-specific files
✗ Documentation markdown files

================================================================================
SUPPORT
================================================================================

For issues during setup:
1. Check error messages in terminal/console
2. Verify all configuration steps completed
3. Check Swagger documentation for API endpoints
4. Review browser console for frontend errors
5. Ensure all services are running before testing

================================================================================
VERSION INFORMATION
================================================================================

Project Version: 1.0
Created: October 2026
Framework: .NET 8.0
React: 18.2.0
Database: SQL Server

================================================================================
LICENSE & USAGE
================================================================================

This is a submission project for educational/evaluation purposes.

================================================================================
