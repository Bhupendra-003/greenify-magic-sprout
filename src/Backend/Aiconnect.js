import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: "AIzaSyDQLQUKzfBlgn-Vv6aMy7ufgdQFK3Ayqus",
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

async function getPriorityRating(query, severity) {
    const response = await openai.chat.completions.create({
        model: "gemini-2.0-flash",
        messages: [
            { 
                role: "system", 
                content: "You are an AI agent specialized in evaluating environmental and cleanliness issues. Rate the severity of the problem on a scale of 1-10, where 10 is most critical. Consider factors like public health impact, environmental damage, and urgency. Provide the rating number first, followed by a brief explanation." 
            },
            {
                role: "user",
                content: `Issue Description: ${query}\nReported Severity: ${severity}`
            },
        ],
    });
    
    return parseInt(response.choices[0].message.content);
}

export default getPriorityRating;
