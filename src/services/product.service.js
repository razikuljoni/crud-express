import * as productModel from "#models/product.model.js";

export const createProduct = async (productData) => {
    return await productModel.createProduct(productData);
};

export const getAllProducts = async (page = 1, limit = 10, filters = {}) => {
    return await productModel.getAllProducts(page, limit, filters);
};

export const getProductById = async (productId) => {
    return await productModel.findProductById(productId);
};

export const updateProduct = async (productId, updateData) => {
    return await productModel.updateProduct(productId, updateData);
};

export const deleteProduct = async (productId) => {
    return await productModel.deleteProduct(productId);
};

export const getProductsByCategory = async (categoryId, page = 1, limit = 10) => {
    return await productModel.findProductsByCategory(categoryId, page, limit);
};
