# 🧾 CRUD project of customers 

This project is an web interface that allows to manage an Customer database (name, age, email) through CRUD operations (Create, Read, Update, Delete). This project was implemented on PHP,MySQL,HTML,CSS,JS and designed to be easily executed on your localhost.

---

## 🚀 Requirements

Before execute the project, be sure to have the following stack:
- PHP >= 8.0 (preferably 8.3.6)
- MySQL versión 8.0.42
- Composer (to use PHPSpreadsheet)
- Local server like:
  - use `php -S localhost:8000`

---

## 🚀 Intalations steps

Before execute the project, be sure to have installed the following:

1) Install php 8.3.6
```ssh
sudo apt install -y php8.3 php8.3-cli php8.3-mbstring php8.3-xml php8.3-curl php8.3-zip php8.3-mysql php8.3-gd php8.3-common
```
   check the version with
```ssh
php -v
```
2) Install Composer in the project directory
```ssh
composer init
```
3) Install phpspreadsheet 
```ssh
composer require phpoffice/phpspreadsheet
```
4) Install MySQL
```ssh
sudo apt install -y mysql-server
```
  verify the version
```ssh
mysql --version
```
5) Config root 
Must change the password to "naohchan"
```ssh
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'tu_clave';
FLUSH PRIVILEGES;
EXIT;
```
and then you should be ready to go!
---

## 📦 Project structure

```plaintext
/
├── api/
│   ├── age_stats.php
│   ├── create.php
│   ├── delete.php
│   ├── table.php
│   ├── total.php
│   └── updates.php
├── assets/              # Files CSS, JS
│   ├── css/
│   │   ├── index_styles.css
│   │   └── styles.css
│   └── js/
│   │   └── script.js
├── includes/              # files to manage db
│   ├── conection.php
│   ├── credentials.php
│   └── init_database.php
├── index.php         # First page
├── export.php        
├── crud.php          # Interface
└── README.md
```
## Discussion

● What parts of the stack were familiar to you?

I was already familiar with PHP, MySQL, and the basic structure of a full-stack system thanks to a previous project I developed called SmartKiosk, where I used Android for the front end and PHP + MySQL for managing the backend orders. That experience gave me a good foundation for server-side scripting, database interactions, and basic API flows.

● What was new?

This time, I wanted to go back to the basics and focus on a purely PHP-based web project to refresh and strengthen my skills in HTML, CSS, and JavaScript. I took the opportunity to use Bootstrap for styling, which I hadn’t used extensively before, and also learned how to implement PHPSpreadsheet — a powerful library to generate downloadable Excel files with filtered data from the database.

● What did you learn while doing this project?

How to build a structured, user-friendly CRUD web app using only PHP and standard front-end technologies.

How to integrate AJAX to handle CRUD operations asynchronously for a smoother user experience.

How to use Composer and install dependencies properly in a PHP project.

How to work with PHPSpreadsheet to generate dynamic Excel exports.

And finally, how to polish the UI using Bootstrap components to make the project responsive and clean.
