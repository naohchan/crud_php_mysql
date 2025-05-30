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
