import { HMLink } from "./HMLink";

export interface HMRel {
    books: HMLink;
    first: HMLink;
    prev: HMLink; 
    self: HMLink;
    next: HMLink;
    last: HMLink;
}