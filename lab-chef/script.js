const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent";

async function getRecipe() {
    const apiKey = document.getElementById('api-key-input').value.trim();
    const ingredients = document.getElementById('ingredients-input').value.trim();
    const recipeDisplay = document.getElementById("recipe-display");

    if (!apiKey || !ingredients) {
        alert("You must enter both an API key and ingredients!");
        return;
    }

    recipeDisplay.innerHTML = "Cooking up something special... 🍲";

   const prompt = `
Create a simple, creative recipe using ONLY the following ingredients: ${ingredients}.

Rules:
- Do NOT add any extra ingredients.
- Do NOT include explanations or stories.
`;

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-goog-api-key": apiKey
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }]
            })
        });

        const data = await response.json();
        
        // using a real markdown rendering from gpt so make the output prettier
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
        recipeDisplay.innerHTML = marked.parse(text);
    } catch (error) {
        recipeDisplay.innerHTML = "An error occurred while fetching the recipe.";
        console.error(error);
    }
}
