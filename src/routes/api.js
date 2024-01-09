const express = require('express');
const router = express.Router();
const { authMiddleware, roleMiddleware } = require('../middlewares');
const { AuthController, ProductController, UserController, PurchaseController } = require('../controllers');

router.post('/auth/register', AuthController.register);
/**
 * @api {post} /api/auth/register   Registro
 * @apiGroup Auth
 * 
 * @apiDescription Registrarse como usuario en la plataforma a través de API.
 * 
 * @apiBody  {String} username                  Un nombre de usuario único.
 * @apiBody  {String} email                     Un correo electrónico único.
 * @apiBody  {String{6..30}} password           Una cadena de caracteres de una longitud mínima de 6 y una máxima de 30.
 * @apiBody  {String{6..30}} confirmPassword    Una cadena de caracteres igual al campo "password".
 * 
 * @apiSuccess {String} message                 Mensaje que indica que el registro fue exitoso.
 * 
 * @apiError {String} [BadRequest]              La solicitud falló porque un elemento no ha sido validado de manera correcta.
 * @apiError (Error 500) {String} [InternalServerError]         Error interno en el servidor.
 * 
 * @apiExample {json} Ejemplo de solicitud:
 *    POST /api/auth/register
 *    {
 *      "username": "john_doe",
 *      "email": "john@example.com",
 *      "password": "securepass",
 *      "confirmPassword": "securepass"
 *    }
 * 
 * @apiSuccessExample {json} Registro exitoso:
 *    HTTP/1.1 201 Created
 *    {
 *      "message": "¡Registro exitoso!"
 *    }
 * 
 * @apiErrorExample  {json} Error al validar los datos:
 *    HTTP/1.1 400 Bad Request
 *    {
 *      "message": "Error en la validación de datos",
 *      "errors": {
 *          "username": [
 *              "The username is required"
 *          ],
 *          "email": [
 *              "The email is required",
 *              "The email must be a valid email address"
 *          ],
 *          "password": [
 *              "The password is required",
 *              "The password must be at least 6 characters long"
 *          ],
 *          "confirmPassword": [
 *              "The confirmPassword is required",
 *              "Validation for confirmPassword did not pass"
 *          ]
 *      }
 *    }
 * 
 * @apiErrorExample {json} Error al validar el username o email:
 *    HTTP/1.1 400 Bad Request
 *    {
 *      "message": "Usuario existente"
 *    }
 * 
 * @apiErrorExample {json} Error interno:
 *    HTTP/1.1 500 Internal server error
 *    {
 *      "message": "Error interno"
 *    }
 */

router.post('/auth/login', AuthController.login);
/**
 * @api {post} /api/auth/login   Iniciar sesión
 * @apiGroup Auth
 * 
 * @apiDescription Iniciar sesión en la plataforma a través de API.
 * 
 * @apiBody  {String} email                 Un correo electrónico registrado.
 * @apiBody  {String{6..30}} password       Contraseña asociada al correo registrado.
 * 
 * @apiSuccess {String} message             Mensaje que indica que el inicio de sesión fue exitoso.
 * @apiSuccess {String} authToken           <code>${authToken}</code> es la cadena a utilizar para las rutas protegidas para usuarios autenticados.
 * 
 * @apiError {String} [BadRequest]          La solicitud falló porque un elemento no ha sido validado de manera correcta.
 * @apiError {String} [Unauthorized]        La solicitud falló ya que las credenciales son incorrectas.
 * @apiError (Error 500) {String} [InternalServerError]     Error interno en el servidor.
 * 
 * @apiExample {json} Ejemplo de solicitud:
 *    POST /api/auth/login
 *    {
 *      "email": "john@example.com",
 *      "password": "securepass"
 *    }
 * 
 * @apiSuccessExample {json} Inicio de sesión exitoso:
 *    HTTP/1.1 200 Success
 *    {
 *      "message": "Inicio de sesión exitoso",
 *      "authToken": "${authToken}"
 *    }
 * 
 * @apiErrorExample  {json} Error al validar los datos:
 *    HTTP/1.1 400 Bad Request
 *    {
 *      "message": "Error en la validación de datos",
 *      "errors": {
 *          "email": [
 *              "The email is required",
 *              "The email must be a valid email address"
 *          ],
 *          "password": [
 *              "The password is required",
 *              "The password must be at least 6 characters long"
 *          ]
 *      }
 *    }
 * 
 * @apiErrorExample {json} Error al validar el email o password:
 *    HTTP/1.1 401 Unauthorized
 *    {
 *      "message": "Credenciales incorrectas"
 *    }
 * 
 * @apiErrorExample {json} Error interno:
 *    HTTP/1.1 500 Internal server error
 *    {
 *      "message": "Error interno"
 *    }
 */

