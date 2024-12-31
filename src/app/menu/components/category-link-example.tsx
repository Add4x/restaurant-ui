import Link from "next/link"

// Example component to show how slugs work
export function CategoryExample() {
  // This is just for demonstration
  const category = {
    name: "Breakfast Menu",
    slug: "breakfast-menu",
    description: "Morning dishes"
  }

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-xl font-bold mb-4">How Slugs Work:</h2>
      
      {/* 1. Regular name shown to users */}
      <p className="mb-2">Category Name: {category.name}</p>
      
      {/* 2. Slug used in URL */}
      <p className="mb-4">Category Slug: {category.slug}</p>
      
      {/* 3. Using slug in navigation */}
      <Link 
        href={`/menu/${category.slug}`}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        View {category.name}
      </Link>

      {/* 4. URL Preview */}
      <p className="mt-4 text-gray-600">
        URL will be: yourwebsite.com/menu/breakfast-menu
      </p>
    </div>
  )
}

