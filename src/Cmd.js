import * as fsModules from "./fs/fsModules.js";

export class Cmd {
  constructor(currentDir) {
    this.currentDir = currentDir;
  }

  up() {
    this.currentDir = fsModules.up(this.currentDir);
    console.log(this.currentDir);
  }

  cd(pathToFile, callback) {
    fsModules.cd(this.currentDir, pathToFile, (err, pathAbsolute) => {
      if (!err) {
        this.currentDir = pathAbsolute;
      }
      callback(err, this.currentDir);
    });
  }

  ls(callback) {
    fsModules.ls(this.currentDir, callback);
  }

  add(filename, callback) {
    fsModules.add(this.currentDir, filename, callback);
  }

  rn(oldName, newName, callback) {
    fsModules.rn(this.currentDir, oldName, newName, callback);
  }

  cp(pathScr, dir, callback) {
    fsModules.cp(this.currentDir, pathScr, dir, callback);
  }

  cat(filePath, callback) {
    fsModules.cat(this.currentDir, filePath, callback);
  }

  mv(pathScr, dir, callback) {
    fsModules.mv(this.currentDir, pathScr, dir, callback);
  }

  rm(filePath, callback) {
    fsModules.rm(this.currentDirectory, filePath, callback);
  }
}
