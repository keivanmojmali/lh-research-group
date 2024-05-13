'use client';
import React, { useState } from 'react';
import { Disclosure } from '@headlessui/react';
import { ChevronDownIcon, ChevronUpIcon, ChevronLeftIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { ResizableBox } from 'react-resizable';
import Tree, { TreeProps } from 'rc-tree';
import { Key } from 'rc-tree/lib/interface';
import 'rc-tree/assets/index.css';
import 'react-resizable/css/styles.css';
import { Document, Page, pdfjs } from 'react-pdf';
import lessonData from '@/app/data/lessonData';
import initialLessonData from '@/app/data/initialLessonData';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { v4 as uuidv4 } from 'uuid';
import Editor from '@/components/Editor';
import { createBlocksFromStr } from '@/utils/stringUtils';
import LoadingSpinner from '@/components/loadingSpinner';


pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

// Define your buttons array
const buttons = [
    { name: 'Warm-Up Problem', id: 1 },
    { name: 'Video + Guided Notes', id: 2 },
    { name: 'Practice Activity', id: 3 },
    { name: 'Extension Activity', id: 4 },
    { name: 'Mastery Check', id: 5 }
];


// type NavItem = {
//     name: string
//     current: boolean
// }

// interface TreeNode {
//     title: string;
//     key: string;
//     children?: TreeNode[];
//     isLeaf?: boolean;
// }

const initialNavigation = [
    { name: 'Planner', current: true },
    { name: 'How-To', current: false }
];

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

function Navbar({ navigation, setNavigation }) {
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

const HelloBanner = () => {
    return (
        <div className="bg-blue-600 text-white mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 py-6">
            <h2 className="text-2xl font-bold">Hello!</h2>
            <p className="mt-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </div>
    );
};

const LessonExtractor = () => {
    const [navigation, setNavigation] = useState(initialNavigation);
    const [selectedFile, setSelectedFile] = useState(null);
    const [numPages, setNumPages] = useState(0);
    const [content, setContent] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [fileNameStripped, setFileNameStripped] = useState(null);

    function handleButtonClick(buttonName) {
        // For now, add a new editor directly on button click
        addEditor(buttonName);
    };

    async function addEditor(editorName) {
        setIsLoading(true);
        const requestData = {
            typeOfQuestion: "Open ended",
            typeOfAssessment: "Exit ticket",
            numberOfQuestions: 4,
            size: "8b",
            passage: "Sample passage text for testing."
        };

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/test`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'  // Ensure the content type is application/json
                },
                body: JSON.stringify(requestData)  // Stringify your request data
            });

            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }

            const data = await response.json();  // Assuming the response is also JSON
            const content = createBlocksFromStr(data.content)

            setContent((prevContent) => [
                {
                    id: uuidv4(),
                    content: content,
                    docName: `${selectedFile.split('/').pop()} | ${editorName}`
                },
                ...prevContent,
            ]);
        } catch (error) {
            console.error('Failed to fetch from the Flask server:', error);
        } finally {
            setIsLoading(false);
        }
    }


    const loadPdf = (fileName) => {
        setSelectedFile(`/docs/${fileName}`);
    };

    const handleFileSelect = (
        selectedKeys,
        info
    ) => {
        if (info.node.isLeaf) {
            loadPdf(`${info.node.title}.pdf`);
        }
    };

    const goBackToTree = () => {
        setContent([]);
        setSelectedFile(null);
    };

    const onDocumentLoadSuccess = ({ numPages }) => {
        setFileNameStripped(selectedFile.replace(/^\/docs\//, '').replace(/\.pdf$/, ''))
        setNumPages(numPages);
        if (selectedFile) {
            let initialContent = initialLessonData(selectedFile.replace(/^\/docs\//, '').replace(/\.pdf$/, ''));
            //@ts-ignore
            setContent((prevContent) => [
                ...prevContent,
                {
                    id: uuidv4(),
                    content: initialContent,
                    docName: `${selectedFile.replace(/^\/docs\//, '').replace(/\.pdf$/, '')} | Overview`,

                }
            ]);
        }
    };

    const curriculumTreeData = [
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
                                    title: 'CKLA-G1-LL-Scope-and-Sequence',
                                    key: '0-1-1-0',
                                    isLeaf: true
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ];

    const treeProps = {
        prefixCls: "rc-tree",
        className: "mt-2",
        defaultExpandAll: true,
        treeData: curriculumTreeData,
        onSelect: handleFileSelect
    };

    const renderPdfPages = () => {
        return Array.from({ length: numPages }, (_, i) => i + 1).map((pageNum) => (
            <Page key={pageNum} pageNumber={pageNum} />
        ));
    };

    const onError = (error) => {
        console.error('Error loading PDF:', error);
        // Handle error (e.g., display error message)
    };

    console.log(content);
    return (
        <div className="h-screen flex flex-col">
            <div id='navbar'><Navbar navigation={navigation} setNavigation={setNavigation} /></div>
            <div id='banner' className='bg-gray-800'>
                <Disclosure>
                    {({ open }) => (
                        <>
                            {open && <HelloBanner />}
                            <Disclosure.Button className="text-white w-full mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 py-2 flex items-center">
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
                <ResizableBox
                    width={700}
                    height={Infinity}
                    minConstraints={[200, 0]}
                    maxConstraints={[600, Infinity]}
                    axis="x"
                >
                    <div className="h-full w-full bg-black p-4 border-r border-gray-300 rounded-l-md overflow-auto">
                        {selectedFile ? (
                            <>
                                <div className="flex items-center">
                                    <button onClick={goBackToTree} className="mr-2">
                                        <ChevronLeftIcon className="h-5 w-5" />
                                    </button>
                                    <h2 className="font-bold text-lg">{fileNameStripped}</h2>
                                </div>
                                <Document file={selectedFile} onLoadSuccess={onDocumentLoadSuccess} onError={onError}>
                                    {renderPdfPages()}
                                </Document>
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
                <div className="flex-1 h-full bg-black p-4 border-l border-gray-300 rounded-r-md">
                    {/* Top bar with buttons */}
                    {selectedFile &&
                        <>
                            <div className="flex items-center justify-between mb-4">
                                <div className='flex items-center'>
                                    <h2 className="font-bold text-xl">Tools</h2>
                                    {/* <h2 className="font-bold text-lg ml-2">|</h2> */}
                                </div>
                                <button
                                    className="text-blue-700 flex items-center hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center  dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
                                    aria-label="Download"
                                >
                                    Download
                                    <ArrowDownTrayIcon className="h-5 w-5 ml-2" />
                                </button>
                            </div>
                            <div className="flex items-center justify-between mb-4 border-t-2 border-b-2 pt-2 pb-2 overflow-x-auto">
                                {buttons.map(button => (
                                    <button
                                        key={button.id}
                                        className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-md px-5 py-2.5 text-center mr-2"
                                        onClick={() => handleButtonClick(button.name)}
                                    >
                                        {button.name}
                                    </button>
                                ))}
                            </div>
                        </>
                    }
                    {/* Scrollable Editors Section */}

                    <div className="overflow-y-auto h-[calc(100%-6rem)]">
                        {isLoading &&
                            <div className="bg-white rounded-lg h-64 flex items-center justify-center shadow">
                                <LoadingSpinner />
                            </div>
                        }
                        {content.map(({ id, docName, content }) => (
                            <div key={id} className="mb-4 p-2">
                                <h3 className="font-bold text-xl mb-2 ml-1 text-white">{docName}</h3>
                                <Editor initialContent={content} onChange={(content) => console.log(content)} />
                                {/* Spacer Line */}
                                <hr className="border-t border-gray-400 my-4" />
                            </div>
                        ))}
                    </div>



                </div>
            </div>
        </div >
    );
};

export default LessonExtractor;
