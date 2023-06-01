/**
 * @fileoverview Handles attaching to various elements as they appear and disappear from the DOM
 * Most of the logic should be handled in individual components
 */

import "./style.module.css";

import InjectionObserver from "./observer";
import iPinnedList from "./project-pinning/inject-list";
import iPinProjectCard from "./project-pinning/inject-project-cards";
import iPinSidebar from "./project-pinning/inject-sidebar";
import iFixPipelineErrors from "./inject-pipeline-errors";

// start observing the DOM
new InjectionObserver([
  iFixPipelineErrors,
  iPinnedList,
  iPinProjectCard,
  iPinSidebar,
]);
