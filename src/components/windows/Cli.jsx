import React from "react";
import Macwindow from "./Macwindow";
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

const Cli = ({onClose}) => {
  return (
    <Macwindow onClose={onClose}>
      <div className="cli-window">
        <Terminal
          commands={commands}
          welcomeMessage={[
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
            "",
            ...welcomeAscii.split("\n"),
          ]}
          messageStyle={{ color: "#00ff00" }}
          promptLabel={"celestial:~$"}
          promptLabelStyle={{ color: "#00ff00" }}
          style={{ backgroundColor: "transparent" }}
        />
      </div>
    </Macwindow>
  );
};

export default Cli;
