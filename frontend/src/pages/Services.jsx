export default function Services() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Our Services</h1>
        <p className="text-gray-600">
          What we offer to users and partners.
        </p>
      </header>

      <ul className="grid gap-4 sm:grid-cols-2">
        <li className="border rounded-lg p-4 space-y-1">
          <h3 className="font-medium">Product Branding</h3>
          <p className="text-sm text-gray-600">
            Organizing products into meaningful categories and brands.
          </p>
        </li>

        <li className="border rounded-lg p-4 space-y-1">
          <h3 className="font-medium">Product Exploration</h3>
          <p className="text-sm text-gray-600">
            Helping users find the right products quickly.
          </p>
        </li>

        <li className="border rounded-lg p-4 space-y-1">
          <h3 className="font-medium">Trusted Redirection</h3>
          <p className="text-sm text-gray-600">
            Redirecting users to secure third-party platforms.
          </p>
        </li>

        <li className="border rounded-lg p-4 space-y-1">
          <h3 className="font-medium">Admin Management</h3>
          <p className="text-sm text-gray-600">
            Full control over categories, subcategories and products.
          </p>
        </li>
      </ul>
    </div>
  );
}
