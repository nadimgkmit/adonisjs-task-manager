'use strict'
const Task = use('App/Models/Task');
const { validate } = use('Validator')
class TaskController {

    async index({ request, response, view }) {
        try {
            const where = [
                'id',
                'name',
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
                return response.status(404).send({ message: 'Not found' })
            }
        } catch (error) {
            return response.status(500).send(error)
        }
    }

    async store({ request, response }) {
        try {
            const query = new Task()
            if (query) {
                const rules = {
                    user_id: 'required',
                    name: 'required',
                }
                const validation = await validate(request.all(), rules)
                if (validation.fails()) {
                    return response.status(200).send(validation.messages())
                }

                query.user_id = request.input('user_id')
                query.name = request.input('name')
                query.details = request.input('details')

                await query.save()
                return response.status(200).send({ message: 'Create successfully' })
            } else {
                return response.status(404).send({ message: 'Not found' })
            }
        } catch (error) {
            return response.status(500).send(error)
        }
    }

    async show({ params, request, response, view }) {
        try {
            const query = await Task.find(params.id)
            if (query) {
                return response.status(200).send(query)
            } else {
                return response.status(404).send({ message: 'Not found' })
            }

        } catch (error) {
            return response.status(500).send(error)
        }
    }

    async update({ params, request, response }) {
        try {
            let query = await Task.find(params.id)
            if (query) {
                const rules = {
                    user_id: 'required',
                    name: 'required',
                }
                const validation = await validate(request.all(), rules)
                if (validation.fails()) {
                    return response.status(200).send(validation.messages())
                }

                query.user_id = request.input('user_id')
                query.name = request.input('name')
                query.details = request.input('details')
                await query.save()
                return response.status(200).send({ message: 'Update successfully' })
            } else {
                return response.status(404).send({ message: 'Not found' })
            }
        } catch (error) {
            return response.status(500).send(error)
        }
    }

    async destroy({ params, request, response }) {
        try {
            let query = await Task.find(params.id)
            if (query) {
                const result = query.delete()
                if (result) {
                    return response.status(200).send({ message: 'Delete successfully' })
                } else {
                    return response.status(500).send({ message: 'Error' })
                }
            } else {
                return response.status(404).send({ message: 'Not found' })
            }
        } catch (error) {
            return response.status(500).send(error)
        }
    }
}

module.exports = TaskController
