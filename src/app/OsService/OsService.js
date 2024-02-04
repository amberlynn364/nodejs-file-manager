import os, { EOL, arch, homedir, userInfo } from 'os';

export class OsService {
  getEndOfLine() {
    const eol = EOL && EOL.trim() ? EOL : '\\n';
    console.log(`End-Of-Line (EOL) for the current system: "${eol}".`);
  }

  getCpuInfo() {
    const cpus = os.cpus();
    const cpuCount = os.cpus().length;
    const table = [];

    cpus.forEach((cpu) => {
      const { model, speed } = cpu;
      const clockRateGHz = (speed / 1000).toFixed(2);
      table.push({ Model: model, "Clock Rate (GHz)": clockRateGHz })
    })

    console.log(`Total CPUs: ${cpuCount}`);
    console.table(table, ['Model', 'Clock Rate (GHz)']);
  }

  getHomeDirectory() {
    const homeDir = homedir();
    console.log(`Home directory: ${homeDir}`);
  }

  getUsername() {
    const username = userInfo().username;
    console.log(`Current System User: ${username}`);
  }

  getArchitecture() {
    const architecture = arch();
    console.log(`CPU architecture: ${architecture}`);
  }
}