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

Route.on('/').render('welcome')

Route.group(() => {
    Route.post('/register', 'AuthController.register')
    Route.post('/login', 'AuthController.login')
}).prefix('/auth')

Route.group(() => {
    Route.get('/', 'UserController.index')
    Route.get('/:id', 'UserController.show')
    Route.post('/', 'UserController.store')
    Route.put('/:id', 'UserController.update')
    Route.delete('/:id', 'UserController.destroy')
    Route.put('/change_password/:id', 'UserController.changePassword')
}).prefix('/users').middleware('auth')

Route.group(() => {
    Route.get('/', 'TaskController.index')
    Route.get('/:id', 'TaskController.show')
    Route.post('/', 'TaskController.store')
    Route.put('/:id', 'TaskController.update')
    Route.delete('/:id', 'TaskController.destroy')
}).prefix('/tasks').middleware('auth')