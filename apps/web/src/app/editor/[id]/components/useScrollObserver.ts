"use client";

import { useEffect, useRef, useState } from "react";

export function useScrollObserver(threshold = 0.1) {
    const ref = useRef<HTMLDivElement>(null);
    const [hasIntersected, setHasIntersected] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setHasIntersected(true);
                    observer.disconnect(); // Animate only once per view
                }
            },
            { threshold }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [threshold]);

    return { ref, hasIntersected };
}
