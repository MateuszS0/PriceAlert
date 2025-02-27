import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDB } from "@/lib/scraper/mongoose";
import { updateProductGroup } from '@/lib/actions';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).end(); // Method Not Allowed
    }
    console.log("handler called");

    const { productId, newGroup } = req.body;

    console.log("Received data:", { productId, newGroup });

    if (!productId || newGroup === undefined) {
        return res.status(400).json({ message: 'Missing productId or newGroup' });
    }

    try {
        await connectToDB();
        const result = await updateProductGroup(productId, newGroup);

        if (!result) {
            console.log('Product not found');
            return res.status(404).json({ message: 'Product not found' });
        }

        console.log('Product updated:', result);
        res.status(200).json({ message: 'Group updated successfully', product: result });
    } catch (error) {
        console.error('Error updating group:', error);
        res.status(500).json({ message: 'Internal Server Error', error });
    }
}