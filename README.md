# 🧾 Proyecto CRUD de Clientes

Este proyecto es una interfaz web sencilla que permite gestionar una base de datos de clientes (nombre, edad, email) mediante operaciones **CRUD**: Crear, Leer, Actualizar y Eliminar. Implementado en **PHP**, **MySQL**, **HTML/CSS/JS** y diseñado para ser fácil de ejecutar localmente.

---

## 🚀 Requisitos

Antes de ejecutar el proyecto, asegúrate de tener lo siguiente instalado:

- PHP >= 8.0
- MySQL Server
- Navegador Web
- Composer (opcional, si usas librerías como PHPSpreadsheet)
- Servidor local como:
  - [XAMPP](https://www.apachefriends.org/) (Windows/Mac/Linux)
  - o usar `php -S localhost:8000`

---

## 📦 Estructura del proyecto

```plaintext
/
├── assets/              # Archivos CSS, JS, imágenes
├── db_credentials.php   # Configuración de conexión a la base de datos
├── conexion.php         # Archivo que abre conexión a la DB
├── create_db.php        # Crea base de datos y tabla si no existen
├── crud.php             # Interfaz principal
├── api/
│   ├── add.php
│   ├── delete.php
│   ├── edit.php
│   └── fetch.php
└── README.md
