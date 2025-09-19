# 🌬️ Imoya Flow

**Where data moves like air** - Simple forms meet powerful automation.

Imoya Flow is an open-source platform that combines the simplicity of form builders with the power of workflow automation engines. Build forms as easy as breathing, then watch your data flow through powerful workflows automatically.

## ✨ Features

- **🎨 Drag & Drop Form Builder** - Create beautiful forms with our intuitive interface
- **⚡ Powerful Automation** - Connect to 500+ apps and services automatically
- **🤖 AI-Powered** - Describe what you want in plain English
- **🔒 Secure by Design** - Built with security and privacy in mind
- **🌍 Open Source** - Transparent, community-driven development

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- pnpm 8+
- PostgreSQL 16+
- Docker (optional, for database)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ImoyaFlowAI/imoya-flow.git
   cd imoya-flow
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up the database**
   ```bash
   # Using Docker (recommended)
   docker compose up -d
   
   # Or install PostgreSQL locally and create a database
   createdb imoya_flow
   ```

4. **Configure environment**
   ```bash
   cp env.example .env
   # Edit .env with your settings
   ```

5. **Set up the database schema**
   ```bash
   cd apps/backend
   pnpm prisma generate
   pnpm prisma migrate dev
   ```

6. **Start the development servers**
   ```bash
   # From the root directory
   pnpm dev
   ```

This will start:
- Backend API on http://localhost:4000
- Frontend app on http://localhost:3000

## 🏗️ Architecture

Imoya Flow is built as a monorepo with the following structure:

```
imoya-flow/
├── apps/
│   ├── backend/          # NestJS API server
│   └── frontend/         # Vue 3 frontend app
├── packages/             # Shared packages (future)
└── docs/                 # Documentation
```

### Tech Stack

**Backend:**
- NestJS (Node.js framework)
- TypeScript
- PostgreSQL with Prisma ORM
- n8n integration for workflow execution

**Frontend:**
- Vue 3 with Composition API
- TypeScript
- Tailwind CSS
- Pinia for state management

## 📖 Usage

### Creating Your First Form

1. **Start the application** and navigate to http://localhost:3000
2. **Click "Create Form"** to open the form builder
3. **Add fields** using the drag-and-drop interface
4. **Configure automations** like sending emails or updating sheets
5. **Publish** your form to generate the n8n workflow
6. **Share** your form URL with users

### Available Automations

- **Send Email** - Send confirmation or notification emails
- **Add to Google Sheet** - Append form data to spreadsheets
- **Send Slack Message** - Notify teams via Slack
- **Conditional Logic** - Run automations based on form data

### Templates

We provide several pre-built templates to get you started:

- **Lead Capture Form** - Collect leads with follow-up automation
- **Contact Us Form** - Handle customer inquiries
- **Event Registration** - Manage event signups
- **Customer Feedback** - Gather and process feedback

## 🔧 Development

### Backend Development

```bash
cd apps/backend
pnpm dev          # Start with hot reload
pnpm test         # Run tests
pnpm prisma:studio # Open Prisma Studio
```

### Frontend Development

```bash
cd apps/frontend
pnpm dev          # Start with hot reload
pnpm build        # Build for production
pnpm preview      # Preview production build
```

### Database Management

```bash
cd apps/backend
pnpm prisma:migrate    # Create new migration
pnpm prisma:generate   # Generate Prisma client
pnpm prisma:seed       # Seed database with sample data
```

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes**
4. **Add tests** for new functionality
5. **Commit your changes** (`git commit -m 'Add amazing feature'`)
6. **Push to the branch** (`git push origin feature/amazing-feature`)
7. **Open a Pull Request**

### Development Guidelines

- Follow the existing code style and patterns
- Write tests for new features
- Update documentation as needed
- Use conventional commits for commit messages

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌍 About the Name

**Imoya** (from isiXhosa/isiZulu) means *air, spirit, or breath*. It reflects our mission: making automation as natural and effortless as air.

## 🙏 Acknowledgments

- Inspired by the simplicity of Jotform
- Built on the power of n8n
- Enhanced with AI capabilities from Flowise
- Community-driven and open source

## 📞 Support

- 📖 [Documentation](https://docs.imoyaflow.ai)
- 🐛 [Report Issues](https://github.com/ImoyaFlowAI/imoya-flow/issues)
- 💬 [Discussions](https://github.com/ImoyaFlowAI/imoya-flow/discussions)
- 📧 [Email Support](mailto:support@imoyaflow.ai)

---

**Made with ❤️ by the Imoya Flow team**
