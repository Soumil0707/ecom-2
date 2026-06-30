import { Request, Response } from "express";
import { Prisma, prisma } from "@repo/product-db";

export const createCategory = async (req: Request, res: Response) => {
    const data: Prisma.CategoryCreateInput = req.body;
    const category = await prisma.category.create({ data });
    res.status(201).json(category);
}
export const updateCategory = async (req: Request, res: Response) => {
    const { id } = req.params
    const data: Prisma.CategoryUpdateInput = req.body

    const updatedCategory = await prisma.category.update({
        where: {
            id: id as string
        },
        data
    })
    return res.status(200).json(updatedCategory)
}
export const deleteCategory = async (req: Request, res: Response) => {
    const { id } = req.params
    const deletedCategory = await prisma.category.delete({
        where: {
            id: id as string
        }
    })
    return res.status(200).json(deletedCategory)
}
export const getCategories = async (req: Request, res: Response) => {
    const categories = await prisma.category.findMany({
        include: {

        }
    })
    res.status(200).json(categories)
}

