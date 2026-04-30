import { useEffect, useState } from 'react';

export function CountUp({ end, duration = 2000 }) {
  const [count, setCount] = useState(0);
  const endValue = parseInt(end.replace(/,/g, ''), 10);

  useEffect(() => {
    let startTime = null;
    const animateCount = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const current = Math.min(Math.floor((progress / duration) * endValue), endValue);
      setCount(current);
      if (progress < duration) {
        requestAnimationFrame(animateCount);
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          requestAnimationFrame(animateCount);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    const parent = document.getElementById(`countup-${end}`);
    if (parent) observer.observe(parent);

    return () => observer.disconnect();
  }, [end, duration]);

  return <h4 id={`countup-${end}`}>{count.toLocaleString()}+</h4>;
}
