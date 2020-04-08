'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')
const validator = use('Validator')

Route.on('/').render('welcome')

Route.group(() => {
    Route.post('/register', 'AuthController.register').validator('StoreUser')
    Route.post('/login', 'AuthController.login').validator('Login')
}).prefix('/auth')

Route.group(() => {
    Route.get('/', 'UserController.index')
    Route.get('/:id', 'UserController.show')
    Route.post('/', 'UserController.store').validator('StoreUser')
    Route.put('/:id', 'UserController.update').validator('StoreUser')
    Route.delete('/:id', 'UserController.destroy')
    Route.put('/change_password/:id', 'UserController.changePassword').validator('UpdatePassword')
}).prefix('/users').middleware('auth')

Route.group(() => {
    Route.get('/', 'TaskController.index')
    Route.get('/:id', 'TaskController.show')
    Route.post('/', 'TaskController.store').validator('StoreTask')
    Route.put('/:id', 'TaskController.update').validator('StoreTask')
    Route.delete('/:id', 'TaskController.destroy')
}).prefix('/tasks').middleware('auth')