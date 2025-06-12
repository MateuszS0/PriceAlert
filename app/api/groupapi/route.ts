import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/scraper/mongoose";
import { updateProductGroup } from "@/lib/actions";
import Product from "@/models/productSchemaMongoose";

export async function POST(req: Request) {
    console.log("API Route Hit");

    try {
        const body = await req.json();
        console.log("Request Body:", body);

        const { productId, newGroup } = body;

        if (!productId || newGroup === undefined) {
            console.error("Missing required fields");
            return NextResponse.json({ message: "Missing productId or newGroup" }, { status: 400 });
        }

        await connectToDB();
        const result = await updateProductGroup(productId, newGroup);

        if (!result) {
            console.error("Product Not Found");
            return NextResponse.json({ message: "Product not found" }, { status: 404 });
        }

        console.log("Product Updated Successfully:", result);
        return NextResponse.json({ message: "Group updated successfully", product: result }, { status: 200 });

    } catch (error) {
        console.error("Internal Server Error:", error);
        return NextResponse.json({ message: "Internal Server Error", error }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    console.log("Delete API Route Hit");

    try {
        const body = await req.json();
        console.log("Request Body:", body);

        const { productId } = body;

        if (!productId) {
            console.error("Missing productId");
            return NextResponse.json({ message: "Missing productId" }, { status: 400 });
        }

        await connectToDB();
        const result = await Product.findByIdAndDelete(productId);

        if (!result) {
            console.error("Product Not Found");
            return NextResponse.json({ message: "Product not found" }, { status: 404 });
        }

        console.log("Product Deleted Successfully:", result);
        return NextResponse.json({ message: "Product deleted successfully", product: result }, { status: 200 });

    } catch (error) {
        console.error("Internal Server Error:", error);
        return NextResponse.json({ message: "Internal Server Error", error }, { status: 500 });
    }
}