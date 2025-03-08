const { fail } = require('assert');
var express = require('express');
var router = express.Router();
let productSchema = require('../models/products');
let BuildQueies = require('../Utils/BuildQuery');

// Lấy tất cả sản phẩm (chưa bị xóa)
router.get('/', async function(req, res, next) {
  try {
    let queries = req.query;
    let products = await productSchema.find({
      ...BuildQueies.QueryProduct(queries),
      isDeleted: false
    });
    res.status(200).send({
      success: true,
      data: products
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message
    });
  }
});

// Lấy sản phẩm theo ID
router.get('/:id', async function(req, res, next) {
  try {
    let product = await productSchema.findOne({
      _id: req.params.id,
      isDeleted: false
    });
    if (!product) {
      throw new Error('Sản phẩm không tồn tại hoặc đã bị xóa');
    }
    res.status(200).send({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(404).send({
      success: false,
      message: error.message
    });
  }
});

// Tạo sản phẩm mới
router.post('/', async function(req, res, next) {
  try {
    let body = req.body;
    let newProduct = new productSchema({
      productName: body.productName,
      price: body.price,
      quantity: body.quantity,
      categoryID: body.categoryID,
      description: body.description,
      imgURL: body.imgURL
    });
    await newProduct.save();
    res.status(201).send({
      success: true,
      data: newProduct
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error.message
    });
  }
});

// Cập nhật sản phẩm
router.put('/:id', async function(req, res, next) {
  try {
    let body = req.body;
    let product = await productSchema.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      {
        productName: body.productName,
        price: body.price,
        quantity: body.quantity,
        categoryID: body.categoryID,
        description: body.description,
        imgURL: body.imgURL
      },
      { new: true }
    );
    if (!product) {
      throw new Error('Sản phẩm không tồn tại hoặc đã bị xóa');
    }
    res.status(200).send({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(404).send({
      success: false,
      message: error.message
    });
  }
});

// Xóa sản phẩm (xóa mềm)
router.delete('/:id', async function(req, res, next) {
  try {
    let product = await productSchema.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );
    if (!product) {
      throw new Error('Sản phẩm không tồn tại hoặc đã bị xóa');
    }
    res.status(200).send({
      success: true,
      message: 'Sản phẩm đã được đánh dấu là xóa',
      data: product
    });
  } catch (error) {
    res.status(404).send({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;