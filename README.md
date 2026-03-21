# DineGo API 🍽️

DineGo es una API RESTful diseñada para centralizar la información de restaurantes, gestionar usuarios y permitir la publicación de reseñas. Este proyecto fue desarrollado como parte de la Unidad III de la materia Aplicaciones Web Orientadas a Servicios (AWOS).

**Equipo de Desarrollo:**
* Fernando Jimenez Angeles
* Diego Pérez Mendoza
* Laura Michelle Escamilla Barrera

---

## 🛠️ Framework Elegido y Justificación
**Framework:** Laravel (PHP) - Versión 11.x
Se eligió Laravel por su robusto sistema de enrutamiento, su ORM (Eloquent) para manejar relaciones de bases de datos de forma intuitiva y su integración nativa de seguridad a través de Laravel Sanctum para la protección de endpoints.

---

## 📋 Requisitos para ejecutar
Para levantar este proyecto en un entorno local, necesitas tener instalado:
* **XAMPP** (Apache y MySQL activos).
* **PHP** >= 8.2
* **Composer** (Gestor de dependencias de PHP).
* **Git** (Para clonar el repositorio).
* **Postman** o Insomnia (Para ejecutar las pruebas de la API).

---

## ⚙️ Cómo instalar dependencias
Sigue estos pasos en tu terminal para configurar el proyecto desde cero:

1. Clona el repositorio:
   `git clone [URL_DE_TU_REPOSITORIO]`
2. Entra a la carpeta del proyecto:
   `cd dinego-api`
3. Instala las dependencias del framework:
   `composer install`
4. Crea tu archivo de entorno copiando el de ejemplo:
   `cp .env.example .env`
5. Genera la llave de seguridad de Laravel:
   `php artisan key:generate`
6. En tu archivo `.env`, configura la base de datos apuntando a XAMPP:
   `DB_DATABASE=dinego_db`
   `DB_USERNAME=root`
   `DB_PASSWORD=`

---

## 🚀 Cómo ejecutar
Una vez configurado el `.env` y con XAMPP corriendo (Apache y MySQL encendidos):

1. Crea las tablas de la base de datos y llénalas con los restaurantes de prueba:
   `php artisan migrate --seed`
2. Levanta el servidor local de Laravel:
   `php artisan serve`
3. La API estará disponible en: `http://127.0.0.1:8000`

---

## 🌐 Endpoints Disponibles (Resumen)

| Método | Ruta | Descripción | Requiere Token |
|---|---|---|---|
| `POST` | `/api/register` | Registra un nuevo usuario. | No |
| `POST` | `/api/login` | Autentica al usuario y devuelve un token. | No |
| `GET` | `/api/restaurants` | Obtiene el catálogo de restaurantes. | No |
| `GET` | `/api/restaurants/{id}` | Muestra los detalles de un restaurante específico. | No |
| `POST` | `/api/reviews` | Crea una nueva reseña para un restaurante. | **Sí** |

### Ejemplos de Request / Response

**1. Obtener Lista de Restaurantes (GET `/api/restaurants`)**
* **Request:** No requiere body.
* **Response (200 OK):**
```json
{
  "data": [
    {
      "id": 1,
      "name": "La Parrilla Queretana",
      "address": "Blvd. Bernardo Quintana 123",
      "lat": "20.58800000",
      "lng": "-100.38900000"
    }
  ]
}




// ARRANCAR EL SERVIDOR: php artisan serve