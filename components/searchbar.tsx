import { SearchIcon } from '@heroicons/react/solid'
import {inject} from "mobx-react";
import {observer} from "mobx-react-lite";
import {GraphDashboardStore} from "../stores/GraphDashboardStore";

type props = {
    graphDashboardStore?: GraphDashboardStore;
};

const Searchbar = inject("graphDashboardStore")(
    observer((props: props) => {
    return (
        <div>
            <div className="mt-2 relative rounded-md w-full h-10">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                    type="text"
                    id="search"
                    name="Schadenfall suchen.."
                    className="block w-full pl-10 text-md border-gray-300 rounded-md w-full h-10 focus:ring-1 focus:ring-gray-700 focus:border-gray-700"
                    placeholder="Schadenfall suchen.."
                    onKeyUp={(event)=>{
                        if (event.key === "Enter") {
                            event.preventDefault();
                            //@ts-ignore
                            props.graphDashboardStore?.pushSearchString(event.target.value)
                            //@ts-ignore
                            event.target.value = null

                    }}}
                />
            </div>
        </div>
    )})
)

export default Searchbar