/**
 * Manually evaluate GrowthBook feature conditions
 * This ensures proper rule evaluation based on user attributes
 */

interface Condition {
  [key: string]: unknown;
  $or?: Condition[];
  $and?: Condition[];
  $not?: Condition;
}

interface Rule {
  id: string;
  condition?: Condition;
  force?: boolean;
  variations?: boolean[];
  key?: string;
}

interface Feature {
  defaultValue?: boolean;
  rules?: Rule[];
}

interface Features {
  [key: string]: Feature;
}

interface Attributes {
  [key: string]: unknown;
}

export function evaluateCondition(condition: Condition | undefined, attributes: Attributes): boolean {
  if (!condition) return true;

  // Handle $or operator
  if (condition.$or && Array.isArray(condition.$or)) {
    return condition.$or.some((cond) => evaluateCondition(cond, attributes));
  }

  // Handle $and operator
  if (condition.$and && Array.isArray(condition.$and)) {
    return condition.$and.every((cond) => evaluateCondition(cond, attributes));
  }

  // Handle $not operator
  if (condition.$not) {
    return !evaluateCondition(condition.$not, attributes);
  }

  // Handle direct attribute matching
  for (const [key, value] of Object.entries(condition)) {
    if (key.startsWith("$")) continue; // Skip operators

    const attrValue = attributes[key];

    if (Array.isArray(value)) {
      if (!value.includes(attrValue)) return false;
    } else {
      if (attrValue !== value) return false;
    }
  }

  return true;
}

export function evaluateFeature(feature: Feature | undefined, attributes: Attributes): boolean {
  if (!feature) return false;

  // Check rules
  if (feature.rules && Array.isArray(feature.rules)) {
    for (const rule of feature.rules) {
      // If condition matches, return the force value
      if (evaluateCondition(rule.condition, attributes)) {
        if (rule.force !== undefined) {
          return rule.force;
        }
        if (rule.variations !== undefined && rule.key !== undefined) {
          // Handle variations if needed
          return rule.variations[0] || false; // Default to first variation
        }
      }
    }
  }

  // Return default value
  return feature.defaultValue || false;
}

export function evaluateAllFeatures(features: Features, attributes: Attributes): Record<string, boolean> {
  const results: Record<string, boolean> = {};

  for (const [featureName, feature] of Object.entries(features)) {

    results[featureName] = evaluateFeature(feature, attributes);
  }

  return results;
}
