/**
 * @fileoverview Handles attaching to various elements as they appear and disappear from the DOM
 * Most of the logic should be handled in individual components
 */

import "./style.module.css";
import { InjectedHTMLElement, InjectionConfig } from "./utils";

import console from "../../shared/log";
import { sendMessage } from "../../shared/messaging";
import pipelineErrorsInjection from "./inject-pipeline-errors";
import {
  projectPinListInjection,
  projectPinningInjection,
} from "./inject-project-pinning";
import InjectionObserver from "./observer";

// start observing the DOM
new InjectionObserver([
  pipelineErrorsInjection,
  projectPinningInjection,
  projectPinListInjection,
]);
