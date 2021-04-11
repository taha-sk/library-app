import { HMRel } from "./HMRel";

export interface Book {
    title: string;
    author: string;
    _links: HMRel;
}