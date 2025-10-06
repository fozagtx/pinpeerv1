import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/PeerNotification.css";

const amounts = [5, 10, 25, 50];

export function PeerNotification({ names }) {
  const [notification, setNotification] = useState(null);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const showRandomNotification = () => {
      const randomName = names[Math.floor(Math.random() * names.length)];
      const randomAmount = amounts[Math.floor(Math.random() * amounts.length)];
      setNotification({ name: randomName, amount: randomAmount });
      setShowNotification(true);

      setTimeout(() => {
        setShowNotification(false);
      }, 3000);
    };

    // Show first notification after 2 seconds
    const initialTimeout = setTimeout(() => {
      showRandomNotification();
    }, 2000);

    // Then show every 4 seconds
    const interval = setInterval(() => {
      showRandomNotification();
    }, 4000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [names]);

  return (
    <AnimatePresence>
      {showNotification && notification && (
        <motion.div
          className="peer-notification"
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="notification-icon">⭐</div>
          <div className="notification-content">
            <span className="notification-name">{notification.name}</span>
            <span className="notification-text">
              got peered with{" "}
              <strong className="notification-amount">
                {notification.amount} STX
              </strong>
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
