import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { RiDiscordFill, RiTwitterXLine } from "react-icons/ri";
import { FaGithub } from "react-icons/fa6";
import { PeerNotification } from "./PeerNotification";
import selfieSvg from "../assets/undraw_selfie-fun_0qzh.svg";
import focusedSvg from "../assets/undraw_focused_m9bj.svg";
import stacksSvg from "../assets/stacks@logotyp.us.svg";
import "../styles/LandingPage.css";

const randomNames = [
  "Alex Chen",
  "Sarah Martinez",
  "Jordan Kim",
  "Emma Thompson",
  "Marcus Johnson",
  "Priya Patel",
  "Carlos Rodriguez",
  "Yuki Tanaka",
];

const words = ["Creators", "Builders"];

export function LandingPage() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % words.length);
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="landing-page">
      <PeerNotification names={randomNames} />
      <div className="landing-content">
        <div className="hero-section">
          <h1 className="hero-title">
            Support Amazing{" "}
            <motion.span
              key={currentWordIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              style={{ display: "inline-block" }}
            >
              {words[currentWordIndex]}
            </motion.span>
          </h1>
          <p className="hero-subtitle">
            Pin your favorite peers and support their work with STX
          </p>
        </div>

        <div className="svg-group-right">
          <motion.div
            className="svg-decoration top"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <img
              src={selfieSvg}
              alt="Creator illustration"
              className="svg-image"
            />
          </motion.div>

          <motion.div
            className="svg-decoration middle"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <img
              src={stacksSvg}
              alt="Stacks logo"
              className="svg-image stacks-logo"
            />
          </motion.div>

          <motion.div
            className="svg-decoration bottom"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <img
              src={focusedSvg}
              alt="Focused creator illustration"
              className="svg-image"
            />
          </motion.div>
        </div>
      </div>

      <motion.footer
        className="footer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
      >
        <div className="footer-container">
          <div className="footer-grid">
            {/* Brand Section */}
            <div className="footer-brand">
              <div className="footer-logo">
                <span className="footer-logo-text">PinPeer</span>
              </div>
              <div className="footer-social">
                <a
                  href="https://github.com/fozagtx/pinpeer"
                  className="footer-social-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaGithub className="footer-icon" />
                </a>
                <a
                  href="https://x.com/zanbuilds"
                  className="footer-social-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <RiTwitterXLine className="footer-icon" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
