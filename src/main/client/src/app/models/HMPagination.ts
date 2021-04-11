import { HMEmbedded } from "./HMEmbedded";
import { HMPage } from "./HMPage";
import { HMRel } from "./HMRel";

export interface HMPagination {
    _embedded: HMEmbedded;
    _links: HMRel;
    page: HMPage;
}