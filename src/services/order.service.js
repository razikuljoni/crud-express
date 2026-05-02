import * as orderModel from "#models/order.model.js";

export const createOrder = async (orderData) => {
    const orderWithMeta = {
        ...orderData,
        status: "pending",
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    return await orderModel.createOrder(orderWithMeta);
};

export const getAllOrders = async (page = 1, limit = 10, filters = {}) => {
    return await orderModel.getAllOrders(page, limit, filters);
};

export const getOrderById = async (orderId) => {
    return await orderModel.findOrderById(orderId);
};

export const updateOrder = async (orderId, updateData) => {
    return await orderModel.updateOrder(orderId, { ...updateData, updatedAt: new Date() });
};

export const deleteOrder = async (orderId) => {
    return await orderModel.deleteOrder(orderId);
};

export const getOrdersByUserId = async (userId, page = 1, limit = 10) => {
    return await orderModel.findOrdersByUserId(userId, page, limit);
};
