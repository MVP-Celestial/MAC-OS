import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Macwindow from "./Macwindow";
import TerminalIntro from "./TerminalIntro";
import "./cli.scss";
import TerminalPkg from "react-console-emulator";
import { getRandomAscii, welcomeAscii } from "../../data/asciiArt";

const Terminal = TerminalPkg.default || TerminalPkg;

const commands = {
  about: {
    description: "Learn about me",
    fn: () => "Hey! I'm a full-stack developer who loves building beautiful web experiences.",
  },
  skills: {
    description: "List my technical skills",
    fn: () => "React, Node.js, Python, TypeScript, Tailwind CSS, MongoDB, PostgreSQL",
  },
  projects: {
    description: "Show my projects",
    fn: () => "1. Portfolio OS - A macOS-inspired portfolio\n2. ChatApp - Real-time messaging app\n3. E-Shop - Full-stack e-commerce platform",
  },
  contact: {
    description: "Get my contact info",
    fn: () => "Email: hello@example.com\nGitHub: github.com/example\nLinkedIn: linkedin.com/in/example",
  },
  socials: {
    description: "Show my social links",
    fn: () => "Twitter: @example\nGitHub: github.com/example\nDiscord: example#0001",
  },
  resume: {
    description: "View my resume",
    fn: () => "Opening resume... check the Resume window!",
  },
  ascii: {
    description: "Generate a random ASCII art",
    fn: () => getRandomAscii(),
  },
};

const commandList = [
  "Welcome to my portfolio CLI!",
  "",
  "Available commands:",
  "  about    - Learn about me",
  "  skills   - List my technical skills",
  "  projects - Show my projects",
  "  contact  - Get my contact info",
  "  socials  - Show my social links",
  "  resume   - View my resume",
  "  ascii    - Random ASCII art",
  "  clear    - Clear the terminal",
];

const asciiLines = welcomeAscii.split("\n");

const introLines = [
  { text: commandList[0], type: "typing", speed: 30 },
  ...commandList.slice(1).map((line) => ({
    text: line,
    type: "fade",
  })),
  { text: "", type: "fade", delay: 200 },
  ...asciiLines.map((line) => ({
    text: line,
    type: "fade",
    color: "#00ff00",
  })),
];

const Cli = ({ onClose }) => {
  const [introDone, setIntroDone] = useState(false);

  return (
    <Macwindow onClose={onClose}>
      <div className="cli-window">
        <AnimatePresence mode="wait">
          {!introDone ? (
            <motion.div
              key="intro"
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="cli-window__intro-wrap"
            >
              <TerminalIntro
                lines={introLines}
                onComplete={() => setIntroDone(true)}
              />
            </motion.div>
          ) : (
            <motion.div
              key="terminal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.35 }}
              style={{ height: "100%" }}
            >
              <Terminal
                commands={commands}
                welcomeMessage={commandList}
                messageStyle={{ color: "#00ff00" }}
                promptLabel={"celestial:~$"}
                promptLabelStyle={{ color: "#00ff00" }}
                style={{ backgroundColor: "transparent" }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Macwindow>
  );
};

export default Cli;