'use client';
import React, { useState } from 'react';
import { Disclosure } from '@headlessui/react'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline'
import { ResizableBox } from 'react-resizable';
import Tree, { TreeProps } from 'rc-tree';
import 'rc-tree/assets/index.css';
import 'react-resizable/css/styles.css';

// Navigation item type
type NavItem = {
    name: string
    current: boolean
}

interface TreeNode {
    title: string;
    key: string;
    children?: TreeNode[];
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

// Navbar Component
function Navbar({ navigation, setNavigation }: { navigation: NavItem[], setNavigation: (items: NavItem[]) => void }) {
    return (
        <Disclosure as="nav" className="bg-gray-800">
            {({ open }) => (
                <>
                    <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                        <div className="relative flex h-16 items-center justify-between">
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
                </>
            )}
        </Disclosure>
    );
}

// Banner Component
const HelloBanner: React.FC = () => {
    return (
        <div className="bg-blue-600 text-white mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 py-6">
            <h2 className="text-2xl font-bold">Hello!</h2>
            <p className="mt-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum auctor, felis a congue cursus, nulla arcu volutpat odio, vel dignissim nisi turpis nec risus. Duis ac magna nec libero sodales volutpat.</p>
        </div>
    );
};

// Lesson Extractor Component
const LessonExtractor: React.FC = () => {
    const [navigation, setNavigation] = useState(initialNavigation);

    const isPlanner = navigation.find(nav => nav.name === "Planner" && nav.current);

    const curriculumTreeData: TreeNode[] = [
        {
            title: 'Engage NY',
            key: '0',
            children: [
                {
                    title: 'ELA',
                    key: '0-0',
                    children: [
                        {
                            title: 'Grade 3',
                            key: '0-0-0',
                            children: [
                                {
                                    title: 'Unit 1',
                                    key: '0-0-0-0',
                                    children: [
                                        { title: 'Lesson 1: Exploring Texts', key: '0-0-0-0-0' },
                                        { title: 'Lesson 2: Building Vocabulary', key: '0-0-0-0-1' },
                                        { title: 'Lesson 3: Reading and Discussion', key: '0-0-0-0-2' }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ];



    return (
        <div className="h-screen flex flex-col">
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
            <div id='main-content' className="w-full px-2 sm:px-6 lg:px-8 flex-1 mt-6 flex overflow-hidden">
                {/* Left Column */}
                <ResizableBox
                    width={400}
                    height={Infinity}
                    minConstraints={[200, 0]}
                    maxConstraints={[600, Infinity]}
                    axis="x"
                >
                    <div className="h-full w-full bg-gray-100 p-4 border-r border-gray-300 rounded-l-md">
                        <h2 className="font-bold text-lg">Planner - Curriculum File Tree</h2>
                        <Tree
                            className="mt-2"
                            defaultExpandAll
                            treeData={curriculumTreeData}
                        />

                    </div>
                </ResizableBox>

                {/* Right Column */}
                <div className="flex-1 h-full bg-gray-100 p-4 border-l border-gray-300 rounded-r-md">
                    <h2 className="font-bold text-lg">Planner - Right Column</h2>
                    <p>This column will also resize based on the handle movement.</p>
                </div>
            </div>


            <div id='footer'></div>
        </div>
    );
};

export default LessonExtractor;
