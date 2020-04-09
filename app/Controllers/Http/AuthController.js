'use strict'
const User = use('App/Models/User');
const Antl = use('Antl')
class AuthController {
    async register({ request, auth, response }) {
        let query = new User()
        query.email = request.input("email")
        query.password = request.input("password")
        await query.save()
        const result = await User.findBy('email', query.email)
        let accessToken = await auth.generate(result)
        return response.status(200).send({
            message: Antl.formatMessage('response.register_success'),
            data: { "user": result, "access_token": accessToken }
        })
    }

    async login({ request, auth, response }) {
        const email = request.input("email")
        const password = request.input("password");
        if (await auth.attempt(email, password)) {
            let user = await User.findBy('email', email)
            let accessToken = await auth.generate(user)
            return response.status(200).send({
                message: Antl.formatMessage('response.login_success'),
                data: { "user": user, "access_token": accessToken }
            })
        } else {
            return response.status(404).send({ message: Antl.formatMessage('response.register_first') })
        }
    }
}

module.exports = AuthController
