'use client';
import React, { useState } from 'react';
import { Fragment } from 'react'
import { Disclosure } from '@headlessui/react'
import { ChevronDownIcon, ChevronUpIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

// Navigation item type
type NavItem = {
    name: string
    current: boolean
}

// Initialize the navigation items
const initialNavigation: NavItem[] = [
    { name: 'Planner', current: true },
    { name: 'How-To', current: false },
];

// Utility function to apply classes conditionally
function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}

function Navbar({ navigation, setNavigation }: { navigation: NavItem[], setNavigation: (items: NavItem[]) => void }) {
    return (
        <Disclosure as="nav" className="bg-gray-800">
            {({ open }) => (
                <>
                    <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                        <div className="relative flex h-16 items-center justify-between">
                            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                                {/* Mobile menu button */}
                                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                                    <span className="sr-only">Open main menu</span>
                                    {open ? (
                                        <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                                    ) : (
                                        <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                                    )}
                                </Disclosure.Button>
                            </div>
                            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                                <div className="flex flex-col flex-shrink-0 items-center justify-center">
                                    <h1 className="text-white font-bold text-xl">Lesson Extractor</h1>
                                </div>
                                <div className="hidden sm:ml-6 sm:block">
                                    <div className="flex space-x-4">
                                        {navigation.map((item, index) => (
                                            <a
                                                key={item.name}
                                                onClick={() => {
                                                    // Update the navigation items to reflect the current page
                                                    const updatedNavigation = navigation.map((navItem, navIndex) => ({
                                                        ...navItem,
                                                        current: navIndex === index
                                                    }));
                                                    setNavigation(updatedNavigation);
                                                }}
                                                className={classNames(
                                                    item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                                    'rounded-md px-3 py-2 text-sm font-medium'
                                                )}
                                                aria-current={item.current ? 'page' : undefined}
                                            >
                                                {item.name}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    <Disclosure.Panel className="sm:hidden">
                        <div className="space-y-1 px-2 pb-3 pt-2">
                            {navigation.map((item, index) => (
                                <Disclosure.Button
                                    key={item.name}
                                    onClick={() => {
                                        // Update the navigation items to reflect the current page for mobile
                                        const updatedNavigation = navigation.map((navItem, navIndex) => ({
                                            ...navItem,
                                            current: navIndex === index
                                        }));
                                        setNavigation(updatedNavigation);
                                    }}
                                    className={classNames(
                                        item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                        'block rounded-md px-3 py-2 text-base font-medium'
                                    )}
                                    aria-current={item.current ? 'page' : undefined}
                                >
                                    {item.name}
                                </Disclosure.Button>
                            ))}
                        </div>
                    </Disclosure.Panel>
                </>
            )}
        </Disclosure>
    );
}

const HelloBanner: React.FC = () => {
    return (
        <div className="bg-blue-600 text-white mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 py-6">
            <h2 className="text-2xl font-bold">Hello!</h2>
            <p className="mt-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum auctor, felis a congue cursus, nulla arcu volutpat odio, vel dignissim nisi turpis nec risus. Duis ac magna nec libero sodales volutpat.</p>
        </div>
    );
};

const LessonExtractor: React.FC = () => {
    const [navigation, setNavigation] = useState(initialNavigation);

    return (
        <div>
            <div id='navbar'><Navbar navigation={navigation} setNavigation={setNavigation} /></div>
            <div id='banner'>
                <Disclosure>
                    {({ open }) => (
                        <>
                            {open && <HelloBanner />}
                            <Disclosure.Button className="bg-gray-800 text-white w-full mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 py-2 flex items-center">
                                <span className="font-bold">Directions</span>
                                {open ? (
                                    <ChevronUpIcon className="ml-2 h-5 w-5" aria-hidden="true" />
                                ) : (
                                    <ChevronDownIcon className="ml-2 h-5 w-5" aria-hidden="true" />
                                )}
                            </Disclosure.Button>
                        </>
                    )}
                </Disclosure>
            </div>
            <div id='main'>
                {/* The main content will vary based on the current page */}
                {navigation.find(nav => nav.current)?.name}
            </div>
            <div id='footer'></div>
        </div>
    );
};

export default LessonExtractor;
