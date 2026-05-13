import { ContentId, defineContent, toContentMap, toContentOrder } from "./defineContent.js";
import { ResourceDefinition } from "./types.js";

export const RESOURCE_DEFINITIONS = defineContent([
  {
    id: "tomorusa",
    name: "灯るさ",
    description: "街や施設が霞に抗って安定している度合い。"
  }
] as const satisfies readonly ResourceDefinition[]);

export type ResourceId = ContentId<typeof RESOURCE_DEFINITIONS>;

export const RESOURCES: Record<ResourceId, ResourceDefinition> = toContentMap(RESOURCE_DEFINITIONS);

export const RESOURCE_ORDER: ResourceId[] = toContentOrder(RESOURCE_DEFINITIONS);
