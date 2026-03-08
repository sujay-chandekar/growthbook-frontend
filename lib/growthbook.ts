interface FeaturesResponse {
  status: number;
  features?: Record<string, unknown>;
  experiments?: unknown[];
  dateUpdated?: string;
}

// Function to load features from backend proxy
export const loadFeatures = async (): Promise<FeaturesResponse> => {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    const sdkUrl = `${apiUrl}/features`;

    const response = await fetch(sdkUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to load features: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error loading features:", error);
    throw error;
  }
};
