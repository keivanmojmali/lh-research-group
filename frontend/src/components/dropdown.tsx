"use client";
import { Fragment, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';

// Define a type for the option objects expected in the options array
interface Option {
    id: string;
    name: string;
}

// Define the props type for the component
interface DropdownProps {
    options: Option[];
    value: string;
    onChange: (value: string) => void;
    title: string;
}

const Dropdown: React.FC<DropdownProps> = ({ options, value, onChange, title }) => {
    // Initialize the selected state based on the provided value
    const [selected, setSelected] = useState<Option>(
        options.find(option => option.name === value) || options[0]
    );

    // Function to handle selection changes
    const handleChange = (selectedOption: Option) => {
        setSelected(selectedOption);
        onChange(selectedOption.name);  // Pass back the name of the selected option
    };

    return (
        <div>
            <label className="block text-sm font-medium leading-6 text-gray-900">
                {title}
            </label>
            <Listbox value={selected} onChange={handleChange}>
                {({ open }) => (
                    <>
                        <div className="relative">
                            <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
                                <span className="block truncate">{selected.name}</span>
                                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                    <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                </span>
                            </Listbox.Button>

                            <Transition
                                show={open}
                                as={Fragment}
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                    {options.map((option) => (
                                        <Listbox.Option
                                            key={option.id}
                                            value={option}
                                            className={({ active }) =>
                                                `relative cursor-default select-none py-2 pl-8 pr-4 ${active ? 'bg-indigo-600 text-white' : 'text-gray-900'}`
                                            }
                                        >
                                            {({ selected, active }) => (
                                                <>
                                                    <span className={`block truncate ${selected ? 'font-semibold' : 'font-normal'}`}>
                                                        {option.name}
                                                    </span>
                                                    {selected && (
                                                        <span className={`absolute inset-y-0 left-0 flex items-center pl-1.5 ${active ? 'text-white' : 'text-indigo-600'}`}>
                                                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                        </span>
                                                    )}
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
        </div>
    );
}

export default Dropdown;
