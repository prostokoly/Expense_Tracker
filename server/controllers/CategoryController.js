const db = require('../models');

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await db.Category.findAll();
    res.status(200).json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name, type } = req.body;
    const newCategory = await db.Category.create({ name, type }); 
    res.status(201).json(newCategory); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const category = await db.Category.findByPk(req.params.id); 
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { name, type } = req.body;
    const [updated] = await db.Category.update({ name, type }, { 
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedCategory = await db.Category.findByPk(req.params.id);
      return res.status(200).json(updatedCategory);
    }
    return res.status(404).json({ message: 'Category not found' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const deleted = await db.Category.destroy({ 
      where: { id: req.params.id }
    });
    if (deleted) {
      return res.status(204).send(); 
    }
    return res.status(404).json({ message: 'Category not found' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
