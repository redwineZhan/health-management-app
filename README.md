# Health Management App (HealthTrack Pro)

A comprehensive health management application that helps users track their body metrics, manage weight loss through traditional Chinese medicine approaches, and participate in community health training programs.

## Features

1. **Body Metrics Tracking**: Track standard medical indicators like blood pressure, heart rate, BMI, blood sugar, cholesterol levels, etc.
2. **Weight Loss Guidance**: Traditional Chinese medicine approach with daily habit tracking and nutritional guidance
3. **Community Training Programs**: Weekly health management groups for sharing knowledge and staying motivated

## Tech Stack

- **Frontend**: React.js with Redux Toolkit, Tailwind CSS, Chart.js
- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT with refresh tokens
- **Validation**: Joi
- **Testing**: Jest

## Project Structure

```
health-management-app/
├── db/
│   ├── config/
│   │   └── database.js
│   └── init.sql
├── middleware/
│   └── auth.js
├── controllers/
├── routes/
│   └── api/
├── services/
├── utils/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── store/
│   │   ├── styles/
│   │   └── services/
├── .env.example
├── .gitignore
├── Dockerfile
├── docker-compose.yml
├── package.json
└── server.js
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd health-management-app
```

2. Install backend dependencies:
```bash
npm install
```

3. Navigate to client directory and install frontend dependencies:
```bash
cd client
npm install
```

4. Create a `.env` file in the root directory based on `.env.example`:
```bash
cp .env.example .env
```

5. Set up the database:
   - Make sure PostgreSQL is running
   - Update database credentials in `.env`
   - The database tables will be created automatically on first run

### Running the Application

1. Start the backend server:
```bash
npm run dev
```

2. In a new terminal, start the frontend:
```bash
cd client
npm start
```

The application will be available at `http://localhost:3000`.

### Docker Setup (Alternative)

If you prefer using Docker:

1. Make sure Docker and Docker Compose are installed
2. Run the following command:
```bash
docker-compose up
```

The application will be available at `http://localhost:5000` (backend) and `http://localhost:3000` (frontend).

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `POST /api/auth/logout` - Logout a user
- `POST /api/auth/refresh` - Refresh access token

### Health Metrics
- `GET /api/health` - Get all health metrics for the user
- `POST /api/health` - Create a new health metric
- `GET /api/health/:id` - Get a specific health metric
- `PUT /api/health/:id` - Update a health metric
- `DELETE /api/health/:id` - Delete a health metric
- `GET /api/health/trends` - Get health trends for the user

### Weight Loss Plans
- `GET /api/weight-loss/plans` - Get all weight loss plans for the user
- `POST /api/weight-loss/plans` - Create a new weight loss plan
- `GET /api/weight-loss/plans/:id` - Get a specific plan
- `PUT /api/weight-loss/plans/:id` - Update a plan
- `DELETE /api/weight-loss/plans/:id` - Delete a plan

### Habit Tracking
- `GET /api/habits` - Get all habit logs for the user
- `POST /api/habits` - Create a new habit log
- `GET /api/habits/:id` - Get a specific log
- `PUT /api/habits/:id` - Update a log
- `DELETE /api/habits/:id` - Delete a log

### Communities
- `GET /api/communities` - Get all communities
- `POST /api/communities` - Create a new community
- `GET /api/communities/:id` - Get a specific community
- `PUT /api/communities/:id` - Update a community
- `DELETE /api/communities/:id` - Delete a community
- `POST /api/communities/:id/join` - Join a community
- `DELETE /api/communities/:id/leave` - Leave a community

### Community Posts
- `GET /api/posts` - Get all posts (filterable by community)
- `POST /api/posts` - Create a new post
- `GET /api/posts/:id` - Get a specific post
- `PUT /api/posts/:id` - Update a post
- `DELETE /api/posts/:id` - Delete a post

### Alerts
- `GET /api/alerts` - Get user's health alerts
- `GET /api/alerts/latest` - Get latest health alerts

## Security Features

- JWT-based authentication with refresh tokens
- Passwords hashed using bcrypt
- Input validation using Joi
- Rate limiting to prevent abuse
- SQL injection prevention through parameterized queries
- CORS configured for security
- Helmet.js for HTTP header security

## Health Data Management

The application focuses on securely storing and managing sensitive health data with the following considerations:

- All health data is associated with authenticated users
- Data is stored in an encrypted database
- Regular backups are recommended
- Compliance with health data regulations (HIPAA/GDPR) requires additional implementation

## TCM Integration

The application includes Traditional Chinese Medicine approaches to health and wellness:

- Dietary recommendations based on TCM principles
- Herbal remedy suggestions (with proper disclaimers)
- Mindfulness and wellness practices
- Seasonal health adjustments

## Community Features

Users can join health-focused communities to share experiences and stay motivated:

- Create or join health challenges
- Share achievements and milestones
- Discuss health topics and tips
- Participate in virtual workshops

## Testing

To run tests:
```bash
npm test
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by modern health tracking applications
- Incorporates principles from Traditional Chinese Medicine
- Built with modern web technologies for optimal user experience
```

## Issues and Support

For support, please open an issue in the repository or contact the development team.

The HealthTrack Pro application is designed to empower users to take control of their health through data tracking, evidence-based recommendations, and community support.