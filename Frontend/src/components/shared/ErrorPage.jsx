import React from 'react'

export default function ErrorPage() {
  return (
    <div className="h-screen flex items-center justify-center flex-col">
      <h1 className="text-4xl font-bold">404 Not Found</h1>
      <p className="mt-2 text-gray-600">The page you are looking for doesn’t exist.</p>
    </div>
  );
}
