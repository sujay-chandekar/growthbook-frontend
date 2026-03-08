import { GrowthBook } from "@growthbook/growthbook";

interface Feature {
  defaultValue?: boolean;
  rules?: any[];
}

interface Features {
  [key: string]: Feature;
}

interface Attributes {
  [key: string]: unknown;
}

/**
 * Evaluate a single feature using GrowthBook SDK
 */
export function evaluateFeature(
  featureName: string,
  features: Features,
  attributes: Attributes
): boolean {

  const gb = new GrowthBook({
    features,
    attributes
  });

  return gb.isOn(featureName);
}


/**
 * Evaluate all features for a user
 */
export function evaluateAllFeatures(
  features: Features,
  attributes: Attributes
): Record<string, boolean> {

  const gb = new GrowthBook({
    features,
    attributes
  });

  const results: Record<string, boolean> = {};

  for (const featureName of Object.keys(features)) {
    results[featureName] = gb.isOn(featureName);
  }

  return results;
}