router.patch('/auth/changePassword', authMiddleware, AuthController.changePassword);
/**
 * @api {patch} /api/auth/changePassword   Cambiar contraseña
 * @apiGroup Auth
 * 
 * @apiDescription Cambiar la contraseña del usuario.
 * 
 * @apiHeader {String} Authorization                <code>Bearer ${authToken}</code> obtenido al momento de iniciar sesión.
 * 
 * @apiHeaderExample {String} Authorization:
 *     "Authorization": "Bearer ${authToken}"
 * 
 * @apiBody  {String{6..30}} currentPassword        Contraseña actual del usuario.
 * @apiBody  {String{6..30}} password               Una cadena de caracteres de una longitud mínima de 6 y una máxima de 30.
 * @apiBody  {String{6..30}} confirmPassword        Una cadena de caracteres igual al campo "password".
 * 
 * @apiSuccess {String} message                     Mensaje que indica que el cambio de contraseña fue exitoso.
 * 
 * @apiError {String} [BadRequest]                  La solicitud falló porque un elemento no ha sido validado de manera correcta.
 * @apiError {String} [Unauthorized]                La solicitud falló ya que las credenciales son incorrectas.
 * @apiError (Error 500) {String} [InternalServerError]       Error interno en el servidor.
 * 
 * @apiExample {json} Ejemplo de solicitud:
 *    PATCH /api/auth/changePassword
 *    {
 *      "currentPassword": "securepass",
 *      "password": "securepass",
 *      "confirmPassword": "securepass"
 *    }
 * 
 * @apiSuccessExample {json} Cambio de contraseña exitoso:
 *    HTTP/1.1 200 Success
 *    {
 *      "message": "Contraseña cambiada"
 *    }
 * 
 * @apiErrorExample  {json} Error al validar los datos:
 *    HTTP/1.1 400 Bad Request
 *    {
 *      "message": "Error en la validación de datos",
 *      "errors": {
 *          "currentPassword": [
 *              "The currentPassword is required"
 *          ],
 *          "password": [
 *              "The password is required",
 *              "The password must be at least 6 characters long"
 *          ],
 *          "confirmPassword": [
 *              "The confirmPassword is required",
 *              "Validation for confirmPassword did not pass"
 *          ],
 *      }
 *    }
 * 
 * @apiErrorExample {json} No existe una sesión válida:
 *    HTTP/1.1 401 Unauthorized
 *    {
 *      "message": "Unauthorized"
 *    }
 * 
 * @apiErrorExample {json} La contraseña actual no coincide:
 *    HTTP/1.1 401 Unauthorized
 *    {
 *      "message": "La contraseña actual propocionada no coincide con la contraseña actual"
 *    }
 * 
 * @apiErrorExample {json} Error interno:
 *    HTTP/1.1 500 Internal server error
 *    {
 *      "message": "Error interno"
 *    }
 */

router.get('/profile', authMiddleware, AuthController.profile);
/**
 * @api {get} /api/profile   Perfil
 * @apiGroup Auth
 * 
 * @apiDescription Obtener el perfil del usuario.
 * 
 * @apiHeader {String} Authorization                <code>Bearer ${authToken}</code> obtenido al momento de iniciar sesión.
 * 
 * @apiHeaderExample {String} Authorization:
 *     "Authorization": "Bearer ${authToken}"
 * 
 * @apiParam {Number} [page=1]                      Número de página para paginación.
 * @apiParam {Number} [pageSize=10]                 Tamaño de página para paginación.
 * 
 * @apiSuccess {Object} user                        Objeto <code>Array</code> que contiene la información del usuario.
 * @apiSuccess {Object} purchases                   Objeto <code>Array</code> que contiene las compras realizadas por el usuario.
 * 
 * @apiError {String} [Unauthorized]                La solicitud falló ya que las credenciales son incorrectas.
 * @apiError (Error 500) {String} [InternalServerError]         Error interno en el servidor.
 * 
 * @apiExample {json} Ejemplo de solicitud sencilla:
 *    GET /api/profile
 * 
 * @apiExample {json} Ejemplo de solicitud con paginación:
 *    GET /api/profile?page=2&pageSize=15
 * 
 * @apiSuccessExample {json} Success:
 *    HTTP/1.1 200 Success
 *    {
 *      "user": { username, email, role },
 *      "purchases" { data, page, pageSize, totalCount, totalPages }
 *    }
 * 
 * @apiErrorExample {json} No existe una sesión válida:
 *    HTTP/1.1 401 Unauthorized
 *    {
 *      "message": "Unauthorized"
 *    }
 * 
 * @apiErrorExample {json} Error interno:
 *    HTTP/1.1 500 Internal server error
 *    {
 *      "message": "Error interno"
 *    }
 */

router.get('/products', ProductController.index);
/**
 * @api {get} /api/products   Listar Productos
 * @apiGroup Productos
 * 
 * @apiDescription Obtener todos los productos registrados.
 * 
 * @apiParam {Number} [page=1]                      Número de página para paginación.
 * @apiParam {Number} [pageSize=10]                 Tamaño de página para paginación.
 * @apiParam {String} [query]                       Texto para filtrar productos relacionados con la palabra clave.
 * 
 * @apiSuccess {Array} data                         Array <code>Objetos</code> que contiene los productos.
 * @apiSuccess {Integer} page                       Número de página actual.
 * @apiSuccess {Integer} pageSize                   Número de elementos por página.
 * @apiSuccess {Integer} totalCount                 Total de productos registrados.
 * @apiSuccess {Integer} totalPages                 Total de páginas.
 * 
 * @apiError (Error 500) {String} InternalServerError       Error interno en el servidor.
 * 
 * @apiExample {json} Ejemplo de solicitud sencilla:
 *    GET /api/products
 * 
 * @apiExample {json} Ejemplo de solicitud con paginación:
 *    GET /api/products?page=2&pageSize=15
 * 
 * @apiExample {json} Ejemplo de solicitud con búsqueda:
 *    GET /api/products?query=query
 * 
 * @apiSuccessExample {json} Success:
 *    HTTP/1.1 200 Success
 *    {
 *      data, page, pageSize, totalCount, totalPages
 *    }
 * 
 * @apiErrorExample {json} Error interno:
 *    HTTP/1.1 500 Internal server error
 *    {
 *      "message": "Error interno"
 *    }
 */

