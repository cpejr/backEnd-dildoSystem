const { uncategorize } = require('../models/CategoryModel');
const CategoryModel = require('../models/CategoryModel');

module.exports = {

  async createCategory(request, response) {
    try {
      const newCategory = request.body;

      await CategoryModel.createNewCategory(newCategory);

      response.status(200).json({ id: newCategory.id });
    } catch (err) {
      if (err.errno === 19)
        return response.status(400).json({ notification: "Invalid ids" });
      
      console.error(err);
      return response.status(500).json({ notification: "Internal server error while trying to register the new category" });
    }
  },

  async createSubcategory(request, response) {
    try {
        const newSubcategory = request.body;
  
        await CategoryModel.createNewSubcategory(newSubcategory);
  
        response.status(200).json({ id: newSubcategory.id });
      } catch (err) { 
        if (err.errno === 19)
            return response.status(400).json({ notification: "Invalid ids" });
      
        console.error(err);
        return response.status(500).json({ notification: "Internal server error while trying to register the new Subcategory" });
      }
  },

  async updateCategory(request, response) {
    try {
        const {id} = request.params;
        const newCategory = request.body;
  
        await CategoryModel.updateCategory(newCategory, id);

        response.status(200).json({ message: "Sucesso!" });
      } catch (err) {
        console.error(err);
        return response.status(500).json({ notification: "Internal server error while trying to update category" });
      }
  },

  async updateSubcategory(request, response) {
    try {
        const {id} = request.params;
        const newSubcategory = request.body;
  
        await CategoryModel.updateSubcategory(newSubcategory, id);

        response.status(200).json({ message: "Sucesso!" });
      } catch (err) {
        console.error(err);
        return response.status(500).json({ notification: "Internal server error while trying to update subcategory" });
      }
  },

  async deleteCategory(request, response) {
    try {
        const {id} = request.params;
  
        await CategoryModel.deleteCategory(id);

        response.status(200).json({ message: "Sucesso!" });
      } catch (err) {
        console.error(err);
        return response.status(500).json({ notification: "Internal server error while trying to delete category" });
      }
  },

  async deleteSubcategory(request, response) {
    try {
        const {id} = request.params;
  
        await CategoryModel.deleteSubcategory(id);

        response.status(200).json({ message: "Sucesso!" });
      } catch (err) {
        console.error(err);
        return response.status(500).json({ notification: "Internal server error while trying to delete subcategory" });
      }
  },

  async getCategories(request, response) {
    try {

      const result = await CategoryModel.getCategories();

      return response.status(200).json(result);

    } catch (err) {
      console.error(err);
      return response.status(500).json({notification: "Internal error while trying to get categories"});
    }
  },

  async categorize(request, response){
    try {
      const {product_id} = request.params;
      const {subcategories_ids} = request.body;
      
      const result = await CategoryModel.categorize(product_id, subcategories_ids);

      return response.status(200).json(result);
    } catch (error) {
      console.error(error);
      return response.status(500).json({notification: "Internal error while trying to categorize a product"});
    }
  },

  async uncategorize(request, response){
    try {
      const {product_id, subcategory_id} = request.params;

      const result = await CategoryModel.uncategorize(product_id, subcategory_id);

      return response.status(200).json(result);
    } catch (error) {
      console.error(error);
      return response.status(500).json({notification: "Internal error while trying to delete a subcategory"})
    }
  }
}