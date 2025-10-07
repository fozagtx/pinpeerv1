import { useState, useEffect } from "react";
import "../styles/DarkModeToggle.css";

/**
 * Dark Mode Toggle Component
 * Controls the darkMode setting for Turnkey modals
 * Note: The main app is always dark, this only affects Turnkey modals
 */
export function DarkModeToggle({ onToggle }) {
  const [isDark, setIsDark] = useState(true); // Default to dark mode

  useEffect(() => {
    // Load saved preference
    const savedMode = localStorage.getItem("turnkey-dark-mode");
    if (savedMode !== null) {
      const isDarkMode = savedMode === "true";
      setIsDark(isDarkMode);
      onToggle?.(isDarkMode);
    }
  }, [onToggle]);

  const handleToggle = () => {
    const newMode = !isDark;
    setIsDark(newMode);
    localStorage.setItem("turnkey-dark-mode", newMode.toString());
    onToggle?.(newMode);
  };

  return (
    <button
      onClick={handleToggle}
      className="dark-mode-toggle"
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Turnkey modals: ${isDark ? "Dark" : "Light"} mode`}
    >
      <div className={`toggle-track ${isDark ? "dark" : "light"}`}>
        <div className="toggle-thumb">
          <span className="toggle-icon">{isDark ? "🌙" : "☀️"}</span>
        </div>
      </div>
    </button>
  );
}

export default DarkModeToggle;
