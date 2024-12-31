export function createSlug(text: string): string {
  return text
    .toLowerCase()           // Convert to lowercase
    .replace(/\s+/g, '-')   // Replace spaces with hyphens
    .replace(/[^\w-]+/g, '') // Remove special characters (removed escape on hyphen)
    .replace(/-{2,}/g, '-')  // Replace multiple hyphens with single hyphen (simplified)
    .trim()                 // Remove spaces from start and end
}

// Examples:
// createSlug("Breakfast Menu") → "breakfast-menu"
// createSlug("Lunch & Dinner!") → "lunch-dinner"
// createSlug("Kid's Special") → "kids-special"

