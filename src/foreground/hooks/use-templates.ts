import { Template } from "../../background/flows";
import { useEffect, useState } from "react";
import Console from "../../shared/log";
import useSWR from "swr";
import { sendMessage } from "../../shared/messaging";

const fetchTemplates = async () => {
  return (await sendMessage("getTemplates", {})).value;
};

export const useTemplates = () => {
  return useSWR("templates", fetchTemplates);
};

export type TemplateData = { name: string; app: string } & (
  | {
      type: "MODULE";
      subject: string;
    }
  | {
      type: "ACTION";
      subject_prefix: string;
      groups: { id?: string; name: string }[];
    }
  | {
      type: "STATE";
      action: "GET" | "SET" | "MAP" | "";
      subject: string;
      groups: { id?: string; name: string }[];
    }
);
export const useCreateFromTemplate = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const createFromTemplate = async (template: Template, data: TemplateData) => {
    setLoading(true);
    const newFlow: Omit<Flow, "id"> = {
      ...template,
      name: data.name,
      descriptive: {
        ...template.descriptive,
        application: data.app,
      },
    };
    if (data.type === "ACTION") {
      newFlow.descriptive.typeConfig = {
        subjectPrefix: data.subject_prefix,
      };
    } else if (data.type === "MODULE") {
      newFlow.descriptive.typeConfig = {
        subject: data.subject,
      };
    } else if (data.type === "STATE") {
      newFlow.descriptive.typeConfig = {
        action: data.action,
        subject: data.subject,
      };
    }
    try {
      const response = await sendMessage("createFlow", {
        value: newFlow as Flow,
        groups: "groups" in data ? data.groups.map((v) => v.name) : [],
      });
      window.location.href = `/?flowType=ACTION#/applications/app/${data.app}/flow/${response.value}/mode/code`;
    } catch (e) {
      Console.warn("Error while creating from template", e);
      setError("" + e);
    }
    setLoading(false);
  };

  return { loading, error, createFromTemplate };
};
