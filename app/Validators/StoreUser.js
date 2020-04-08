'use strict'

class StoreUser {

  get rules() {
    const userId = this.ctx.params.id
    if (userId) {
      return {
        email: `required|email|unique:users,email,id,${userId}`,
        password: 'required'
      }
    } else {
      return {
        email: `required|email|unique:users,email`,
        password: 'required'
      }
    }

  }

  get validateAll() {
    return true
  }

  async fails(errorMessages) {
    return this.ctx.response.status(422).send(errorMessages)
  }
}

module.exports = StoreUser
