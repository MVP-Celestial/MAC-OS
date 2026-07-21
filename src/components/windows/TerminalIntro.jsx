import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

const TerminalIntro = ({ lines, onComplete, startDelay = 200 }) => {
  const [visibleCount, setVisibleCount] = useState(0);
  const [typedText, setTypedText] = useState("");
  const timeoutRef = useRef(null);
  const lastEnterRef = useRef(0);
  const skippedRef = useRef(false);

  useEffect(() => {
    const kickoff = setTimeout(() => runLine(0), startDelay);
    return () => clearTimeout(kickoff);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // double-Enter to skip
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key !== "Enter" || skippedRef.current) return;

      const now = Date.now();
      if (now - lastEnterRef.current < 400) {
        skipToEnd();
      }
      lastEnterRef.current = now;
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const skipToEnd = () => {
    if (skippedRef.current) return;
    skippedRef.current = true;
    clearTimeout(timeoutRef.current);
    setVisibleCount(lines.length);
    setTypedText("");
    onComplete?.();
  };

  const runLine = (index) => {
    if (skippedRef.current) return;

    if (index >= lines.length) {
      onComplete?.();
      return;
    }

    const line = lines[index];
    const isTyping = (line.type ?? "typing") === "typing";

    if (!isTyping) {
      setVisibleCount(index + 1);
      timeoutRef.current = setTimeout(
        () => runLine(index + 1),
        (line.delay ?? 0) + 250
      );
      return;
    }

    setVisibleCount(index + 1);
    let charIndex = 0;
    const speed = line.speed ?? 35;

    const typeChar = () => {
      if (skippedRef.current) return;
      charIndex += 1;
      setTypedText(line.text.slice(0, charIndex));

      if (charIndex < line.text.length) {
        timeoutRef.current = setTimeout(typeChar, speed);
      } else {
        timeoutRef.current = setTimeout(
          () => {
            setTypedText("");
            runLine(index + 1);
          },
          (line.delay ?? 0) + 200
        );
      }
    };

    typeChar();
  };

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  return (
    <div className="terminal-intro">
      {lines.slice(0, visibleCount).map((line, i) => {
        const isCurrent = i === visibleCount - 1;
        const isTyping = (line.type ?? "typing") === "typing";
        const displayText = isCurrent && isTyping ? typedText : line.text;

        return (
          <motion.div
            key={i}
            className="terminal-intro__line"
            style={{ color: line.color ?? "#00ff00" }}
            initial={isTyping ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            {displayText || "\u00A0"}
            {isCurrent && isTyping && displayText.length < line.text.length && (
              <BlinkingCursor />
            )}
          </motion.div>
        );
      })}
      <div className="terminal-intro__hint"></div>
    </div>
  );
};

const BlinkingCursor = () => (
  <motion.span
    className="terminal-intro__cursor"
    animate={{ opacity: [1, 0] }}
    transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
  >
    ▋
  </motion.span>
);

export default TerminalIntro;