router.get('/products/history', authMiddleware, ProductController.history);
/**
 * @api {get} /api/products/history   Historial de productos comprados
 * @apiGroup Productos
 *  
 * @apiDescription Obtener todos los productos comprados.
 * 
 * @apiHeader {String} Authorization                <code>Bearer ${authToken}</code> obtenido al momento de iniciar sesión
 * 
 * @apiSuccess {Array} Array                         Array <code>Objetos</code> que contiene los productos.
 * 
 * @apiError (Error 500) {String} InternalServerError       Error interno en el servidor.
 * 
 * @apiExample {json} Ejemplo de solicitud sencilla:
 *    GET /api/products/history
 * 
 * @apiSuccessExample {json} Success:
 *    HTTP/1.1 200 Success
 *    [
 *      {
 *          "name": "somename",
 *          "quantity": 1
 *      }
 *    ]
 * 
 * @apiErrorExample {json} Error interno:
 *    HTTP/1.1 500 Internal server error
 *    {
 *      "message": "Error interno"
 *    }
 */

router.get('/products/:id', ProductController.show);
/**
 * @api {get} /api/products/:id   Buscar producto
 * @apiGroup Productos
 * 
 * @apiDescription Obtener un producto mediante el identificador.
 * 
 * @apiParam {Integer} id                       Identificador del producto.
 * 
 * @apiSuccess {Integer} id                     Identificador del producto.
 * @apiSuccess {String} lotNumber               Número de lote del producto.
 * @apiSuccess {String} name                    Nombre del producto.
 * @apiSuccess {Integer} price                  Precio del producto.
 * @apiSuccess {Integer} quantity               Cantidad disponible del producto.
 * @apiSuccess {Date} entryDate                 Fecha en la que entró el producto.
 * 
 * @apiError {String} [NotFound]                No se ha encontrado el recurso solicitado.
 * @apiError (Error 500) {String} [InternalServerError]     Error interno en el servidor.
 * 
 * @apiExample {json} Ejemplo de solicitud sencilla:
 *    GET /api/products/1
 * 
 * @apiSuccessExample {json} Success:
 *    HTTP/1.1 200 Success
 *    {
 *      id, lotNumber, name, price, quantity, entryDate
 *    }
 * 
 * @apiErrorExample {json} Not found:
 *    HTTP/1.1 404 Not found
 *    {
 *      "message": "Producto no encontrado"
 *    }
 * 
 * @apiErrorExample {json} Error interno:
 *    HTTP/1.1 500 Internal server error
 *    {
 *      "message": "Error interno"
 *    }
 */

router.post('/products', authMiddleware, roleMiddleware.checkRole('Admin'), ProductController.store);
/**
 * @api {post} /api/products   Registrar producto
 * @apiGroup Productos
 * 
 * @apiDescription Registrar un producto a través de API.
 * 
 * @apiPermission Admin
 * 
 * @apiHeader {String} Authorization        <code>Bearer ${authToken}</code> obtenido al momento de iniciar sesión.
 * 
 * @apiHeaderExample {String} Authorization:
 *     "Authorization": "Bearer ${authToken}"
 * 
 * @apiBody  {String} lotNumber             Número de lote del produto.
 * @apiBody  {String} name                  Nombre del producto.
 * @apiBody  {Integer} price                Valor unitario del producto.
 * @apiBody  {Integer} quantity             Cantidad disponible del producto.
 * @apiBody  {Date} entryDate               Fecha de ingreso del producto.
 * 
 * @apiSuccess {String} message             Mensaje que indica que el registro del producto fue exitoso.
 * 
 * @apiError {String} [BadRequest]          La solicitud falló porque un elemento no ha sido validado de manera correcta.
 * @apiError {String} [Unauthorized]        La solicitud falló ya que las credenciales son incorrectas.
 * @apiError (Error 500) {String} [InternalServerError]     Error interno en el servidor.
 * 
 * @apiExample {json} Ejemplo de solicitud:
 *    POST /api/products
 *    {
 *      "lotNumber": "123456789",
 *      "name": "name",
 *      "price": 1000,
 *      "quantity": 1,
 *      "entryDate": "2024-01-01 00:00:00"
 *    }
 * 
 * @apiSuccessExample {json} Registro de producto exitoso:
 *    HTTP/1.1 200 Success
 *    {
 *      "message": "¡Producto creado!"
 *    }
 * 
 * @apiErrorExample  {json} Error al validar los datos:
 *    HTTP/1.1 400 Bad Request
 *    {
 *      "message": "Error en la validación de datos",
 *      "errors": {
 *          "lotNumber": [
 *              "The lotNumber is required"
 *          ],
 *          "name": [
 *              "The name is required"
 *          ]
 *          "price": [
 *              "The price is required",
 *              "The price must be a numeric value",
 *              "The price cannot be less than 0"
 *          ],
 *          "quantity": [
 *              "The quantity is required",
 *              "The quantity must be a numeric value",
 *              "The quantity cannot be less than 0"
 *          ],
 *          "entryDate": [
 *              "The entryDate is required",
 *              "Incorrect entryDate format date"
 *          ]
 *      }
 *    }
 * 
 * @apiErrorExample  {json} Producto previamente registrado con el mismo número de lote:
 *    HTTP/1.1 400 Bad Request
 *    {
 *      "message": "Producto ya existente"
 *    }
 * 
 * @apiErrorExample {json} Error al validar el usuario autenticado (Admin|Token vencido):
 *    HTTP/1.1 401 Unauthorized
 *    {
 *      "message": "Unauthorized"
 *    }
 * 
 * @apiErrorExample {json} Error interno:
 *    HTTP/1.1 500 Internal server error
 *    {
 *      "message": "Error interno"
 *    }
 */

