// SOURCE: skills/react-best-practices/rules/rendering-hydration-no-flicker.md
// HASH: 716298e11a25412eb3fa38b87e364c244eee70871971fc6c7f0cdb19e59ffd41
import type { ReactNode } from 'react'

export function ThemeWrapper({ children }: { children: ReactNode }) {
  return (
    <>
      <div id="theme-wrapper">
        {children}
      </div>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                var theme = localStorage.getItem('theme') || 'light';
                var el = document.getElementById('theme-wrapper');
                if (el) el.className = theme;
              } catch (e) {}
            })();
          `,
        }}
      />
    </>
  )
}
