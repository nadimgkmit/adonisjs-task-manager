'use strict'
const User = use('App/Models/User');
const Antl = use('Antl')
class UserController {
    async index({ request, response, view }) {
        const where = [
            'email',
        ]
        let page = null;
        let perPage = null;

        if (request.input('page')) {
            page = request.input('page')
        }
        if (request.input('perPage')) {
            perPage = request.input('perPage')
        }
        const search = request.input('search')
        const orderBy = request.input('orderBy')
        const orderPos = request.input('orderPos')

        const query = User.query()

        if (orderBy && orderPos) {
            query.orderBy(`${orderBy}`, orderPos)
        }
        if (search) {
            where.forEach(filed => {
                query.whereRaw(`${filed} LIKE '%${search}%'`)
            })
        }

        let result;
        if (page && perPage) {
            result = await query.paginate(page, perPage)
        } else {
            const fetchData = await query.fetch()
            result = {
                total: null,
                perPage: null,
                page: null,
                lastPage: null,
                data: fetchData
            }
        }

        if (result) {
            return response.status(200).send(result)
        } else {
            return response.status(404).send({
                message: Antl.formatMessage('response.not_found', { name: "User" })
            })
        }
    }

    async store({ request, response }) {
        const query = new User()
        if (query) {

            query.name = request.input('name')
            query.email = request.input('email')

            const result = await query.save()
            if (result) {
                return response.status(200).send({
                    message: Antl.formatMessage('response.create_success', { name: "User" })
                })
            } else {
                return response.status(500).send({
                    message: Antl.formatMessage('response.something_went_wrong')
                })
            }
            
        } else {
            return response.status(404).send({
                message: Antl.formatMessage('response.not_found', { name: "User" })
            })
        }
    }

    async show({ params, request, response, view }) {
        const query = await User.query().with('tasks').where('id', params.id).first()
        if (query) {
            return response.status(200).send(query)
        } else {
            return response.status(404).send({
                message: Antl.formatMessage('response.not_found', { name: "User" })
            })
        }
    }

    async update({ params, request, response }) {
        let query = await User.find(params.id)
        if (query) {
            query.name = request.input('name')
            query.email = request.input('email')
            const result = await query.save()
            if (result) {
                return response.status(200).send({
                    message: Antl.formatMessage('response.update_success', { name: "User" })
                })
            } else {
                return response.status(500).send({
                    message: Antl.formatMessage('response.something_went_wrong')
                })
            }
        } else {
            return response.status(404).send({
                message: Antl.formatMessage('response.not_found', { name: "User" })
            })
        }
    }

    async destroy({ params, request, response }) {
        let query = await User.find(params.id)
        if (query) {
            const result = await query.delete()
            if (result) {
                return response.status(200).send({
                    message: Antl.formatMessage('response.delete_success', { name: "User" })
                })
            } else {
                return response.status(500).send({
                    message: Antl.formatMessage('response.something_went_wrong')
                })
            }
        } else {
            return response.status(404).send({
                message: Antl.formatMessage('response.not_found', { name: "User" })
            })
        }
    }

    async changePassword({ params, request, response }) {
        let query = await User.find(params.id)
        if (query) {
            query.password = request.input('password')
            const result = await query.save()
            if (result) {
                return response.status(200).send({
                    message: Antl.formatMessage('response.password_update_success', { name: "User" })
                })
            } else {
                return response.status(500).send({
                    message: Antl.formatMessage('response.something_went_wrong')
                })
            }
        } else {
            return response.status(404).send({
                message: Antl.formatMessage('response.not_found', { name: "User" })
            })
        }
    }
}

module.exports = UserController
