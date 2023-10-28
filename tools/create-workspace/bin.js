#!/usr/bin/env node

// reference: https://github.com/rdmurphy/create-clone

// native
import { promises as fs } from 'fs';
import https from 'https';
import { resolve } from 'path';

// packages
import { extract } from 'tar';
import hostedGitInfo from 'hosted-git-info';
import chalk from 'chalk';

const WORKSPACE_GITHUB_URL = 'https://github.com/temarusanov/workspace#main';

async function ensureDirIsEmpty(dir) {
  try {
    const files = await fs.readdir(dir);

    if (files.length > 0) {
      throw new Error(
        `The output directory already contains files (${resolve(dir)})`
      );
    }
  } catch (err) {
    if (err.code !== 'ENOENT') throw err;
  }
}

async function ensureDir(dir) {
  try {
    await fs.mkdir(dir);
  } catch (err) {
    if (err.code !== 'EEXIST') throw err;
  }
}

async function prepareProject(dest) {
  fs.rm(`${dest}/libs/external`, { recursive: true }).catch(() => {});
  fs.rm(`${dest}/tools/create-workspace`, { recursive: true }).catch(() => {});
  fs.rm(`${dest}/tools/scripts`, { recursive: true }).catch(() => {});
  fs.rm(`${dest}/.github`, { recursive: true }).catch(() => {});

  const nxJsonFilePath = `${dest}/nx.json`;
  const file = JSON.parse(await fs.readFile(nxJsonFilePath, 'utf8'));

  delete file.nxCloudAccessToken;

  await fs.writeFile(nxJsonFilePath, JSON.stringify(file, null, 2));
}

function downloadTarball(url, type, dest) {
  return new Promise((resolve, reject) => {
    const headers = {};

    https
      .get(url, { headers }, (res) => {
        const code = res.statusCode;

        if (!code || code >= 400) {
          return reject({ code, message: res.statusMessage });
        }
        if (code >= 300) {
          return downloadTarball(new URL(res.headers.location), type, dest)
            .then(resolve)
            .catch(reject);
        }

        const extractor = extract({ cwd: dest, strip: 1 });

        res.pipe(extractor).on('finish', resolve).on('error', reject);
      })
      .on('error', reject);
  });
}

export async function downloadProject(repoPath, dest) {
  const info = hostedGitInfo.fromUrl(repoPath);
  const type = info.type;

  const urlToTarball = info.tarball();

  if (!urlToTarball) {
    throw new Error(
      'Unable to determine where to download the archive for this repository'
    );
  }

  const url = new URL(urlToTarball);

  // make sure the directory exists
  await ensureDir(dest);

  await ensureDirIsEmpty(dest);

  // download the repo into the directory
  await downloadTarball(url, type, dest);

  await prepareProject(dest);
}

async function main(argv_) {
  const args = argv_.slice(2);

  // we only care about the first command, anything else is whatever
  const [dest = process.cwd() + `/workspace`] = args;

  await downloadProject(WORKSPACE_GITHUB_URL, dest);
  console.log(
    `\n${chalk.green('Project was successfully created!')}\n${chalk.blue(
      'Documentation:'
    )} https://temarusanov.github.io/dev-notes/\n\nNext steps:\n   - git init --initial-branch=main\n   - nvm install\n   - npm install\n`
  );
}

main(process.argv).catch(console.error);
