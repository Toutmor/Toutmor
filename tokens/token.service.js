const db = require('../utils/db')
const Token = db.Token

module.exports = {
    getAll,
    getByType,
    update,
    delete: _delete
}

async function getAll(userId) {
  try {
    return await Token.find({userId: userId})
  } catch (error) {
    throw error
  }
}

async function getByType(userId, type) {
  try {
    return await Token.findOne({userId: userId, type: type})
  } catch (error) {
    throw error
  }
}

async function update(tokenParams) {
  try {
    const token = await Token.findOne({userId: tokenParams.userId, type: tokenParams.type})
    if (token) {
      Object.assign(token, tokenParams)
      await token.save()
      console.log('updated token')
      return token
    }
    else {
      const newToken = new Token(tokenParams)
      await newToken.save()
      console.log('created token')
      return newToken
    }
  } catch (error) {
    throw error
  }


  /*const token = await Token.findOne(tokenId)

  if (!token) {
    throw "token not found"
  }

  Object.assign(token, newTokenParams)
  await token.save()*/
}

async function _delete(tokenId) {
  await Token.findByIdAndRemove(tokenId)
}
