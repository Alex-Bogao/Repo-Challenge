
### Backend (API REST .NET)

El backend fue desarrollado utilizando **ASP.NET Core Web API** con **.NET 8**.

#### Tecnologías y Librerías
* **Framework:** .NET 8 (C#)
* **ORM:** Entity Framework Core (MySQL).
* **Micro-ORM:** Dapper para la ejecución optimizada del Stored Procedure de búsqueda.
* **Base de Datos:** MySQL 8.0.
* **Logging:** Serilog (Log en consola y persistencia en archivos de texto diarios).
* **Documentación:** Swagger con comentarios XML integrados.

#### Endpoints Principales
* `GET /api/Clientes`: Obtiene el listado completo de clientes.
* `GET /api/Clientes/Get/{id}`: Obtiene un cliente específico por su ID.
* `GET /api/Clientes/Buscar?texto={val}`: Busca clientes por nombre o apellido utilizando un Stored Procedure.
* `POST /api/Clientes/Insert`: Crea un nuevo cliente en la base de datos.
* `PUT /api/Clientes/Update/{id}`: Actualiza los datos de un cliente existente.
* `DELETE /api/Clientes/Delete/{id}`: Elimina un cliente por su ID.

---

### Frontend (React App)

La aplicación cliente fue construida con **React + Vite**

#### Tecnologías y Estilos
* **Core:** React 18, Vite.
* **UI Framework:** Bootstrap 5 & React-Bootstrap.
* **Instalaciones:** Para ejecutar el Frontend necesitas tener instalado Node.js (versión 18 o superior recomedada) y npm
                     Navega a la carpeta del proyecto y ejecuta en una Terminal: "npm install".

* **Configuracion:** El proyecto utiliza un archivo .env para conectarse al Backend. Asegúrate de que el archivo exista en la raíz y apunte al puerto correcto de tu API: 
        .Env a utilizar :   #TestLocal
                            VITE_CHALLENGE_BACKEND_URL=http://localhost:5070/api/Clientes

* **Iniciar la Aplicación:** Ejecuta el servidor de desarrollo: "npm run dev".
La web estará disponible en la URL que indique la consola (generalmente http://localhost:5173).

* **Projecto:**
El frontend funciona como un panel de control que permite:
Visualizar todos los clientes
Crear nuevos registros
Editar clientes existentes
Eliminar registros
Realizar búsquedas por nombre/apellido mediante Stored Procedure
Toda la aplicación está conectada directamente al backend desarrollado para este challenge.
