# Ecommerce Spring Boot Application

This project is an Ecommerce application built with Next.js.

## Prerequisites

Before you begin, ensure you have the following installed on your local machine:

- Node.js
- Npm
- **Git**: [Download Git](https://git-scm.com/downloads)
- **Postgresql Database**: Make sure you have installed Postgres database and the server is running.

## Clone the Repository

```bash
-git clone https://github.com/SawLinThant/DigitalMarketplace.git
-cd DigitalMarketplace
```

## Zip file version

- Unzip the project file
- change directory to the main project folder

## Setting up Environment File

create **'.env'** in project root directory

Setup these environment variables along with thier values in your **'.env'** file

- **DATABASE_URL**
- **NEXTAUTH_SECRET**
- **NEXTAUTH_URL**
- **DISCORD_CLIENT_ID**
- **DISCORD_CLIENT_SECRET**
- **UPLOADTHING_SECRET**
- **UPLOADTHING_APP_ID**
- **STRIPE_SECRET_KEY**
- **STRIPE_WEBHOOK_SECRET**
- **S3_UPLOAD_BUCKET**
- **S3_UPLOAD_KEY**
- **S3_UPLOAD_REGION**
- **S3_UPLOAD_SECRET**

## Installing Dependencies

run this command to install necessary dependencies

```bash
-npm install
```

run this command to migrate database schema to your database

```bash
-npx prisma migrate dev
```

## Running the Project

If all above requirements are met, you can start running your project.


```bash
-npm run dev
```

Then, Access the application by navigating to **'http://localhost:3000'**

## Demo App
Access my demoapp at 'https://digital-marketplace-peach-omega.vercel.app'
