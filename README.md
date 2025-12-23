# Campaign Scheduler

A Node.js based Campaign Scheduler Service that allows scheduling, execution, and runtime management of campaign tasks using `node-cron` and Redis.

## Features

- **Campaign Scheduling**: Schedule campaigns to run at specific intervals using Cron expressions.
- **Runtime Updates**: Update schedule intervals dynamically without restarting the server.
- **Persistence**: Schedules are persisted in Redis, ensuring they survive application restarts.
- **Management API**: simple REST API to create, view, update, and delete schedules.
- **Scalable Architecture**: Built with Express.js and separation of concerns (Controllers, Services, Routes).

## Prerequisites

- Node.js (v14+ recommended)
- Redis Server (local or cloud)

## Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/ChAsif171/campaign-scheduler.git
    cd campaign-scheduler
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Configure Environment Variables:
    Create a `.env` file in the root directory (or ensure it exists) with the following variables:
    ```env
    PORT=3000
    NODE_ENV=development
    REDIS_HOST=127.0.0.1
    REDIS_PORT=6379
    REDIS_PASSWORD=your_redis_password_if_any
    ```

## Usage

### Starting the Server

```bash
# Development mode
npm run dev

# Production
npm start
```

### API Endpoints

Base URL: `http://localhost:3000/api/v1`

#### 1. Create a Schedule
**POST** `/schedule`

Body:
```json
{
    "campaignId": "camp-101",
    "cronExpression": "*/15 * * * *", 
    "taskData": {
        "name": "Promo Email",
        "templateId": "tmpl_123"
    }
}
```

#### 2. Get All Schedules
**GET** `/schedules`

Query Params (Optional):
- `campaignId`: Filter by specific campaign ID

Response:
```json
{
    "success": true,
    "data": [
        {
            "campaignId": "camp-101",
            "cronExpression": "*/15 * * * *",
            "lastUpdated": "2025-12-23T10:00:00.000Z",
            "isActive": true
        }
    ]
}
```

#### 3. Update Schedule
**PUT** `/schedule/:campaignId`

Body:
```json
{
    "cronExpression": "0 10 * * *"
}
```

#### 4. Delete Schedule
**DELETE** `/schedule/:campaignId`

## Project Structure

```
├── src
│   ├── config          # Configuration (Redis, Environment)
│   ├── constants       # Global constants
│   ├── controllers     # Request handlers
│   ├── jobs            # Scheduler service and logic
│   ├── middlewares     # Express middlewares
│   ├── routes          # API route definitions
│   └── utils           # Utilities (Logger, Error Handling)
├── index.js            # App entry point
└── README.md           # Documentation
```
