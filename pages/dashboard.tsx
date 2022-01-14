import {inject} from "mobx-react";
import {observer} from "mobx-react-lite";
import {GraphDashboardStore} from "../stores/GraphDashboardStore";
import React from "react";
import Graph from "../components/graph";
import Searchbar from "../components/searchbar";
import DropDownSwitchMode from "../components/dropDownSwitchMode";
import EdgeCheckBox from "../components/edgeCheckBox";
import DropDownNodeRadius from "../components/dropDownNodeRadius";
import DropDownNodeText from "../components/dropDownNodeText";
import TimeSelect from "../components/timeSelect";

React.useLayoutEffect = React.useEffect

type props = {
    graphDashboardStore?: GraphDashboardStore;
};

const Dashboard = inject("graphDashboardStore")(
    observer((props: props) => {
        let checkboxes = [];

        // @ts-ignore
        for (const [key, value] of Object.entries(props.graphDashboardStore?.edgeColors)) {
            checkboxes.push(<EdgeCheckBox color={value} text={key} key={key}/>)
        }
        let searchStringsList: any = []
        let id = 0;
        props.graphDashboardStore?.searchStrings.forEach((searchString) => {
            searchStringsList.push(
            <span
                key={id.toString()}
                className="text-gray-800 mr-2 mt-2 inline-flex rounded-full items-center py-0.5 pl-2.5 pr-1 text-sm font-medium bg-gray-100">
                {searchString}
                <button
                    onClick={()=>{
                        console.log(id)
                        props.graphDashboardStore?.removeSearchString(id);
                    }}
                    type="button"
                    className="flex-shrink-0 ml-0.5 h-4 w-4 rounded-full hover:bg-gray-200 hover:text-gray-500 focus:outline-none focus:bg-gray-500 focus:text-white inline-flex items-center justify-center text-gray-400"
                >
                  <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                    <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7"/>
                  </svg>
                </button>
              </span>)
            id++
        })

        return <div className="h-screen w-screen">
            <main className="max-w-full mx-auto px-40">
                <div className="relative z-10 flex items-baseline justify-between pt-4 pb-6 border-b border-gray-300">
                    <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">Netzwerkanalyse</h1>
                </div>
                <section className="pt-2">
                    <div className="grid grid-cols-1 lg:grid-cols-10 col-span-4 gap-x-8 gap-y-10">
                        <div className="lg:col-span-3 bg-white w-fit">
                            <h1 className="pt-4 text-xl pb-4 py-1 font-semibold text-slate-700">Filter</h1>
                            <TimeSelect/>
                            <p className="text-sm pb-0 -mb-2 text-slate-700">Ansicht</p>
                            <DropDownSwitchMode/>
                            <h2 className="pt-4 text-lg py-1 font-semibold text-slate-700">Schadenfälle</h2>
                            <Searchbar/>
                            <div className="flex flex-row max-w-60 flex-wrap">
                                {searchStringsList}
                            </div>
                            <p className="pt-4 text-sm pb-0 -mb-2 text-slate-700">Beschriftung</p>
                            <DropDownNodeText/>
                            {
                                props.graphDashboardStore?.mode === 0 ? <>
                                    <p className="pt-4 text-sm pb-0 -mb-2 text-slate-700">Radius</p>
                                    <DropDownNodeRadius/></> : <></>
                            }
                            <h2 className="pt-4 text-lg py-1 font-semibold text-slate-700">Verbindungen</h2>
                            {checkboxes}
                        </div>
                        <div className="lg:block lg:col-span-7 ">
                            <div className="w-full h-full relative" id="graphBackground">
                                <Graph/>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    })
)

export default Dashboard;
