import { Request, Response } from "express";
import { prisma, Prisma } from "@repo/product-db";

export const createProduct = async (req: Request, res: Response) => {
    const { id, ...rest } = req.body;
    const data: Prisma.ProductCreateInput = {
        ...rest,
        id: id !== undefined && id !== null && String(id).trim() !== "" ? String(id) : undefined,
    };

    const { colors, images } = data

    if (!colors || !Array.isArray(colors) || colors.length === 0) {
        return res.status(400).json({ message: "Colors must be an array with at least one color" })
    }

    if (!images || typeof images !== "object" || Array.isArray(images)) {
        return res.status(400).json({ message: "Images must be an object containing image URLs for each color" })
    }

    const missingColors = colors.filter((color) => !(color in (images as Record<string, any>)));
    if (missingColors.length > 0) {
        return res.status(400).json({ message: "Colors missing from images object", missingColors })
    }

    const product = await prisma.product.create({ data });
    res.status(201).json(product);
}
export const updateProduct = async (req: Request, res: Response) => {
    const { id } = req.params
    const data: Prisma.ProductUpdateInput = req.body

    const updatedProduct = await prisma.product.update({
        where: {
            id: id as string
        },
        data
    })
    return res.status(200).json(updatedProduct)
}
export const deleteProduct = async (req: Request, res: Response) => {
    const { id } = req.params

    const deletedProduct = await prisma.product.delete({
        where: {
            id: id as string
        }
    })
    return res.status(200).json(deletedProduct)
}
export const getProduct = async (req: Request, res: Response) => {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
        where: {
            id: id as string
        }
    });
    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
}
export const getAllProducts = async (req: Request, res: Response) => {

    const { sort, category, search, limit } = req.query;

    const orderBY = (() => {
        switch (sort) {
            case ('asc'):
                return { price: Prisma.SortOrder.asc }
                break
            case ('desc'):
                return { price: Prisma.SortOrder.desc }
                break
            case ('oldest'):
                return { createdAt: Prisma.SortOrder.asc }
                break
            case ('newest'):
                return { createdAt: Prisma.SortOrder.desc }
                break
            default:
                return { createdAt: Prisma.SortOrder.desc }
        }
    })()

    const products = await prisma.product.findMany({
        where: {
            category: {
                slug: category as string,
            },
            name: {
                contains: search as string,
                mode: "insensitive",
            }

        },
        take: parseInt(limit as string) || 10,
        orderBy: orderBY
    });
    res.status(200).json(products);
}



