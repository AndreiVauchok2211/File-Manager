// import { createInterface } from "readline";
// import { stdin as input, stdout as output } from "node:process";
import { homedir } from "node:os";

const pwd = homedir();
//   const rl = createInterface({ input, output });

const username = process.argv
  .find((args) => args.includes("username"))
  .split("=")[1];
console.log(`Welcome to the File Manager, ${username}`);

process.stdin.on("data", (userInput) => {
  const input = userInput.toString().trim();
  selectCommand(input);
});

async function selectCommand(input) {
  const [command, ...args] = input.split(" ");

  switch (command) {
    case ".exit":
      exitApp();
      break;
    default:
      console.log("Invalid input.");
  }
}

process.on("SIGINT", () => {
  exitApp();
});

function exitApp() {
  console.log(`Thank you for using File Manager, ${username}, goodbye!`);
  process.exit(0);
}
