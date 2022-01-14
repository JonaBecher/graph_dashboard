import { Fragment, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'
import {inject} from "mobx-react";
import {observer} from "mobx-react-lite";
import {GraphDashboardStore} from "../stores/GraphDashboardStore";

const options = [
    { id: 0, name: 'Bitte wählen' },
    { id: 1, name: 'Schadenhoehe' },
    { id: 2, name: 'Anzahl Nachbarn' },
]

type props = {
    graphDashboardStore?: GraphDashboardStore;
};


function classNames(...classes:any) {
    return classes.filter(Boolean).join(' ')
}

const dropDownNodeRadius = inject("graphDashboardStore")(
    observer((props: props) => {
    const [selected, setSelected] = useState(options[0])

    let setValue = (id:number)=>{
        props.graphDashboardStore?.setNodeRadiusType(id);
    }

    return (
        <Listbox value={selected} onChange={(option) => {setValue(option.id); setSelected(option)}}>
            {({ open }) => (
                <>
                    <div className="relative h-10 mt-4 ">
                        <Listbox.Button className="bg-white relative w-full border border-gray-300 rounded-md pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-gray-700 focus:border-gray-700">
                            <span className="block truncate">{selected.name}</span>
                            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <SelectorIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </span>
                        </Listbox.Button>

                        <Transition
                            show={open}
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none">
                                {options.map((option) => (
                                    <Listbox.Option
                                        key={option.id}
                                        className={({ active }) =>
                                            classNames(
                                                active ? 'text-white bg-gray-700' : 'text-gray-900',
                                                'cursor-default select-none relative py-2 pl-3 pr-9'
                                            )
                                        }
                                        value={option}
                                    >
                                        {({ selected, active }) => (
                                            <>
                        <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>
                          {option.name}
                        </span>

                                                {selected ? (
                                                    <span
                                                        className={classNames(
                                                            active ? 'text-white' : 'text-gray-600',
                                                            'absolute inset-y-0 right-0 flex items-center pr-4'
                                                        )}
                                                    >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                                                ) : null}
                                            </>
                                        )}
                                    </Listbox.Option>
                                ))}
                            </Listbox.Options>
                        </Transition>
                    </div>
                </>
            )}
        </Listbox>
    )
}))

export default dropDownNodeRadius;