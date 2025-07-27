# Docker Setup for PostgreSQL

This directory contains Docker configuration for running PostgreSQL database for the Pokemon Test application.

## Quick Start

1. **Start the PostgreSQL database:**
   ```bash
   docker-compose up -d postgres
   ```

2. **Start both PostgreSQL and pgAdmin:**
   ```bash
   docker-compose up -d
   ```

3. **Stop the services:**
   ```bash
   docker-compose down
   ```

## Services

### PostgreSQL Database
- **Port:** 5432
- **Database:** pokemon_test
- **Username:** pokemon_user
- **Password:** pokemon_password
- **Connection URL:** `postgresql://pokemon_user:pokemon_password@localhost:5432/pokemon_test`

### pgAdmin (Database Management UI)
- **URL:** http://localhost:5050
- **Email:** admin@pokemon-test.com
- **Password:** admin123

## Environment Variables

Copy `.env.example` to `.env` and update the values as needed:

```bash
cp .env.example .env
```

## Database Initialization

The `init-scripts/` directory contains SQL scripts that run when the PostgreSQL container starts for the first time. These scripts:

- Create useful PostgreSQL extensions
- Set up sample tables for users and pokemon
- Insert sample data

## Connecting from NestJS

Make sure your NestJS application uses these environment variables:

```typescript
// Example TypeORM configuration
{
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT) || 5432,
  username: process.env.DATABASE_USER || 'pokemon_user',
  password: process.env.DATABASE_PASSWORD || 'pokemon_password',
  database: process.env.DATABASE_NAME || 'pokemon_test',
  autoLoadEntities: true,
  synchronize: process.env.NODE_ENV === 'development',
}
```

## Useful Docker Commands

```bash
# View logs
docker-compose logs postgres
docker-compose logs pgadmin

# Access PostgreSQL directly
docker exec -it pokemon-test-postgres psql -U pokemon_user -d pokemon_test

# Backup database
docker exec pokemon-test-postgres pg_dump -U pokemon_user pokemon_test > backup.sql

# Restore database
docker exec -i pokemon-test-postgres psql -U pokemon_user -d pokemon_test < backup.sql

# Remove volumes (will delete all data!)
docker-compose down -v
```

## Production Notes

For production deployment:

1. Change default passwords in `.env`
2. Use Docker secrets for sensitive data
3. Set up proper backup strategies
4. Consider using managed PostgreSQL services
5. Remove pgAdmin or secure it properly
6. Use SSL/TLS connections
