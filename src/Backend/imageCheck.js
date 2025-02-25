import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";

const genAI = new GoogleGenerativeAI('AIzaSyBV1IyH4BTP16qb5mlR5ompeOxGVcO7i6A');

function fileToGenerativePart(path, mimeType) {
    return {
        inlineData: {
            data: Buffer.from(fs.readFileSync(path)
        ).toString("base64"),
            mimeType,
        },
    };
}

async function run() {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const prompt = "Is this image of trash?";
    const imageParts = [fileToGenerativePart("public/images/phirana.jpg", "image/jpeg")];
    const generatedContent = await model.generateContent([prompt, ...imageParts]);
    console.log(generatedContent.response.text());
}

run();
