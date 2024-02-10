import readline from "readline";
import os from "os";
import { getUserName } from "./src/userNames/UserName.js";
import { errors } from "./src/utils/errors.js";
import { Cmd } from "./src/Cmd.js";

const homeDir = os.homedir();
let currentDir = homeDir;

const args = process.argv.slice(2);

console.log(`Welcome to the File Manager, ${getUserName()}!`);

const cmd = new Cmd(currentDir);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "Enter your command: ",
});

const printCurrDir = () => {
  console.log(`You are currently in ${cmd.currentDir}`);
};

process.on("exit", () => {
  console.log(`Thank you for using File Manager, ${getUserName()}, goodbye!`);
});

process.on("SIGINT", () => {
  process.exit();
});

const hundleInputProcces = (error) => {
  if (error) {
    console.log(`Operation failed: ${error.message}`);
  }
  printCurrDir();
  rl.prompt();
};

const selectCommand = (input) => {
  const [command, ...args] = input.trim().split(" ");

  switch (command) {
    case ".exit":
      process.exit();
    case "up":
      cmd.up();
      hundleInputProcces();
      break;
    case "cd":
      if (args.length > 0) {
        cmd.cd(args.join(" "), hundleInputProcces);
      } else {
        hundleInputProcces(new Error(errors.PATH_REQUIRED));
      }
      break;
    case "ls":
      cmd.ls();
      hundleInputProcces();
      break;
    case "add":
      if (args.length > 0) {
        cmd.add(args[0], hundleInputProcces);
      } else {
        hundleInputProcces(new Error(errors.FILENAME_REQUIRED));
      }
      break;
    case "rn":
      if (args.length >= 2) {
        cmd.rn(args[0], args[1], hundleInputProcces);
      } else {
        hundleInputProcces(new Error(errors.INVALID_INPUT));
      }
      break;
    case "cp":
      if (args.length >= 2) {
        cmd.cp(args[0], args[1], hundleInputProcces);
      } else {
        hundleInputProcces(new Error(errors.INVALID_INPUT));
      }
      break;
    case "mv":
      if (args.length >= 2) {
        cmd.mv(args[0], args[1], hundleInputProcces);
      } else {
        hundleInputProcces(new Error(errors.INVALID_INPUT));
      }
      break;
    case "cat":
      if (args.length > 0) {
        cmd.cat(args[0], () => {
          console.log("");
          hundleInputProcces();
        });
      } else {
        hundleInputProcces(new Error(errors.FILE_REQUIRED));
      }
      break;
    case "rm":
      if (args.length) {
        cmd.rm(args[0], hundleInputProcces);
      } else {
        hundleInputProcces(new Error(errors.PATH_REQUIRED));
      }
      break;
    default:
      hundleInputProcces(new Error(errors.INVALID_INPUT));
      break;
  }
};

rl.on("line", (line) => {
  selectCommand(line);
}).on("close", () => {
  process.exit();
});

printCurrDir();
rl.prompt();