router.patch('/products/:id', authMiddleware, roleMiddleware.checkRole('Admin'), ProductController.update);
/**
 * @api {patch} /api/products/:id   Actualizar producto
 * @apiGroup Productos
 * 
 * @apiDescription Actualizar un producto a través de API.
 * 
 * @apiParam {Integer} id                   Identificador del producto.
 * 
 * @apiPermission Admin
 * 
 * @apiHeader {String} Authorization        <code>Bearer ${authToken}</code> obtenido al momento de iniciar sesión.
 * 
 * @apiHeaderExample {String} Authorization:
 *     "Authorization": "Bearer ${authToken}"
 * 
 * @apiBody  {String} name                  Nombre del producto.
 * @apiBody  {Integer} price                Valor unitario del producto.
 * @apiBody  {Integer} quantity             Cantidad disponible del producto.
 * 
 * @apiSuccess {String} message             Mensaje que indica que el registro del producto fue exitoso.
 * 
 * @apiError {String} [BadRequest]          La solicitud falló porque un elemento no ha sido validado de manera correcta.
 * @apiError {String} [NotFound]            No se ha encontrado el recurso solicitado.
 * @apiError {String} [Unauthorized]        La solicitud falló ya que las credenciales son incorrectas.
 * @apiError (Error 500) {String} [InternalServerError]     Error interno en el servidor.
 * 
 * @apiExample {json} Ejemplo de solicitud:
 *    PATCH /api/products/1
 *    {
 *      "name": "name",
 *      "price": 1000,
 *      "quantity": 1
 *    }
 * 
 * @apiSuccessExample {json} Actualización de producto exitoso:
 *    HTTP/1.1 200 Success
 *    {
 *      "message": "¡Producto actualizado!"
 *    }
 * 
 * @apiErrorExample  {json} Error al validar los datos:
 *    HTTP/1.1 400 Bad Request
 *    {
 *      "message": "Error en la validación de datos",
 *      "errors": {
 *          "name": [
 *              "The name is required"
 *          ]
 *          "price": [
 *              "The price is required",
 *              "The price must be a numeric value",
 *              "The price cannot be less than 0"
 *          ],
 *          "quantity": [
 *              "The quantity is required",
 *              "The quantity must be a numeric value",
 *              "The quantity cannot be less than 0"
 *          ]
 *      }
 *    }
 * 
 * @apiErrorExample  {json} Producto no registrado:
 *    HTTP/1.1 404 NotFound
 *    {
 *      "message": "Producto no existe"
 *    }
 * 
 * @apiErrorExample {json} Error al validar el usuario autenticado (Admin|Token vencido):
 *    HTTP/1.1 401 Unauthorized
 *    {
 *      "message": "Unauthorized"
 *    }
 * 
 * @apiErrorExample {json} Error interno:
 *    HTTP/1.1 500 Internal server error
 *    {
 *      "message": "Error interno"
 *    }
 */

router.delete('/products/:id', authMiddleware, roleMiddleware.checkRole('Admin'), ProductController.destroy);
/**
 * @api {delete} /api/products/:id   Eliminar producto
 * @apiGroup Productos
 * 
 * @apiDescription Eliminar un producto a través de API.
 * 
 * @apiParam {Integer} id                   Identificador del producto.
 * 
 * @apiPermission Admin
 * 
 * @apiHeader {String} Authorization        <code>Bearer ${authToken}</code> obtenido al momento de iniciar sesión.
 * 
 * @apiHeaderExample {String} Authorization:
 *     "Authorization": "Bearer ${authToken}"
 * 
 * @apiSuccess {String} message             Mensaje que indica que la eliminación del producto fue exitoso.
 * 
 * @apiError {String} [NotFound]            No se ha encontrado el recurso solicitado.
 * @apiError {String} [Unauthorized]        La solicitud falló ya que las credenciales son incorrectas.
 * @apiError (Error 500) {String} [InternalServerError]     Error interno en el servidor.
 * 
 * @apiExample {json} Ejemplo de solicitud:
 *    DELETE /api/products/1
 * 
 * @apiSuccessExample {json} Eliminación de producto exitoso:
 *    HTTP/1.1 200 Success
 *    {
 *      "message": "¡Producto eliminado!"
 *    }
 * 
 * @apiErrorExample  {json} Producto no registrado:
 *    HTTP/1.1 404 NotFound
 *    {
 *      "message": "Producto no existe"
 *    }
 * 
 * @apiErrorExample {json} Error al validar el usuario autenticado (Admin|Token vencido):
 *    HTTP/1.1 401 Unauthorized
 *    {
 *      "message": "Unauthorized"
 *    }
 * 
 * @apiErrorExample {json} Error interno:
 *    HTTP/1.1 500 Internal server error
 *    {
 *      "message": "Error interno"
 *    }
 */

