const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const express = require("express");

exports.createCategory = async (req, res) => {
   try {
      if (!req.body.name) {
         return res.status(422).json({ error: "Name is required" });
      }

      if (
         await prisma.category.findUnique({ where: { name: req.body.name } })
      ) {
         return res
            .status(409)
            .json({ error: `${req.body.name} Category already exists` });
      }

      const newCategory = await prisma.category.create({
         data: {
            name: req.body.name,
         },
      });

      return res.status(201).json(newCategory);
   } catch (error) {
      return res.status(500).json({ error: error.message });
   }
};

exports.getCategories = async (req, res) => {
   try {
      const categories = await prisma.category.findMany();
      return res.status(200).json(categories);
   } catch (error) {
      return res.status(500).json({ error: error.message });
   }
};

exports.updateCategory = async (req, res) => {
   try {
      if (!req.body.name) {
         return res.status(422).json({ error: "Name is required" });
      }

      if (
         await prisma.category.findUnique({ where: { name: req.body.name } })
      ) {
         return res
            .status(409)
            .json({ error: `${req.body.name} category already exists` });
      }
      const update = await prisma.category.update({
         data: {
            name: req.body.name,
         },
         where: { id: parseInt(req.params.id) },
      });
      return res.status(200).json(update);
   } catch (error) {
      return res.status(500).json({ error: error.message });
   }
};

exports.deleteCategory = async (req, res) => {
   try {
      if (
         !(await prisma.category.findUnique({
            where: { id: parseInt(req.params.id) },
         }))
      ) {
         return res.status(404).json({
            error: `There is no category with id: ${req.params.id}`,
         });
      }

      const deleteCategories = await prisma.category.delete({
         where: { id: parseInt(req.params.id) },
      });
      return res
         .status(200)
         .json({
            deleteCategories,
            message: `Category with id ${parseInt(
               req.params.id
            )} Has been deleted`,
         });
   } catch (error) {
      return res.status(500).json({ error: error.message });
   }
};
