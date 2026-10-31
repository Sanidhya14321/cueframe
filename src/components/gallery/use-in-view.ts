'use client';

import { useEffect, useRef, useState } from 'react';

export const useInView = <Node extends HTMLElement>() => {
  const ref = useRef<Node>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (node === null) {
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry?.isIntersecting ?? false),
      { rootMargin: '200px 0px' },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return { ref, inView };
};
