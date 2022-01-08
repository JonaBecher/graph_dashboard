import { SearchIcon } from '@heroicons/react/solid'

export default function Searchbar() {
    return (
        <div>
            <div className="mt-2 relative rounded-md w-80  h-10">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                    type="text"
                    name="Schadenfall suchen.."
                    className="block w-full pl-10 text-md border-gray-300 rounded-md w-full h-10"
                    placeholder="Schadenfall suchen.."
                />
            </div>
        </div>
    )
}