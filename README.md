# CSV-BE

# Project Setup

## Prerequisites
Make sure you have the following installed:
- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/) (if applicable)
- [MongoDB](https://www.mongodb.com/) (if applicable)

## 1. Install MongoDB
For Debian/Ubuntu:
```sh
sudo apt update
sudo apt install -y mongodb
```
For macOS (using Homebrew):
```sh
brew tap mongodb/brew
brew install mongodb-community@6.0
```
For Windows:
Download and install from [MongoDB's official website](https://www.mongodb.com/try/download/community).

## 2. Clone the Repository
```sh
git clone https://github.com/richardhsss/CSV-BE.git
cd CSV-BE
```

## 3. Install Dependencies
```sh
yarn install
```

## 4. Set Up Environment Variables
Create a `.env` file and configure the required environment variables:
```sh
cp .env.sample .env
```

## 5. Run the Backend
Make sure MongoDB is running, then start the backend server:
```sh
yarn start
```
