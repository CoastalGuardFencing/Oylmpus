// Simple fallback functions for when AI is not available
export function getOfflineReview(code: string, languages: string[], intent: string): any {
  return {
    feedback: "Offline Mode: This is a simulated review. Please configure your Gemini API key for full functionality.",
    feedbackDetails: [
      { category: "Offline Mode", message: "API key not configured - using fallback responses" }
    ],
    improvedCode: code + "\n// Offline mode - no AI improvements available",
    isPerfect: false,
    resonanceScore: 5,
    offline: true
  };
}

export function getOfflineChatResponse(message: string): string {
  return "Offline Mode: I'm not able to provide AI responses without a valid API key. Please configure your Gemini API key in the .env.local file.";
}

export function getOfflineWhitePaper(): any {
  return {
    title: "Offline Mode Demo",
    abstract: "This is a placeholder document generated in offline mode.",
    content: "Please configure your Gemini API key for full functionality."
  };
}