import React, { useEffect, useRef } from 'react';
import katex from 'katex';

/**
 * Renders a LaTeX string with KaTeX.
 *
 * The container is cleared whenever `math` is empty. Previously the effect
 * bailed out on a falsy value and left the *previous* expression on screen —
 * so an input that became invalid kept showing a stale, wrong formula.
 */
export default function MathRender({ math, block = false, className = '' }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (math === null || math === undefined || math === '') {
      container.textContent = '';
      return;
    }

    const source = String(math);

    try {
      katex.render(source, container, {
        displayMode: block,
        throwOnError: false,
        output: 'htmlAndMathml',
      });
    } catch {
      // Fall back to the raw source rather than leaving an empty box.
      container.textContent = source;
    }
  }, [math, block]);

  // No `role="math"` / `aria-label` here on purpose. KaTeX emits a MathML tree
  // beside its visual output (and marks the visual half aria-hidden), which is
  // what assistive tech should read. Labelling this wrapper would override that
  // and make screen readers announce the raw LaTeX source instead.
  return (
    <span
      ref={containerRef}
      className={`${block ? 'block' : 'inline-block'} max-w-full ${className}`}
    />
  );
}
