const CategoryController = require("../controllers/categoryController");
const router = require("express").Router();

router.post("/", CategoryController.createCategory);
router.get("/", CategoryController.getCategories);
router.put("/:id", CategoryController.updateCategory);
router.delete("/:id", CategoryController.deleteCategory);
module.exports = router;
