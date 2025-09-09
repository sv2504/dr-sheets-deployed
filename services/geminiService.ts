export async function getFormulaSolution(
  userRequest: string,
  brokenFormula: string
): Promise<string> {
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userRequest, brokenFormula }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.text;

  } catch (error) {
    console.error("Error calling our backend API:", error);
    throw new Error("Failed to get a solution from the server.");
  }
}