router.get('/users', authMiddleware, roleMiddleware.checkRole('Admin'), UserController.index);
/**
 * @api {get} /api/users   Listado de usuarios
 * @apiGroup Usuarios
 * 
 * @apiDescription Obtener el listado de usuarios registrados.
 * 
 * @apiPermission Admin
 * 
 * @apiHeader {String} Authorization                <code>Bearer ${authToken}</code> obtenido al momento de iniciar sesión.
 * 
 * @apiHeaderExample {String} Authorization:
 *     "Authorization": "Bearer ${authToken}"
 * 
 * @apiParam {Number} [page=1]                      Número de página para paginación.
 * @apiParam {Number} [pageSize=10]                 Tamaño de página para paginación.
 * 
 * @apiSuccess {Array} data                         Array <code>Objetos</code> que contiene los usuarios.
 * @apiSuccess {Integer} page                       Número de página actual.
 * @apiSuccess {Integer} pageSize                   Número de elementos por página.
 * @apiSuccess {Integer} totalCount                 Total de usuarios registrados.
 * @apiSuccess {Integer} totalPages                 Total de páginas.
 * 
 * @apiError {String} [Unauthorized]                La solicitud falló ya que las credenciales son incorrectas.
 * @apiError (Error 500) {String} [InternalServerError]         Error interno en el servidor.
 * 
 * @apiExample {json} Ejemplo de solicitud sencilla:
 *    GET /api/users
 * 
 * @apiExample {json} Ejemplo de solicitud con paginación:
 *    GET /api/users?page=2&pageSize=15
 * 
 * @apiSuccessExample {json} Success:
 *    HTTP/1.1 200 Success
 *    {
 *      data, page, pageSize, totalCount, totalPages
 *    }
 * 
 * @apiErrorExample {json} No existe una sesión válida:
 *    HTTP/1.1 401 Unauthorized
 *    {
 *      "message": "Unauthorized"
 *    }
 * 
 * @apiErrorExample {json} Error interno:
 *    HTTP/1.1 500 Internal server error
 *    {
 *      "message": "Error interno"
 *    }
 */

router.get('/users/:id', authMiddleware, roleMiddleware.checkRole('Admin'), UserController.show);
/**
 * @api {get} /api/users/:id   Buscar usuario
 * @apiGroup Usuarios
 * 
 * @apiDescription Obtener la información de un usuario a través de API.
 * 
 * @apiParam {Integer} id                   Identificador del usuario.
 * 
 * @apiPermission Admin
 * 
 * @apiHeader {String} Authorization        <code>Bearer ${authToken}</code> obtenido al momento de iniciar sesión.
 * 
 * @apiHeaderExample {String} Authorization:
 *     "Authorization": "Bearer ${authToken}"
 * 
 * @apiSuccess {Integer} id                 Identificador del usuario.
 * @apiSuccess {String} username            Username.
 * @apiSuccess {String} email               Correo electrónico del usuario.
 * @apiSuccess {String} role                Rol del usuario.
 * @apiSuccess {Date} createdAt             Fecha de creación del usuario.
 * @apiSuccess {Date} updatedAt             Fecha de la última actualización del usuario.
 * 
 * @apiError {String} [NotFound]            No se ha encontrado el recurso solicitado.
 * @apiError {String} [Unauthorized]        La solicitud falló ya que las credenciales son incorrectas.
 * @apiError (Error 500) {String} [InternalServerError]     Error interno en el servidor.
 * 
 * @apiExample {json} Ejemplo de solicitud:
 *    GET /api/users/1
 * 
 * @apiSuccessExample {json} Success:
 *    HTTP/1.1 200 Success
 *    {
 *      "id": 1,
 *      "username": "username",
 *      "email": "john@example.com",
 *      "role": "Admin|Client",
 *      "createdAt": "2024-01-01T00:00:00.000Z",
 *      "updatedAt": "2024-01-01T00:00:00.000Z"
 *    }
 * 
 * @apiErrorExample  {json} Usuario no registrado:
 *    HTTP/1.1 404 NotFound
 *    {
 *      "message": "Usuario no encontrado"
 *    }
 * 
 * @apiErrorExample {json} Error al validar el usuario autenticado (Admin|Token vencido):
 *    HTTP/1.1 401 Unauthorized
 *    {
 *      "message": "Unauthorized"
 *    }
 * 
 * @apiErrorExample {json} Error interno:
 *    HTTP/1.1 500 Internal server error
 *    {
 *      "message": "Error interno"
 *    }
 */

