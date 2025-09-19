# 🛠️ Development Guide

This guide will help you get started with developing Imoya Flow.

## 🚀 Quick Start

### Prerequisites

- **Node.js 20+** - [Download here](https://nodejs.org/)
- **pnpm 8+** - Install with `npm install -g pnpm`
- **PostgreSQL 16+** - [Download here](https://www.postgresql.org/download/) or use Docker
- **Git** - [Download here](https://git-scm.com/)

### Setup

1. **Clone and install**
   ```bash
   git clone https://github.com/ImoyaFlowAI/imoya-flow.git
   cd imoya-flow
   pnpm install
   ```

2. **Start the database**
   ```bash
   # Using Docker (recommended)
   docker compose up -d
   
   # Or start PostgreSQL locally
   # Make sure it's running on port 5432
   ```

3. **Configure environment**
   ```bash
   cp env.example .env
   # Edit .env with your settings
   ```

4. **Setup the database**
   ```bash
   cd apps/backend
   pnpm prisma generate
   pnpm prisma migrate dev
   pnpm prisma:seed
   ```

5. **Start development**
   ```bash
   # From the root directory
   pnpm dev
   ```

## 📁 Project Structure

```
imoya-flow/
├── apps/
│   ├── backend/                 # NestJS API server
│   │   ├── src/
│   │   │   ├── common/         # Shared types and utilities
│   │   │   ├── compiler/       # Form to n8n workflow compiler
│   │   │   ├── forms/          # Form management
│   │   │   ├── n8n/            # n8n integration
│   │   │   ├── prisma/         # Database service
│   │   │   └── webhooks/       # Webhook handling
│   │   ├── prisma/             # Database schema and migrations
│   │   └── package.json
│   └── frontend/                # Vue 3 frontend app
│       ├── src/
│       │   ├── components/     # Vue components
│       │   ├── services/       # API client
│       │   ├── stores/         # Pinia stores
│       │   ├── types/          # TypeScript types
│       │   └── views/          # Page components
│       └── package.json
├── scripts/                     # Setup and utility scripts
├── .github/workflows/          # CI/CD configuration
└── docs/                       # Documentation
```

## 🔧 Development Commands

### Backend (NestJS)

```bash
cd apps/backend

# Development
pnpm dev                    # Start with hot reload
pnpm build                  # Build for production
pnpm start                  # Start production build

# Database
pnpm prisma:generate        # Generate Prisma client
pnpm prisma:migrate         # Create new migration
pnpm prisma:studio          # Open Prisma Studio
pnpm prisma:seed            # Seed database

# Testing
pnpm test                   # Run tests
pnpm test:watch             # Run tests in watch mode
pnpm test:cov               # Run tests with coverage
```

### Frontend (Vue 3)

```bash
cd apps/frontend

# Development
pnpm dev                    # Start with hot reload
pnpm build                  # Build for production
pnpm preview                # Preview production build

# Code Quality
pnpm lint                   # Lint code
pnpm type-check             # Type check
```

### Root Commands

```bash
# From the root directory

# Development
pnpm dev                    # Start all apps in development mode
pnpm build                  # Build all apps
pnpm test                   # Run all tests
pnpm lint                   # Lint all code
pnpm type-check             # Type check all code

# Database
pnpm db:generate            # Generate Prisma client
pnpm db:migrate             # Run migrations
pnpm db:seed                # Seed database
```

## 🗄️ Database

### Schema

The database uses PostgreSQL with Prisma ORM. Key models:

- **Tenant** - Multi-tenant support
- **Form** - Form definitions and metadata
- **Automation** - Automation rules and configurations
- **CompiledWorkflow** - Generated n8n workflows
- **Credential** - Encrypted API credentials
- **RunSummary** - Execution logs and results

### Migrations

```bash
# Create a new migration
cd apps/backend
pnpm prisma migrate dev --name your_migration_name

# Apply migrations
pnpm prisma migrate deploy

# Reset database (development only)
pnpm prisma migrate reset
```

### Seeding

```bash
# Seed with sample data
cd apps/backend
pnpm prisma:seed
```

## 🔌 API Endpoints

### Forms

- `POST /forms` - Create/update form
- `GET /forms/:id` - Get form by ID
- `POST /forms/compile` - Compile form to n8n workflow
- `POST /forms/:id/push-to-n8n` - Push workflow to n8n
- `GET /forms/:id/runs` - Get execution logs

### Webhooks

- `POST /webhooks/:path` - Receive form submissions

## 🎨 Frontend Architecture

### State Management

Uses Pinia for state management with the following stores:

- **forms** - Form builder state and actions
- **templates** - Template management (future)
- **auth** - Authentication (future)

### Components

- **FormBuilder** - Drag-and-drop form builder
- **AutomationWizard** - Automation configuration
- **Templates** - Template gallery

### Styling

- **Tailwind CSS** - Utility-first CSS framework
- **Custom components** - Reusable UI components
- **Responsive design** - Mobile-first approach

## 🧪 Testing

### Backend Testing

```bash
cd apps/backend
pnpm test                   # Unit tests
pnpm test:e2e              # End-to-end tests
pnpm test:cov              # Coverage report
```

### Frontend Testing

```bash
cd apps/frontend
pnpm test                   # Unit tests
pnpm test:e2e              # End-to-end tests
```

## 🚀 Deployment

### Environment Variables

Required environment variables:

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/imoya_flow"

# n8n Integration
N8N_BASE_URL="https://your-n8n-instance.com"
N8N_API_KEY="your-api-key"

# Security
WEBHOOK_SIGNING_SECRET="your-secret-key"

# Frontend
VITE_API_URL="http://localhost:4000"
```

### Production Build

```bash
# Build all apps
pnpm build

# Start production
pnpm start
```

### Docker Deployment

```bash
# Build images
docker build -t imoya-flow-backend ./apps/backend
docker build -t imoya-flow-frontend ./apps/frontend

# Run with docker-compose
docker compose -f docker-compose.prod.yml up -d
```

## 🤝 Contributing

### Code Style

- **TypeScript** - Strict mode enabled
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Conventional Commits** - Commit message format

### Git Workflow

1. **Fork** the repository
2. **Create** a feature branch
3. **Make** your changes
4. **Add** tests for new features
5. **Commit** with conventional commits
6. **Push** to your fork
7. **Create** a pull request

### Pull Request Guidelines

- Clear description of changes
- Link to related issues
- Include tests for new features
- Update documentation as needed
- Ensure CI passes

## 🐛 Debugging

### Backend Debugging

```bash
# Start with debugger
cd apps/backend
pnpm start:debug

# View logs
pnpm logs
```

### Frontend Debugging

```bash
# Start with dev tools
cd apps/frontend
pnpm dev

# Build with source maps
pnpm build
```

### Database Debugging

```bash
# Open Prisma Studio
cd apps/backend
pnpm prisma:studio

# View database logs
docker logs imoya_flow_db
```

## 📚 Additional Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [Vue 3 Documentation](https://vuejs.org/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [n8n Documentation](https://docs.n8n.io/)

## 🆘 Getting Help

- 📖 Check the [documentation](https://docs.imoyaflow.ai)
- 🐛 [Report issues](https://github.com/ImoyaFlowAI/imoya-flow/issues)
- 💬 [Join discussions](https://github.com/ImoyaFlowAI/imoya-flow/discussions)
- 📧 [Email support](mailto:support@imoyaflow.ai)

---

**Happy coding! 🚀**
