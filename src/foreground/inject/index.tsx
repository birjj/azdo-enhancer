/**
 * @fileoverview Handles attaching to various elements as they appear and disappear from the DOM
 * Most of the logic should be handled in individual components
 */

import "./style.module.css";

import InjectionObserver from "./observer";
import iPinnedList from "./project-pinning/inject-list";
import iPinProjectCard from "./project-pinning/inject-project-cards";
import iPinSidebar from "./project-pinning/inject-sidebar";
import iFixPipelineErrors from "./pipeline-errors/inject-pipeline-errors";
import iEnhancePullrequestStyling from "./pullrequest-styling/inject-pullrequest-styling";
import iLogsScrollToBottom from "./logs-scrolltobottom/inject-scrolltobottom";
import iTimeFormat from "./time-format/inject-time-format";
import iLinkifyAzureIds from "./linkify-azure-ids/inject-linkify-azure-ids";
import iLogsSearchPhrases from "./logs-search-phrases/inject-search-phrases";

// start observing the DOM
new InjectionObserver([
  iFixPipelineErrors,
  iPinnedList,
  iPinProjectCard,
  iPinSidebar,
  iEnhancePullrequestStyling,
  iLogsScrollToBottom,
  iLogsSearchPhrases,
  iTimeFormat,
  iLinkifyAzureIds,
]);