router.post('/users', authMiddleware, roleMiddleware.checkRole('Admin'), UserController.store);
/**
 * @api {post} /api/users   Registrar usuario
 * @apiGroup Usuarios
 * 
 * @apiDescription Registrar un usuario a través de API.
 * 
 * @apiPermission Admin
 * 
 * @apiHeader {String} Authorization            <code>Bearer ${authToken}</code> obtenido al momento de iniciar sesión.
 * 
 * @apiHeaderExample {String} Authorization:
 *     "Authorization": "Bearer ${authToken}"
 * 
 * @apiBody  {String} username                  Un nombre de usuario único.
 * @apiBody  {String} email                     Un correo electrónico único.
 * @apiBody  {String{6..30}} password           Una cadena de caracteres de una longitud mínima de 6 y una máxima de 30.
 * @apiBody  {String{6..30}} confirmPassword    Una cadena de caracteres igual al campo "password".
 * @apiBody  {String} role                      Rol que tendrá el usuario en el sistema [Admin|Client].
 * 
 * @apiSuccess {String} message                 Mensaje que indica que el registro del usuario fue exitoso.
 * 
 * @apiError {String} [BadRequest]              La solicitud falló porque un elemento no ha sido validado de manera correcta.
 * @apiError {String} [Unauthorized]            La solicitud falló ya que las credenciales son incorrectas.
 * @apiError (Error 500) {String} [InternalServerError]     Error interno en el servidor.
 * 
 * @apiExample {json} Ejemplo de solicitud:
 *    POST /api/users
 *    {
 *      "username": "username",
 *      "email": "john@example.com",
 *      "password": "securepass",
 *      "confirmPassword": "securepass",
 *      "role": "Admin|Client"
 *    }
 * 
 * @apiSuccessExample {json} Registro de usuario exitoso:
 *    HTTP/1.1 200 Success
 *    {
 *      "message": "¡Usuario creado!"
 *    }
 * 
 * @apiErrorExample  {json} Error al validar los datos:
 *    HTTP/1.1 400 Bad Request
 *    {
 *      "message": "Error en la validación de datos",
 *      "errors": {
 *          "username": [
 *              "The username is required"
 *          ],
 *          "email": [
 *              "The email is required",
 *              "The email must be a valid email address"
 *          ]
 *          "password": [
 *              "The password is required",
 *              "The password must be at least 6 characters long"
 *          ],
 *          "confirmPassword": [
 *              "The confirmPassword is required",
 *              "Validation for confirmPassword did not pass"
 *          ],
 *          "role": [
 *              "The role is required",
 *              "'Some' role is not allowed, please use [Admin, Client]"
 *          ]
 *      }
 *    }
 * 
 * @apiErrorExample  {json} Usuario previamente registrado con el mismo username o correo electrónico:
 *    HTTP/1.1 400 Bad Request
 *    {
 *      "message": "Usuario ya existente"
 *    }
 * 
 * @apiErrorExample {json} Error al validar el usuario autenticado (Admin|Token vencido):
 *    HTTP/1.1 401 Unauthorized
 *    {
 *      "message": "Unauthorized"
 *    }
 * 
 * @apiErrorExample {json} Error interno:
 *    HTTP/1.1 500 Internal server error
 *    {
 *      "message": "Error interno"
 *    }
 */

router.patch('/users/:id', authMiddleware, roleMiddleware.checkRole('Admin'), UserController.update);
/**
 * @api {patch} /api/users/:id   Actualizar usuario
 * @apiGroup Usuarios
 * 
 * @apiDescription Actualizar un usuario a través de API.
 * 
 * @apiParam {Integer} id                       Identificador del usuario.
 * 
 * @apiPermission Admin
 * 
 * @apiHeader {String} Authorization            <code>Bearer ${authToken}</code> obtenido al momento de iniciar sesión.
 * 
 * @apiHeaderExample {String} Authorization:
 *     "Authorization": "Bearer ${authToken}"
 * 
 * @apiBody  {String} role                      Rol que tendrá el usuario en el sistema [Admin|Client].
 * 
 * @apiSuccess {String} message                 Mensaje que indica que la actualización del usuario fue exitoso.
 * 
 * @apiError {String} [BadRequest]              La solicitud falló porque un elemento no ha sido validado de manera correcta.
 * @apiError {String} [Unauthorized]            La solicitud falló ya que las credenciales son incorrectas.
 * @apiError {String} [NotFound]                No se ha encontrado el recurso solicitado.
 * @apiError (Error 500) {String} [InternalServerError]     Error interno en el servidor.
 * 
 * @apiExample {json} Ejemplo de solicitud:
 *    PATCH /api/users/1
 *    {
 *      "role": "Admin|Client"
 *    }
 * 
 * @apiSuccessExample {json} Actualización de usuario exitoso:
 *    HTTP/1.1 200 Success
 *    {
 *      "message": "¡Usuario actualizado!"
 *    }
 * 
 * @apiErrorExample  {json} Error al validar los datos:
 *    HTTP/1.1 400 Bad Request
 *    {
 *      "message": "Error en la validación de datos",
 *      "errors": {
 *          "role": [
 *              "The role is required",
 *              "'Some' role is not allowed, please use [Admin, Client]"
 *          ]
 *      }
 *    }
 * 
 * @apiErrorExample  {json} Usuario no registrado o se está intentando actualizar el rol del mismo usuario logueado:
 *    HTTP/1.1 404 Not Found
 *    {
 *      "message": "Usuario no existe"
 *    }
 * 
 * @apiErrorExample {json} Error al validar el usuario autenticado (Admin|Token vencido):
 *    HTTP/1.1 401 Unauthorized
 *    {
 *      "message": "Unauthorized"
 *    }
 * 
 * @apiErrorExample {json} Error interno:
 *    HTTP/1.1 500 Internal server error
 *    {
 *      "message": "Error interno"
 *    }
 */

