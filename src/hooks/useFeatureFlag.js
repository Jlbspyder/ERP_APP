import { featureFlags } from "../data/featureFlags.js";

export function useFeatureFlag(flagName) {
  return Boolean(featureFlags[flagName]);
}