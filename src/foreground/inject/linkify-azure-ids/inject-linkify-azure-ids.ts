import { InjectionConfig } from "../utils";
import console from "../../../shared/log";
import { getSettingValue } from "../../../shared/settings";

import style from "./inject-linkify-azure-ids.module.css";

function getTextNodes($elm: HTMLElement) {
  const outp: Node[] = [];
  const walker = document.createTreeWalker($elm, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    outp.push(walker.currentNode);
  }
  return outp;
}

function createLinkFromId(
  id: string,
  details: { precedingText?: string; content?: string | Node }
) {
  const isFullId = id.startsWith("/subscriptions/");
  const url = isFullId
    ? `https://portal.azure.com/#@kmddima.onmicrosoft.com/resource${id}`
    : `https://portal.azure.com/#view/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/~/Overview/query/${id}`;
  const $link = document.createElement("a");
  $link.href = url;
  $link.target = "_blank";
  $link.classList.add("is-link", style.link);
  $link.replaceChildren(details.content ?? id);
  return $link;
}

/** Matches any UUID or full Azure ID surrounded by quotation marks, capturing the ID in the 'id' group */
const azureIdRegex =
  /(['"])(?<id>[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}|\/subscriptions\/[^"']+)\1/g;

function linkifyAzureIds($elm: HTMLElement) {
  const content = $elm.textContent ?? "";
  // abort early if we don't have any IDs
  if (!azureIdRegex.test(content)) {
    return;
  }
  azureIdRegex.lastIndex = 0;
  // otherwise walk through our DOM tree and find all TextNodes that contain IDs
  for (const $text of getTextNodes($elm)) {
    const content = $text.textContent ?? "";
    const matches = content.matchAll(azureIdRegex);
    // swap each match with the corresponding link
    const $parent = $text.parentNode;
    const newChildren: Node[] = [];
    let lastIndex = 0;
    let hasReplaced = false;
    for (const match of matches) {
      hasReplaced = true;
      let precedingText = "";
      if (match.index! > lastIndex) {
        precedingText = content.substring(lastIndex, match.index!);
        newChildren.push(document.createTextNode(precedingText));
      }
      newChildren.push(
        createLinkFromId(match.groups!["id"], {
          precedingText,
          content: match[0],
        })
      );
      lastIndex = match.index! + match[0].length;
    }
    newChildren.push(document.createTextNode(content.substring(lastIndex)));
    if (hasReplaced) {
      $parent?.replaceChildren(...newChildren);
    }
  }
}

const iLinkifyAzureIds: InjectionConfig = {
  selector: `.line-row .content`,
  mount: ($elm) => {
    linkifyAzureIds($elm);
  },
  unmount: ($elm) => {},
  gate: async () => {
    const setting = await getSettingValue("linkify-azure-ids");
    return setting;
  },
};
export default iLinkifyAzureIds;
