export interface Pair {
    x: number,
    y: number
}

export interface Intersection {
    x: number,
    y: number,
    distance: number
}

export enum ControlTypes {
    Dummy,
    Real
}