# Prueba Desarrollador FullStack BRM

Este es el desarrollo de la prueba técnica para el cargo Desarrollador Líder FullStack.

## Requisitos previos

Asegúrate de tener instalados los siguientes requisitos previos antes de continuar:

- [Node.js](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/)
- [MySQL](https://www.mysql.com/)

## Instalación

1. Clona este repositorio en tu máquina local:
   ```bash
   git clone https://github.com/jvillabonp/brmpruebatecnica.git
   ```

2. Ve al directorio de la aplicación:
    ```bash
    cd brmpruebatecnica
    ```

3. Instala las dependencias:
    ```bash
    npm install
    ```

4. Configura el archivo .env con las variables de entorno necesarias. Puedes copiar el archivo de ejemplo .env.example y ajustar según tus necesidades.
    - Configura las varibles respectivas en tú archiv .env
    - Ejecuta el siguiente comando en la consola de comandos:
        ```bash
        node -e "console.log(require('crypto').randomBytes(60).toString('base64'));"
        ```
    - Copia el resultado de la ejecución del comando y pega el valor en el archivo .env en la variable `JWT_SECRET`

5. Realiza las migraciones de la base de datos:
    ```bash
    npx sequelize-cli db:migrate
    ```

6. Ejecuta los seeders:
    ```bash
    npx sequelize-cli db:seed:all
    ```

## Ejecución

Una vez que hayas completado la instalación, puedes iniciar el servidor con el siguiente comando:
```bash
npm start
```

El servidor estará disponible en http://localhost:3000/ por defecto.
Abre esta URL en el navegador para poder acceder a la interfaz gráfica anexa

## Uso

### Web

- Puedes acceder a la interfaz gráfica mediante la URL generada desde que se ejecuta el servidor http://localhost:3000/
- Los usuarios registrados por defecto son:
    * Admin
        - Correo electrónico: admin@brm.com.co
        - Contraseña: 123456
    * Client
        - Correo electrónico: client@brm.com.co
        - Contraseña: 123456

### API

1. Utiliza un cliente de peticiones API Rest, un ejemplo puede ser postman:
    - [Postman](https://www.postman.com/)

2. En la consola, en el directorio de instalación, inicia el servicio de `APIDocs` para obtener información detallada de las rutas
    ```bash
    npm run apidoc
    ```

3. Abre la URL por defecto de `APIDocs` http://localhost:8080/

4. Realiza las peticiones según corresponda la acción que quieras realizar en los módulos disponibles:
    - Auth
    - Compras
    - Productos
    - Usuarios