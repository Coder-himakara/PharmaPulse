## Environment Configuration

This project uses environment-specific configuration files:

- `.env.development` - Template for development environment
- `.env.production` - Template for production environment

### Local Development

To customize your local environment:

1. Copy `.env.development` to `.env.development.local`
2. Make your changes in the .local file (this file is ignored by git)

### Production Deployment

For production deployment:

1. Copy `.env.production` to `.env.production.local` for local testing
2. Update environment variables in your hosting dashboard (Vercel, Netlify, etc.)