'use client';
import React from 'react';
import { useQRCode } from 'next-qrcode';
import { usePathname } from 'next/navigation';

function Qr() {
  const { Canvas } = useQRCode();
  const pathname = usePathname();
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

  return (
    <Canvas
      text={`${baseUrl}${pathname}`}
      options={{
        errorCorrectionLevel: 'M',
        margin: 3,
        scale: 4,
        width: 200,
        color: {
          dark: '#010599FF',
          light: '#FFBF60FF',
        },
      }}
    />
  );
}

export default Qr;
