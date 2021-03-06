const connection = require('../database/connection');
const FirebaseModel = require('../models/FirebaseModel');
const UserModel = require('../models/UserModel');
const { forgottenPassword } = require('../validators/UserValidator');

const Email = require('../mail/mail.js')

module.exports = {
  async index(request, response) {
    const { user_status } = request.query;
    let query = user_status ? { user_status } : {};
    const users = await UserModel.getUsers(query);

    return response.json(users);
  },

  async getOne(request, response) {
    const { id } = request.params;
    const users = await UserModel.getUserById(id);
    return response.json(users);
  },

  async create(request, response) {
    const user = request.body;
    if(user.type === "retailer"){
      user.user_status = "approved";
    };
    let firebaseUid;
    try {
      firebaseUid = await FirebaseModel.createNewUser(user.email, user.password);
      user.firebase = firebaseUid;

      delete user.password;
      await connection('users').insert(user);

      const data = {
        to: user.email,
        subject: 'Bem Vindo',
        text: 'Loja Casulus',
        user_name: user.name
      }

      Email.resgisterMail(data);
      
    } catch (err) {

      if (firebaseUid)
        FirebaseModel.deleteUser(firebaseUid)

      if (err.message)
        return response.status(400).json({ notification: err.message });

      //console.log("User creation failed: " + err);
      return response.status(500).json({ notification: "Internal server error while trying to register user" });
    }
    return response.status(200).json({ notification: "Usuario criado!" });
  },

  async delete(request, response) {

    try {
      const { id } = request.params;

      const user = await UserModel.getUserById(id);
      //console.log(user);

      await FirebaseModel.deleteUser(user.firebase);

      await UserModel.deleteUser(id);

      response.status(200).json({ message: "Sucesso!" });
    } catch (err) {
      console.error(err);
      return response.status(500).json({ notification: "Internal server error while trying to delete user" });
    }
  },

  async update(request, response) {
    try {
      const { id } = request.params;
      const newUser = request.body;
      const { password, email } = request.body;

      if (password) {
        const user = await UserModel.getUserById(id);

        const firebaseUid = user.firebase;

        await FirebaseModel.changeUserPassword(firebaseUid, password);

        delete newUser.password;
      }

      if (email) {
        const user = await UserModel.getUserById(id);

        const firebaseUid = user.firebase;

        await FirebaseModel.changeUserEmail(firebaseUid, email);
      }

      // console.log("teste do body: ", request.body);
      await UserModel.updateUser(newUser, id);

      //email logic
      const user_ = await UserModel.getUserById(id)
      if(user_.type === "retailer" && user_.user_status === "approved"){
        const data = {
          to: user_.email,
          subject: 'Bem Vindo',
          text: 'Loja Casulus',
          user_name: user_.name
        }

        Email.retailerAprovalMail(data)
      }

      response.status(200).json({ message: "Sucesso!" });
    } catch (err) {
      console.error(err);
      return response.status(500).json({ notification: "Internal server error while trying to update user" });
    }
  },

  async forgottenPassword(request, response) {
    try {
      const { email } = request.body;

      const resp = await FirebaseModel.sendPasswordChangeEmail(email);

      response.status(200).json({ message: "Sucesso!" });
    }
    catch (err) {
      console.error(err);
      return response.status(500).json({ notification: err.message });
    }
  },

  async getWishList(request, response) {
    try {

      const { id } = request.params;

      const result = await UserModel.getWish(id);

      return response.status(200).json(result);

    } catch (err) {
      console.error(err);
      return response.status(500).json({notification: "Internal error while trying to get wish list"})
    }
  },

  async createWish(request, response) {
    try {
        // const { id } = request.params;
        const newWish = request.body;
  
        await UserModel.createNewWish(newWish);
  
        response.status(200).json({ id: newWish.id });
      } catch (err) { 
        if (err.errno === 19)
            return response.status(400).json({ notification: "Invalid" });
      
        console.error(err);
        return response.status(500).json({ notification: "Internal server error while trying to create Wish" });
      }
  },

  async deleteAWish(request, response) {
    try {
      const { user_id, product_id } = request.body;
      // console.log(user_id, product_id);

      const resp = await UserModel.deleteWish(product_id, user_id);

      response.status(200).json({ message: "Sucess!" });
    } catch (err) {
      if (err.errno === 19)
            return response.status(400).json({ notification: "Invalid" });
      
        console.error(err);
        return response.status(500).json({ notification: "Internal server error while trying to delete Wish" });
    }
  },

  async getUserAddress(request, response) {
    try {

      const { id } = request.params;

      const result = await UserModel.getUserAddress(id);

      return response.status(200).json(result);

    } catch (err) {
      console.error(err);
      return response.status(500).json({notification: "Internal error while trying to get user address"})
    }
  },

  async createUserAddress(request, response) {
    try {
        // const { id } = request.params;
        const newUserAddress = request.body;
  
        await UserModel.createNewUserAddress(newUserAddress);
  
        response.status(200).json({ id: newUserAddress.id });
      } catch (err) { 
        if (err.errno === 19)
            return response.status(400).json({ notification: "Invalid" });
      
        console.error(err);
        return response.status(500).json({ notification: "Internal server error while trying to create user address" });
      }
  },

  async deleteUserAddress(request, response) {
    try {
      const { user_id, address_id } = request.body;
      //console.log(user_id, address_id);

      const resp = await UserModel.deleteUserAddress(user_id, address_id);

      response.status(200).json({ message: "Sucess!" });
    } catch (err) {
      if (err.errno === 19)
            return response.status(400).json({ notification: "Invalid" });
      
        console.error(err);
        return response.status(500).json({ notification: "Internal server error while trying to delete user address" });
    }
  }
}