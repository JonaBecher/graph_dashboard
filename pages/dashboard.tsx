import {inject} from "mobx-react";
import {observer} from "mobx-react-lite";
import {GraphDashboardStore} from "../stores/GraphDashboardStore";
import React from "react";
import Graph from "../components/graph";
import Searchbar from "../components/searchbar";
import Dropdown from "../components/dropdown";
import EdgeCheckBox from "../components/edgeCheckBox";

React.useLayoutEffect = React.useEffect

type props = {
    graphDashboardStore?: GraphDashboardStore;
};

const Dashboard = inject("graphDashboardStore")(
    observer((props: props) => {
        return <div className="h-screen w-screen">
            <main className="max-w-90 mx-auto px-4">
                <div className="relative z-10 flex items-baseline justify-between pt-4 pb-6 border-b border-gray-300">
                    <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">Netzwerkanalyse</h1>
                </div>
                <section className="pt-2">
                    <div className="grid grid-cols-1 lg:grid-cols-10 col-span-4 gap-x-8 gap-y-10">
                        <div className="lg:col-span-3 bg-white w-fit">
                            <h1 className="pt-4 text-xl py-1 font-semibold text-slate-700">Filter</h1>
                            <Dropdown/>
                            <h2 className="pt-4 text-lg py-1 font-semibold text-slate-700">Schadenfälle</h2>
                            <Searchbar/>
                            <Dropdown/>
                            <Dropdown/>
                            <h2 className="pt-4 text-lg py-1 font-semibold text-slate-700">Verbindungen</h2>
                            <EdgeCheckBox/>
                            <EdgeCheckBox/>
                            <EdgeCheckBox/>
                            <EdgeCheckBox/>
                            <EdgeCheckBox/>
                            <EdgeCheckBox/>
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
