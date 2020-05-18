const connection = require('../database/connection');

module.exports = {
  getUserByUid(uid) {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await connection("users").where("firebase", uid).select("*").first();
        resolve(user);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  },

  createNewProduct(product) {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await connection("products").insert(product);
        resolve(response);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  },

  updateProduct(product, product_id) {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await connection("products").where({ id: product_id }).update(product);
        resolve(response);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  },

  getProductbyId(id) {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await connection("products").where("id", id).select("*").first();
        resolve(response);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  },

  getCredentials() {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await connection("credentials").select("*").first();
        resolve(response);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    })
  },

  updateCredentials(credentials) {
    return new Promise(async (resolve, reject) => {
      try {
        const token = await connection("credentials").first();

        if (!token) {
          createCredentials(credentials)
        }

        const response = await connection("credentials").first().update(credentials);
        resolve(response);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    })
  },

  createCredentials: createCredentials
}

function createCredentials(credentials) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await connection("credentials").insert(credentials);
      resolve(response);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  })
}