import React, {useState} from "react";
import {inject} from "mobx-react";
import {observer} from "mobx-react-lite";
import {edges, GraphDashboardStore} from "../stores/GraphDashboardStore";

type props = {
    text:string,
    color:string,
    graphDashboardStore?: GraphDashboardStore;
}

const EdgeCheckbox = inject("graphDashboardStore")(
    observer((props: props) => {
        const isEdgeDisabled= (edgeID: string)=>{
            return props.graphDashboardStore!.disabledEdges.indexOf(edgeID) != -1;

        }

        const isEdgeActive = (edgeID: string)=>{
            return (props.graphDashboardStore!.activeEdges.length === 0 || props.graphDashboardStore!.activeEdges!.indexOf(edgeID) > -1)
                && !isEdgeDisabled(edgeID);

        }
    return (
        <div className="relative flex items-center align-middle h-5 w-5 mt-2"
             onClick={()=>{
                     if (isEdgeActive(props.text)){
                         props.graphDashboardStore?.removeActiveEdge(props.text);
                         props.graphDashboardStore?.pushDisabledEdge(props.text);

                     }else{
                         props.graphDashboardStore?.removeDisabledEdge(props.text);
                     }
             }}
        >
            <input
                onChange={()=>{

                }}
                checked={isEdgeActive(props.text)}
                name="comments"
                type="checkbox"
                className="focus:ring-white h-5 w-5 border-gray-300 rounded"
                style={{color: `rgba(${props.color}, 1)`}}
            />
            <div className="ml-3 text-md">
                <label className="text-size-lg" style={{color: `rgba(${props.color}, 1)`}}>
                    {props.text}
                </label>
            </div>
        </div>
    )
}));

export default EdgeCheckbox;