router.delete('/users/:id', authMiddleware, roleMiddleware.checkRole('Admin'), UserController.destroy);
/**
 * @api {delete} /api/users/:id   Eliminar usuario
 * @apiGroup Usuarios
 * 
 * @apiDescription Eliminar un usuario a través de API.
 * 
 * @apiParam {Integer} id                   Identificador del usuario.
 * 
 * @apiPermission Admin
 * 
 * @apiHeader {String} Authorization        <code>Bearer ${authToken}</code> obtenido al momento de iniciar sesión.
 * 
 * @apiHeaderExample {String} Authorization:
 *     "Authorization": "Bearer ${authToken}"
 * 
 * @apiSuccess {String} message             Mensaje que indica que la eliminación del usuario fue exitoso.
 * 
 * @apiError {String} [NotFound]            No se ha encontrado el recurso solicitado.
 * @apiError {String} [Unauthorized]        La solicitud falló ya que las credenciales son incorrectas.
 * @apiError (Error 500) {String} [InternalServerError]     Error interno en el servidor.
 * 
 * @apiExample {json} Ejemplo de solicitud:
 *    DELETE /api/users/1
 * 
 * @apiSuccessExample {json} Eliminación de usuario exitoso:
 *    HTTP/1.1 200 Success
 *    {
 *      "message": "¡Usuario eliminado!"
 *    }
 * 
 * @apiErrorExample  {json} Usuario no registrado o se está intentando eliminar el usuario logueado:
 *    HTTP/1.1 404 Not Found
 *    {
 *      "message": "Usuario no existe"
 *    }
 * 
 * @apiErrorExample {json} Error al validar el usuario autenticado (Admin|Token vencido):
 *    HTTP/1.1 401 Unauthorized
 *    {
 *      "message": "Unauthorized"
 *    }
 * 
 * @apiErrorExample {json} Error interno:
 *    HTTP/1.1 500 Internal server error
 *    {
 *      "message": "Error interno"
 *    }
 */

router.get('/purchases/:id', authMiddleware, PurchaseController.show);
/**
 * @api {get} /api/purchases/:id   Buscar compra
 * @apiGroup Compras
 * 
 * @apiDescription Obtener la información de una compra a través de API (La compra debe pertener al usuario logueado).
 * 
 * @apiParam {Integer} id                   Identificador de la compra.
 * 
 * @apiHeader {String} Authorization        <code>Bearer ${authToken}</code> obtenido al momento de iniciar sesión.
 * 
 * @apiHeaderExample {String} Authorization:
 *     "Authorization": "Bearer ${authToken}"
 * 
 * @apiError {String} [NotFound]            No se ha encontrado el recurso solicitado.
 * @apiError {String} [Unauthorized]        La solicitud falló ya que las credenciales son incorrectas.
 * @apiError (Error 500) {String} [InternalServerError]     Error interno en el servidor.
 * 
 * @apiExample {json} Ejemplo de solicitud:
 *    GET /api/purchases/1
 * 
 * @apiSuccessExample {json} Success:
 *    HTTP/1.1 200 Success
 *    {
 *      "id": 1,
 *      "clientId": 1,
 *      "productQuantity": 1,
 *      "totalPrice": 1000,
 *      "createdAt": "2024-01-01T00:00:00.000Z",
 *      "updatedAt": "2024-01-01T00:00:00.000Z",
 *      "Products": [
 *          {
 *              // ... Información del producto.
 *              "ProductPurchases": {
 *                  "quantity": 1,
 *                  "unitValue": 1000
 *              }
 *          }
 *      ],
 *      "User": // ... Información del usuario.
 *    }
 * 
 * @apiErrorExample  {json} Compra no enonctrada:
 *    HTTP/1.1 404 NotFound
 *    {
 *      "message": "Compra no encontrada"
 *    }
 * 
 * @apiErrorExample {json} Error al validar el usuario autenticado:
 *    HTTP/1.1 401 Unauthorized
 *    {
 *      "message": "Unauthorized"
 *    }
 * 
 * @apiErrorExample {json} Error interno:
 *    HTTP/1.1 500 Internal server error
 *    {
 *      "message": "Error interno"
 *    }
 */

