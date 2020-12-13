# Requirement:
- Docker installed or Local postgres, redis
- Npm, Nodejs installed
- Sequelize cli installed
# Step:
- Prepare env:
    - Setup and Start Postgres Local(user: postgres, pass: postgres, db: web) and Redis
    - Or run `docker-compose up -d`
    
- Run sequelize migrate: `sequelize db:migrate`
- Run code: `npm run dev`