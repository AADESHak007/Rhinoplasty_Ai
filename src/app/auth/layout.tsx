import React from 'react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0a2342] via-[#185a9d] to-[#43cea2] text-white p-0 m-0">
      {children}
    </div>
  );
} 