router.get('/purchases', authMiddleware, roleMiddleware.checkRole('Admin'), PurchaseController.index);
/**
 * @api {get} /api/purchases   Listado de compras
 * @apiGroup Compras
 * 
 * @apiDescription Obtener el listado de compras realizadas.
 * 
 * @apiPermission Admin
 * 
 * @apiHeader {String} Authorization                <code>Bearer ${authToken}</code> obtenido al momento de iniciar sesión.
 * 
 * @apiHeaderExample {String} Authorization:
 *     "Authorization": "Bearer ${authToken}"
 * 
 * @apiParam {Number} [page=1]                      Número de página para paginación.
 * @apiParam {Number} [pageSize=10]                 Tamaño de página para paginación.
 * 
 * @apiSuccess {Array} data                         Array <code>Objetos</code> que contiene las compras.
 * @apiSuccess {Integer} page                       Número de página actual.
 * @apiSuccess {Integer} pageSize                   Número de elementos por página.
 * @apiSuccess {Integer} totalCount                 Total de compras realizadas.
 * @apiSuccess {Integer} totalPages                 Total de páginas.
 * 
 * @apiError {String} [Unauthorized]                La solicitud falló ya que las credenciales son incorrectas.
 * @apiError (Error 500) {String} [InternalServerError]         Error interno en el servidor.
 * 
 * @apiExample {json} Ejemplo de solicitud sencilla:
 *    GET /api/purchases
 * 
 * @apiExample {json} Ejemplo de solicitud con paginación:
 *    GET /api/purchases?page=2&pageSize=15
 * 
 * @apiSuccessExample {json} Success:
 *    HTTP/1.1 200 Success
 *    {
 *      data, page, pageSize, totalCount, totalPages
 *    }
 * 
 * @apiErrorExample {json} No existe una sesión válida:
 *    HTTP/1.1 401 Unauthorized
 *    {
 *      "message": "Unauthorized"
 *    }
 * 
 * @apiErrorExample {json} Error interno:
 *    HTTP/1.1 500 Internal server error
 *    {
 *      "message": "Error interno"
 *    }
 */

router.post('/purchases', authMiddleware, PurchaseController.store);
/**
 * @api {post} /api/purchases   Registrar compra
 * @apiGroup Compras
 * 
 * @apiDescription Registrar una compra a través de API.
 * 
 * @apiHeader {String} Authorization            <code>Bearer ${authToken}</code> obtenido al momento de iniciar sesión.
 * 
 * @apiHeaderExample {String} Authorization:
 *     "Authorization": "Bearer ${authToken}"
 * 
 * @apiBody  {Array} products                   <code>Array</code> de productos.
 * @apiBody  {Object} product                   <code>Object</code> del producto.
 * @apiBody  {Integer} productId                Identificador del producto.
 * @apiBody  {Integer} quantity                 Cantidad de productos a comprar.
 * 
 * @apiSuccess {String} message                 Mensaje que indica que el registro de la compra fue exitoso.
 * 
 * @apiError {String} [BadRequest]              La solicitud falló porque un elemento no ha sido validado de manera correcta.
 * @apiError {String} [Forbidden]               El servidor comprende la solicitud pero se niega a autorizarla.
 * @apiError {String} [Unauthorized]            La solicitud falló ya que las credenciales son incorrectas.
 * @apiError (Error 500) {String} [InternalServerError]     Error interno en el servidor.
 * 
 * @apiExample {json} Ejemplo de solicitud:
 *    POST /api/purchases
 *    {
 *      "products": [
 *          {
 *              "productId": 1,
 *              "quantity": 1
 *          }
 *          // ... Attach more products
 *      ]
 *    }
 * 
 * @apiSuccessExample {json} Registro de compra exitoso:
 *    HTTP/1.1 201 Created
 *    {
 *      "message": "¡Compra realizada!"
 *    }
 * 
 * @apiErrorExample  {json} Error al validar los datos:
 *    HTTP/1.1 400 Bad Request
 *    {
 *      "message": "Error en la validación de datos",
 *      "errors": {
 *          "products": [
 *              "The products is required",
 *              "Products list should be array",
 *              "Products list should be min 1 element",
 *              "Element error ${object_position}: ${object_error}",
 *              // {object_error} validation errors:
 *              // '[productId|quantity]' is required
 *              // '[productId|quantity]' must be a number
 *              // 'quantity' must be greater than or equal to 1
 *          ]
 *      }
 * 
 * @apiErrorExample  {json} Error al validar la exitencia del producto:
 *    HTTP/1.1 404 Not Found
 *    {
 *      "message": "Error en la validación de datos",
 *      "errors": {
 *          "products": [
 *              "ProductId '${productId}' not found"
 *          ]
 *      }
 * 
 * @apiErrorExample  {json} Error al validar la disponibilidad del producto:
 *    HTTP/1.1 403 Forbidden
 *    {
 *      "message": "Error en la validación de datos",
 *      "product": {
 *          "id": 1,
 *          "quantity": 0
 *      },
 *      "errors": {
 *          "products": [
 *              "There is not enough stock for the product '${productId}'"
 *          ]
 *      }
 * 
 * @apiErrorExample {json} Error al validar el usuario autenticado:
 *    HTTP/1.1 401 Unauthorized
 *    {
 *      "message": "Unauthorized"
 *    }
 * 
 * @apiErrorExample {json} Error interno:
 *    HTTP/1.1 500 Internal server error
 *    {
 *      "message": "Error interno"
 *    }
 */

module.exports = router;