import path from "path";
import fs from "fs";
import { createReadStream, createWriteStream } from "fs";

export function up(currentDir) {
  return path.dirname(currentDir);
}

export function cd(currentDir, pathToFile, callback) {
  const pathAbsolute = path.resolve(currentDir, pathToFile);
  fs.stat(pathAbsolute, (err, stats) => {
    if (err) {
      callback(err);
    } else if (stats.isDirectory()) {
      callback(null, pathAbsolute);
    } else {
      callback(new Error("Cannot find directory"));
    }
  });
}

export function ls(currentDir, callback) {
  fs.readdir(
    currentDir,
    // process.cwd(),
    { withFileTypes: true },
    (err, filesAndFolders) => {
      if (err) {
        callback(err);
        return;
      }

      const res = filesAndFolders.map((el) => ({
        Name: el.name,
        Type: el.isFile() ? "file" : "directory",
      }));

      res.sort((a, b) => {
        if (a.Type === b.Type) {
          return a.Name.localeCompare(b.Name);
        }
        return a.Type === "directory" ? -1 : 1;
      });

      console.table(res);
      callback(null, res);
    }
  );
}

export function add(currentDir, filname, callback) {
  const filePath = path.join(currentDir, filname);
  fs.open(filePath, "w", (err, fd) => {
    if (err) {
      callback;
      return;
    }

    fs.close(fd, (err) => {
      if (err) {
        callback(err);
        return;
      }
      callback(null);
    });
  });
}

export function rn(currentDir, oldName, newName, callback) {
  currentDir = path.dirname(oldName);
  const oldPath = path.resolve(currentDir, oldName);
  const newPath = path.resolve(currentDir, newName);

  fs.rename(oldPath, newPath, callback);
}

export function cp(currentDir, pathScr, dir, callback) {
  currentDir = path.dirname(pathScr);
  let destenitionPath = path.resolve(dir, path.basename(pathScr));
  let srcFullPath = path.resolve(currentDir, pathScr);
  const readStr = createReadStream(srcFullPath);
  const writeStr = createWriteStream(destenitionPath);
  currentDir = dir;
  readStr.pipe(writeStr);
  callback(null);
}

export function mv(currentDir, pathScr, dir, callback) {
  currentDir = path.dirname(pathScr);
  let destenitionPath = path.resolve(dir, path.basename(pathScr));
  let srcFullPath = path.resolve(currentDir, pathScr);
  const readStr = createReadStream(srcFullPath);
  const writeStr = createWriteStream(destenitionPath);
  currentDir = dir;
  writeStr.on("finish", () => {
    fs.unlink(srcFullPath, (err) => {
      if (err) {
        return callback(err);
      }
      callback(null);
    });
  });
  readStr.pipe(writeStr);
}

export function rm(currentDir, filePath, callback) {
  let fileToPath = path.resolve(currentDir, filePath);
  fs.unlink(fileToPath, callback);
}

export function cat(currentDir, filePath, callback) {
  const fileToPath = path.resolve(currentDir, filePath);
  currentDir = path.dirname(fileToPath);
  fs.stat(fileToPath, (err, stats) => {
    if (err || !stats.isFile()) {
      callback(new Error("Cannot find file"));
      return;
    }

    const stream = createReadStream(fileToPath);
    stream.pipe(process.stdout);
    stream.on("end", callback);
    stream.on("error", (errStream) => {
      console.error(`Error reading file: ${errStream.message}`);
      callback(errStream);
    });
  });
}
