import "../styles/globals.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="bg-gray-900 text-white">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  )
}
