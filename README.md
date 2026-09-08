# Hisab-Kitab 💰

A simple, responsive expense tracker web application that helps users manage their personal finances — set a monthly budget, log expenses by category, and visualize spending with an interactive chart.

## 📱 Overview

Hisab-Kitab lets users sign up, set up their profile and monthly budget, and track their day-to-day expenses. The dashboard shows remaining balance, current and previous month spending, and a category-wise breakdown of expenses in a pie chart.

This project was built purely for **learning purposes** — to understand how a web application works end to end, how the front end connects to a backend, and how user data is stored and retrieved in real time.

## ✨ Features

- **User authentication** — signup, login, and OTP verification
- **Profile setup** — name, age, and monthly budget
- **Expense tracking** — add expenses with a note, amount, and category (Food, Rent, Entertainment, Transport, Other)
- **Dashboard stats** — remaining balance, this month's spending, and last month's spending at a glance
- **Visual insights** — category-wise spending shown as an interactive pie chart
- **Expense history** — view, edit, and delete past expenses
- **Account management** — update profile details and change password
- **Light / dark theme** toggle with preference saved locally
- **Responsive design** — works across desktop and mobile

## 🛠️ Built With

- **HTML5 & CSS3** — structure, glassmorphism UI, and responsive styling
- **JavaScript (ES Modules)** — application logic
- **Firebase Realtime Database** — user data and expense storage
- **Chart.js** — pie chart visualization

## 🚀 Getting Started

1. Clone the repository: git clone https://github.com/Ashut0sh-Ghimire/mobileappdevelopment.git
2. Open the project folder.
3. Create a Firebase project and add your own config in `script.js` (replace the `firebaseConfig` object with your Firebase project's credentials).
4. Open `index.html` in a browser, or serve it with a local server (e.g. VS Code Live Server).

## 📖 How It Works

1. **Sign up** with an email and password, then verify via OTP.
2. **Set up your profile** — enter your name, age, and monthly budget.
3. **Add expenses** from the dashboard, tagged by category.
4. **Track your spending** through live stats and a category pie chart.
5. **Manage your data** — review expense history, edit or delete entries, update your profile, or change your password.

## 🔒 Known Limitations & Future Improvements

As a learning project, the focus was on understanding web app structure and data storage rather than production-level security. Planned improvements include:

- Migrate authentication to **Firebase Authentication** (passwords are currently stored directly, which is not production-safe)
- Implement real OTP verification via email/SMS (currently a placeholder)
- Add proper **Firebase Security Rules** to restrict database access per user
- Add server-side validation and secure session handling

## 👤 Author

**Ashutosh Ghimire**
- GitHub: [@Ashut0sh-Ghimire](https://github.com/Ashut0sh-Ghimire)
- LinkedIn: [Ashutosh Ghimire](https://www.linkedin.com/in/ashutosh-ghimire-8546b5392/)
