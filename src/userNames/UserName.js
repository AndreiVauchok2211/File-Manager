export function getUserName() {
  const username = process.argv
    .slice(2)
    .find((arg) => arg.includes("--username"))
    .split("=")[1];
  if (!username) {
    return "anonymous user";
  }
  return username;
}
