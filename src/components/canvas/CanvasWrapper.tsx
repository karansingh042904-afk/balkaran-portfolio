'use client';

import React, { useSyncExternalStore } from 'react';
import dynamic from 'next/dynamic';

const DynamicHeroCanvas = dynamic(() => import('./HeroCanvas'), {
  ssr: false,
  loading: () => null,
});

const emptySubscribe = () => () => {};

export function CanvasWrapper() {
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  if (!isClient) return null;

  return <DynamicHeroCanvas />;
}
