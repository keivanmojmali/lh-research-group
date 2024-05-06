'use client';
import React, { useState } from 'react';
import { Disclosure } from '@headlessui/react';
import { ChevronDownIcon, ChevronUpIcon, ChevronLeftIcon } from '@heroicons/react/24/outline';
import { ResizableBox } from 'react-resizable';
import Tree, { TreeProps } from 'rc-tree';
import { Key } from 'rc-tree/lib/interface';
import 'rc-tree/assets/index.css';
import 'react-resizable/css/styles.css';
import { Document, Page, pdfjs } from 'react-pdf';
import lessonData from '@/app/data/lessonData';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';


pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

//ADD THE TOP BAR WITH THE BUTTONS 
//MAKE IT MAKE A SERVER CALL WITH THE INFO 
//MAKE IT RETURN THE INFORMATION IN A BLOCKNOTE (ADD THE ALGOS THAT ARE NEEDED ETC)




type NavItem = {
    name: string
    current: boolean
}

interface TreeNode {
    title: string;
    key: string;
    children?: TreeNode[];
    isLeaf?: boolean;
}

const initialNavigation: NavItem[] = [
    { name: 'Planner', current: true },
    { name: 'How-To', current: false }
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
            <p className="mt-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </div>
    );
};

const LessonExtractor: React.FC = () => {
    const [navigation, setNavigation] = useState(initialNavigation);
    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const [numPages, setNumPages] = useState<number>(0);

    const loadPdf = (fileName: string) => {
        setSelectedFile(`/docs/${fileName}`);
    };

    const handleFileSelect = (
        selectedKeys: Key[],
        info: { event: "select"; selected: boolean; node: any; selectedNodes: any[]; nativeEvent: MouseEvent }
    ) => {
        if (info.node.isLeaf) {
            loadPdf(`${info.node.title}.pdf`);
        }
    };

    const goBackToTree = () => {
        setSelectedFile(null);
    };

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
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

    const treeProps: TreeProps = {
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

    const onError = (error: any) => {
        console.error('Error loading PDF:', error);
        // Handle error (e.g., display error message)
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
                <ResizableBox
                    width={500}
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
                                    <h2 className="font-bold text-lg">{selectedFile}</h2>
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
                    <h2 className="font-bold text-lg">Planner - Right Column</h2>
                    <p>This column will also resize based on the handle movement.</p>
                </div>
            </div>
        </div>
    );
};

export default LessonExtractor;
