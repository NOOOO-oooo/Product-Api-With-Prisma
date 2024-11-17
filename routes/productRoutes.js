const productControllers = require("../controllers/productController");

const router = require("express").Router();

router.post("/", productControllers.createProduct);
router.get("/:id", productControllers.retreiveProduct);
router.put("/:id", productControllers.updateProduct);
router.get("/", productControllers.getAllProducts);
router.delete("/:id", productControllers.deleteproduct);
router.get(
   "/categories/:categoryId",
   productControllers.getProductsByCategoryid
);
module.exports = router;
