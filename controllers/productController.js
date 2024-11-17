const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const express = require("express");
const { get } = require("../routes/productRoutes");

exports.createProduct = async (req, res) => {
   try {
      if (!req.body.name) {
         return res.status(422).json({ error: "Name is required" });
      }

      if (req.body.categoryId === "") {
         return res
            .status(422)
            .json({ error: "Category id field must not be empty" });
      }

      if (!req.body.price) {
         return res.status(422).json({ error: "Price is required" });
      } else {
         if (typeof req.body.price !== "number" || req.body.price < 0) {
            return res
               .status(422)
               .json({ error: "Price must not be a negaive number" });
         }
      }

      if (!req.body.categoryId) {
         return res.status(404).json({ error: "category id is required" });
      } else {
         const categoryId = parseInt(req.body.categoryId);
         const categoryExists = await prisma.category.findUnique({
            where: { id: categoryId },
         });
         if (!categoryExists) {
            return res.status(404).json({ error: "Category is not found" });
         }
      }

      if (req.body.currency.length > 3) {
         return res
            .status(422)
            .json({ error: "Currency type must be within 3 characters max" });
      }

      const addProduct = await prisma.product.create({
         data: {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            currency: req.body.currency,
            quantity: req.body.quantity,
            active: req.body.active,
            categoryId: req.body.categoryId,
         },
      });

      return res.status(201).json(addProduct);
   } catch (error) {
      return res.status(500).json({ error: error.message });
   }
};

exports.retreiveProduct = async (req, res) => {
   try {
      const productid = parseInt(req.params.id);
      const productExists = await prisma.product.findUnique({
         where: { id: productid },

         include: {
            category: {
               select: {
                  name: true,
                  id: true,
               },
            },
         },
         omit: {
            categoryId: true,
         },
      });
      if (!productExists) {
         return res.status(404).json({
            error: `product with id ${productid} does not exist`,
         });
      } else {
         return res.status(200).json(productExists);
      }
   } catch (error) {
      return res.status(500).json({ error: error.message });
   }
};

exports.updateProduct = async (req, res) => {
   try {
      if (req.body.name !== undefined && req.body.name.trim() === "") {
         return res.status(422).json({ error: "Name cannot be empty" });
      }

      if (
         (req.body.price !== undefined && typeof req.body.price !== "number") ||
         req.body.price < 0
      ) {
         return res.status(422).json({ error: "Name cannot be empty" });
      }
      const categoryIdexists = await prisma.category.findUnique({
         where: { id: req.body.categoryId },
      });
      if (req.body.categoryId !== undefined && !categoryIdexists) {
         return res.status(422).json({ error: "category Id cannot be empty" });
      }
      const updateIt = await prisma.product.update({
         data: req.body,
         where: {
            id: parseInt(req.params.id),
         },
         include: {
            category: {
               select: {
                  id: true,
                  name: true,
               },
            },
         },
         omit: {
            categoryId: true,
         },
      });
      res.status(200).json(updateIt);
   } catch (error) {
      res.status(500).json({ error: error.message });
   }
};

exports.getAllProducts = async (req, res) => {
   try {
      const products = await prisma.product.findMany({
         include: {
            category: {
               select: {
                  id: true,
                  name: true,
               },
            },
         },
         omit: {
            categoryId: true,
         },
      });
      return res.status(200).json(products);
   } catch (error) {
      return res.status(500).json({ error: error.message });
   }
};

exports.deleteproduct = async (req, res) => {
   try {
      const productExists = await prisma.product.findUnique({
         where: {
            id: parseInt(req.params.id),
         },
      });
      if (!productExists) {
         return res.status(404).json({
            error: `Product with id : ${req.params.id} was not found`,
         });
      }

      const deletion = await prisma.product.delete({
         where: {
            id: parseInt(req.params.id),
         },
      });
      return res.status(200).json({
         deletion,
         message: `Product with id ${parseInt(req.params.id)} Has been deleted`,
      });
   } catch (error) {
      return res.status(500).json({ error: error.message });
   }
};

exports.getProductsByCategoryid = async (req, res) => {
   try {
      if (
         !(await prisma.category.findUnique({
            where: {
               id: parseInt(req.params.categoryId),
            },
         }))
      ) {
         return res.status(404).json({ message: "category does not exist" });
      }

      const products = await prisma.product.findMany({
         where: {
            categoryId: parseInt(req.params.categoryId),
         },
         include: {
            category: {
               select: {
                  id: true,
                  name: true,
               },
            },
         },
         omit: {
            categoryId: true,
         },
         orderBy: {
            name: "asc",
         },
      });

      return res.status(200).json(products);
   } catch (error) {
      return res.status(500).json({ error: error.message });
   }
};
