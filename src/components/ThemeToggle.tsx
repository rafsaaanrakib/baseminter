import React, { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [dark]);

  return (
    <button
      onClick={() => setDark((d) => !d)}
      className="ml-4 flex items-center px-3 py-2 rounded-lg border border-blue-200 bg-white/80 hover:bg-blue-100 transition text-blue-900 font-bold shadow"
      aria-label="Toggle dark/light mode"
    >
      {dark ? (
        <span className="flex items-center gap-1"><svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M21.64 13.64A9 9 0 0 1 10.36 2.36a1 1 0 0 0-1.13 1.13A7 7 0 0 0 12 21a7 7 0 0 0 9.51-8.51 1 1 0 0 0-1.13-1.13z"/></svg> Dark</span>
      ) : (
        <span className="flex items-center gap-1"><svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M6.76 4.84l-1.8-1.79-1.42 1.42 1.79 1.8A7.93 7.93 0 0 0 4 12a8 8 0 1 0 8-8 7.93 7.93 0 0 0-7.16 4.84zM12 20a8 8 0 0 1-8-8 8 8 0 1 1 8 8z"/></svg> Light</span>
      )}
    </button>
  );
}
