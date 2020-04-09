'use strict'
const Task = use('App/Models/Task');
const Antl = use('Antl')
class TaskController {

    async index({ request, response, view }) {
        const where = [
            'name',
            'details'
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

        const query = Task.query()

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
                message: Antl.formatMessage('response.not_found', { name: "Task" })
            })
        }
    }

    async store({ request, response }) {
        const query = new Task()
        if (query) {
            query.user_id = request.input('user_id')
            query.name = request.input('name')
            query.details = request.input('details')

            const result = await query.save()
            if (result) {
                return response.status(200).send({
                    message: Antl.formatMessage('response.create_success', { name: "Task" })
                })
            } else {
                return response.status(500).send({
                    message: Antl.formatMessage('response.something_went_wrong')
                })
            }

        } else {
            return response.status(404).send({
                message: Antl.formatMessage('response.not_found', { name: "Task" })
            })
        }
    }

    async show({ params, request, response, view }) {        
        const query = await Task.query().with('user').where('id', params.id).first()
        if (query) {
            return response.status(200).send(query)
        } else {
            return response.status(404).send({
                message: Antl.formatMessage('response.not_found', { name: "Task" })
            })
        }
    }

    async update({ params, request, response }) {
        let query = await Task.find(params.id)
        if (query) {
            query.user_id = request.input('user_id')
            query.name = request.input('name')
            query.details = request.input('details')
            const result = await query.save()
            if (result) {
                return response.status(200).send({
                    message: Antl.formatMessage('response.update_success', { name: "Task" })
                })
            } else {
                return response.status(500).send({
                    message: Antl.formatMessage('response.something_went_wrong')
                })
            }
        } else {
            return response.status(404).send({
                message: Antl.formatMessage('response.not_found', { name: "Task" })
            })
        }
    }

    async destroy({ params, request, response }) {
        let query = await Task.find(params.id)
        if (query) {
            const result = await query.delete()
            if (result) {
                return response.status(200).send({
                    message: Antl.formatMessage('response.delete_success', { name: "Task" })
                })
            } else {
                return response.status(500).send({
                    message: Antl.formatMessage('response.something_went_wrong')
                })
            }
        } else {
            return response.status(404).send({
                message: Antl.formatMessage('response.not_found', { name: "Task" })
            })
        }
    }
}

module.exports = TaskController
