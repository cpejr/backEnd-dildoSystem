const DataBaseModel = require('../models/DatabaseModel');
const { uploadFile } = require('../models/GoogleDriveModel');


module.exports = {
  async index(request, response) {
    try {
      const filter = request.query;
      const {max_price, min_price, order_by, order_ascending, page} = filter;
      delete filter.max_price;
      delete filter.min_price;
      delete filter.order_by;
      delete filter.order_ascending;
      delete filter.page;
      let type = "retailer";
      if (request.session)
        type = request.session.user.type;

      let query = { visible: true, ...filter };
      if (type === 'admin')
        query = { ...filter };

      const result = await DataBaseModel.getProducts(type, query, max_price, min_price, order_by, order_ascending, page);
      return response.status(200).json(result);

    } catch (err) {
      console.log(err);
      return response.status(500).json({ notification: "Internal server error while trying to get products" });
    }
  },

  async create(request, response) {
    try {
      const newProduct = request.body;
      const { originalname, buffer, mimetype } = request.file;

      const image_id = await uploadFile(buffer, originalname, mimetype);

      newProduct.image_id = image_id;

      const [id] = await DataBaseModel.createNewProduct(newProduct);

      response.status(200).json({ id });
    } catch (err) {
      console.log(err);
      return response.status(500).json({ notification: "Internal server error while trying to register the new product" });
    }
  },

  async update(request, response) {
    try {
      const newProduct = request.body;
      const { originalname, buffer, mimetype } = request.file;

      const { id } = request.params;

      const image_id = await uploadFile(buffer, originalname, mimetype);

      newProduct.image_id = image_id;

      await DataBaseModel.updateProduct(newProduct, id);

      response.status(200).json({ message: "Sucesso!" });
    } catch (err) {
      console.log(err);
      return response.status(500).json({ notification: "Internal server error while trying to update product" });
    }
  },

  async getProduct(request, response) {
    try {
      const { product_id } = request.params;

      let showWholesaler = false;
      if (request.session){
        const type = request.session.user.type;
        showWholesaler = type === "admin" || type === "wholesaler";
      }

      const promises = [];

      promises.push(DataBaseModel.getProductbyId(product_id, showWholesaler));
      promises.push(DataBaseModel.getSubproductsbyProductId(product_id));

      const result = await Promise.all(promises);
      let data = result[0];
      if (data)
        data.subproducts = result[1];

      return response.status(200).json(data);

    } catch (err) {
      console.log(err);
      return response.status(500).json({ notification: "Internal server error while trying to get products" });
    }
  },

  async delete(request, response) {
    try {
      const { product_id } = request.params;
      await DataBaseModel.deleteProduct(product_id);
      response.status(200).json({message: "Deleted product: " + product_id});
    } catch (err) {
      return response.status(500).json({ notification: "Internal server error while trying to delete product" });
    }
  },

}