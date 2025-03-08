const { fail } = require('assert');
var express = require('express');
var router = express.Router();
let categorySchema = require('../models/categories');

// Lấy tất cả danh mục (chưa bị xóa)
router.get('/', async function(req, res, next) {
  try {
    let categories = await categorySchema.find({ isDeleted: false });
    res.status(200).send({
      success: true,
      data: categories
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message
    });
  }
});

// Lấy danh mục theo ID
router.get('/:id', async function(req, res, next) {
  try {
    let category = await categorySchema.findOne({
      _id: req.params.id,
      isDeleted: false
    });
    if (!category) {
      throw new Error('Danh mục không tồn tại hoặc đã bị xóa');
    }
    res.status(200).send({
      success: true,
      data: category
    });
  } catch (error) {
    res.status(404).send({
      success: false,
      message: error.message
    });
  }
});

// Tạo danh mục mới
router.post('/', async function(req, res, next) {
  try {
    let body = req.body;
    let newCategory = new categorySchema({
      categoryName: body.categoryName,
      description: body.description
    });
    await newCategory.save();
    res.status(201).send({
      success: true,
      data: newCategory
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error.message
    });
  }
});

// Cập nhật danh mục
router.put('/:id', async function(req, res, next) {
  try {
    let body = req.body;
    let category = await categorySchema.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      {
        categoryName: body.categoryName,
        description: body.description
      },
      { new: true }
    );
    if (!category) {
      throw new Error('Danh mục không tồn tại hoặc đã bị xóa');
    }
    res.status(200).send({
      success: true,
      data: category
    });
  } catch (error) {
    res.status(404).send({
      success: false,
      message: error.message
    });
  }
});

// Xóa danh mục (xóa mềm)
router.delete('/:id', async function(req, res, next) {
  try {
    let category = await categorySchema.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );
    if (!category) {
      throw new Error('Danh mục không tồn tại hoặc đã bị xóa');
    }
    res.status(200).send({
      success: true,
      message: 'Danh mục đã được đánh dấu là xóa',
      data: category
    });
  } catch (error) {
    res.status(404).send({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;