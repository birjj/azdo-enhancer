export const SETTINGS = {
  "logs-scrolltobottom": {
    title: "Add scroll buttons to logs",
    description: "Adds buttons for scrolling to start/end of long build logs",
    default: true as boolean,
  },
  "pipeline-errors": {
    title: "Format build issues",
    description:
      "Formats build issues correctly, displaying ANSI content and URLs correctly",
    default: true as boolean,
  },
  "project-pinning": {
    title: "Shortcuts",
    description:
      "Adds the ability to pin often-used sections to the navigation bar",
    default: true as boolean,
  },
  "pullrequest-styling": {
    title: "Style pull requests",
    description: "Styles the list of pull requests for easier scanability",
    default: true as boolean,
  },
  "time-format": {
    title: "Absolute timestamps",
    description: "Converts relative timestamps to absolute",
    default: true as boolean,
  },
  "linkify-azure-ids": {
    title: "Linkify Azure IDs",
    description: "Add links to Azure resource IDs in pipeline logs",
    default: true as boolean,
  },
  "wrap-log-lines": {
    title: "Wrap log lines",
    description: "Add button to wrap long lines in pipeline logs",
    default: true as boolean,
  },
} as const;

export const storageKeyFromName = (name: keyof typeof SETTINGS) =>
  `settings.${name}`;

const _cache: { [k: string]: any } = {};

export const getSettingValue = async <K extends keyof typeof SETTINGS>(
  name: K
): Promise<typeof SETTINGS[K]["default"]> => {
  const key = storageKeyFromName(name);
  if (key in _cache) {
    return _cache[key];
  }
  const data = await chrome.storage.local.get([key]);
  if (!(key in data)) {
    return SETTINGS[name].default;
  }
  _cache[key] = data[key];
  return data[key];
};
