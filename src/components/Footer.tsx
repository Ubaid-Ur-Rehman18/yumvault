export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-6 mt-10">
      <div className="max-w-6xl mx-auto text-center">
        <p className="text-lg font-semibold">🍳 YumVault</p>
        <p className="text-sm text-gray-400">
          Your Personal Vault of Tasty Recipes – Cook, Save & Share ❤️
        </p>
        <p className="text-xs text-gray-500 mt-2">
          © {new Date().getFullYear()} YumVault. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
