'use client';
import React, { useState, useEffect } from 'react';
import { Disclosure } from '@headlessui/react'
import { ChevronDownIcon, ChevronUpIcon, ChevronLeftIcon, } from '@heroicons/react/24/outline'
import { ResizableBox } from 'react-resizable';
import mammoth from 'mammoth';

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

const initialNavigation: NavItem[] = [
    { name: 'Planner', current: true },
    { name: 'How-To', current: false },
];

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

    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const [fileContent, setFileContent] = useState<string | null>(null);

    const handleFileSelect = (keys: string[], event: any) => {
        const selectedNode = event.node;
        if (selectedNode && selectedNode.isLeaf) {
            const fileName = selectedNode.title + ".docx"; // Modify according to your naming
            setSelectedFile(selectedNode.title);
            loadDocxFile(`/docs/${fileName}`);
        }
    };

    const loadDocxFile = async (filePath: string) => {
        try {
            const response = await fetch(filePath);
            const arrayBuffer = await response.arrayBuffer();
            const result = await mammoth.convertToHtml({ arrayBuffer });
            setFileContent(result.value);
        } catch (error) {
            setFileContent("Unable to load file content.");
        }
    };

    const goBackToTree = () => {
        setSelectedFile(null);
        setFileContent(null);
    };


    const curriculumTreeData: TreeNode[] = [
        {
            title: 'Engage NY',
            key: '0',
            children: [
                {
                    title: 'ELA',
                    key: '0-1',
                    children: [
                        {
                            title: 'Grade 1',
                            key: '0-1-1',
                            children: [
                                {
                                    title: 'Listening and Learning',
                                    key: '0-1-1-0',
                                    children: [
                                        {
                                            title: 'CKLA-CCSS-G1-Unit-By-Unit-Alignment',
                                            key: '0-1-1-0-0',
                                            isLeaf: true
                                        }
                                    ]
                                },
                                {
                                    title: 'Skills',
                                    key: '0-1-1-1',
                                    children: [
                                        {
                                            title: 'CKLA-CCSS-G1-Unit-By-Unit-Alignment',
                                            key: '0-1-1-1-0',
                                            isLeaf: true
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ];

    const treeProps: TreeProps = {
        className: "mt-2",
        defaultExpandAll: true,
        treeData: curriculumTreeData,
        onSelect: handleFileSelect
    };

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
                    <div className="h-full w-full bg-gray-100 p-4 border-r border-gray-300 rounded-l-md overflow-auto">
                        {selectedFile ? (
                            <>
                                <div className="flex items-center">
                                    <button onClick={goBackToTree} className="mr-2">
                                        <ChevronLeftIcon className="h-5 w-5" />
                                    </button>
                                    <h2 className="font-bold text-lg">{selectedFile}</h2>
                                </div>
                                {/* Display loaded DOCX file content */}
                                <div dangerouslySetInnerHTML={{ __html: fileContent ?? "Loading..." }} />
                            </>
                        ) : (
                            <>
                                <h2 className="font-bold text-lg">Planner - Curriculum File Tree</h2>
                                <Tree {...treeProps} />
                            </>
                        )}
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
