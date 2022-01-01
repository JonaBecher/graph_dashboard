import {action, makeObservable, observable} from "mobx";
import {enableStaticRendering} from "mobx-react";
import React from "react";

const isServer = typeof window === "undefined";

// eslint-disable-next-line react-hooks/rules-of-hooks
enableStaticRendering(isServer);

type d3NodeExtra = {
    vx?: number,
    vy?: number,
    x?: number,
    y?: number,
}

type Node = d3NodeExtra & {
    id: string,
    label: string,
    date: string,
    score: number
}

type Edge = {
    target: string | Node,
    source: string | Node,
    value: number | Node,
}
// @ts-ignore
export {Edge, Node};

let nodes:Node[] = [
    {
    id: "mammal",
    label: "Mammals",
    date: "12.01.2021",
    score: 0.1
},
    {
        id: "dog",
        label: "Dogs",
        date: "12.02.2021",
        score: 0.4
    },
    {
        id: "cat",
        label: "Cats",
        date: "18.02.2021",
        score: 0.6
    },
    {
        id: "fox",
        label: "Foxes",
        date: "01.03.2021",
        score: 0.1
    },
    {
        id: "elk",
        label: "Elk",
        date: "05.08.2021",
        score: 0.9
    },
    {
        id: "insect",
        label: "Insects",
        date: "09.08.2021",
        score: 0.65
    },
    {
        id: "ant",
        label: "Ants",
        date: "17.09.2021",
        score: 0.1
    },
    {
        id: "bee",
        label: "Bees",
        date: "26.09.2021",
        score: 0.47
    },
    {
        id: "fish",
        label: "Fish",
        date: "12.10.2021",
        score: 0.24
    },
    {
        id: "carp",
        label: "Carp",
        date: "12.12.2021",
        score: 0.74
    },
    {
        id: "pike",
        label: "Pikes",
        date: "22.12.2021",
        score: 0.99
    }
]
export {nodes};

let edges:Edge[] = [
    {
    target: "mammal",
    source: "dog",
    value: 12345
},
    {
        target: "mammal",
        source: "cat",
        value: 12345

    },
    {
        target: "mammal",
        source: "fox",
        value: 12345

    },
    {
        target: "mammal",
        source: "elk",
        value: 12345

    },
    {
        target: "insect",
        source: "ant",
        value: 54321

    },
    {
        target: "insect",
        source: "bee",
        value: 54321

    },
    {
        target: "fish",
        source: "carp",
        value: 54321
    },
    {
        target: "fish",
        source: "pike",
        value: 12345

    },
    {
        target: "cat",
        source: "elk",
        value: 12345

    },
    {
        target: "carp",
        source: "ant",
        value: 54321
    },
    {
        target: "elk",
        source: "bee",
        value: 12345

    },
    {
        target: "dog",
        source: "cat",
        value: 54321
    },
    {
        target: "fox",
        source: "ant",
        value: 54321
    },
    {
        target: "pike",
        source: "cat",
        value: 54321
    }
]
export {edges};

export class GraphDashboardStore {

    @observable activeNodes: number[] = observable([]);
    @observable disabledNodes: number[] = observable([]);
    @observable clickedNodes: number[]  = observable([]); //toDo: seleced Node

    @observable clickedEdge = null;
    @observable highlightNode = null;
    @observable selectedDate = null;

    constructor() {
        makeObservable(this);
    }
}

