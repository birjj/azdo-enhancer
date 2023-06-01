<div align="center"><img src="./assets/ext/icon128.png" /></div>

# AZDO Enhancer

A browser extension to fix up Azure DevOps so it sucks a little less.

Current features:

<details><summary><b> Show ANSI errors correctly in pipeline status pages</b></summary>

![Comparison of pipeline errors containing ANSI escape codes](./docs/pipeline_errors.png)

</details>

<details><summary><b> Pin projects to the AZDO header for easy access</b></summary>

![Screenshot of project pinning](./docs/project_pinning.png)

</details>

## Installation

Make sure Node and NPM are installed. Then:

<table><thead><tr><th>Chrome</th><th>Firefox</th></tr></thead>
<tbody><tr><td>

1. Download the repo
2. Run `npm install` and `npm run build`
3. Navigate to `chrome://extensions` in your browser and enable developer mode (toggle in top-right)
4. Click "Load unpacked" and choose the `dist` folder

</td><td>

1. Download the repo
1. Run `npm install` and `npm run build`
1. Manually remove the line containing `"use_dynamic_url": true` from `dist/manifest.json`
1. Navigate to `about:debugging#/runtime/this-firefox` (or go to `about:addons`, click the settings icon, and choose "Debug Add-ons")
1. Click "Load Temporary Add-on..." and choose the `dist/manifest.json` file.

</td>
