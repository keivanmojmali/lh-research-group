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
import initialLessonData from '@/app/data/initialLessonData';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { v4 as uuidv4 } from 'uuid';
import Editor from '@/components/Editor';


pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

//MAKE IT MAKE A SERVER CALL WITH THE INFO 
//ADD INITIAL LOADING WITH SOME INFORMATION 
//MAKE IT RETURN THE INFORMATION IN A BLOCKNOTE (ADD THE ALGOS THAT ARE NEEDED ETC)

// Define your buttons array
const buttons = [
    { name: 'Button 1', id: 1 },
    { name: 'Button 2', id: 2 },
    { name: 'Button 3', id: 3 },
    { name: 'Button 4', id: 4 },
    { name: 'Button 5', id: 5 }
];


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
    const [editors, setEditors] = useState<any>([]);

    const handleButtonClick = async (buttonId: number) => {
        // Make a server call here
        try {
            const response = await fetch('your-server-endpoint');
            const data = await response.json();
            // Update the editors array with the returned data
            setEditors([...editors, data.content]);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };


    type PartialBlock = {
        id?: string;
        type?: string;
        props?: Partial<Record<string, any>>; // exact type depends on "type"
        content?: string
        children?: PartialBlock[];
    };





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
        if (selectedFile) {
            let initialContent = { content: initialLessonData(selectedFile.split('/').pop()!), id: uuidv4(), type: 'paragraph' }
            console.log(initialContent);
            //@ts-ignore
            const newEditor = <Editor initialContent={initialContent} onChange={(content: any) => console.log(content)} />;
            setEditors([...editors, newEditor]);
        }
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

    console.log('editors:', editors)

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
                    {/* Top bar with buttons */}
                    <h2 className="font-bold text-lg mb-2">Tools</h2>
                    <div className="flex items-center justify-between mb-4 border-b-2 pb-2 overflow-x-auto">
                        {buttons.map(button => (
                            <button
                                key={button.id}
                                className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded `}
                                onClick={() => console.log(button.name)}
                            >
                                {button.name}
                            </button>
                        ))}
                    </div>
                    {/* Content in the right column */}
                    <h2 className="font-bold text-lg">Planner - Right Column</h2>

                    {editors.map((editor: any, index: number) => (
                        < div key={index} className="mb-4" >
                            {editor}
                        </div>
                    ))}



                </div>
            </div>
        </div >
    );
};

export default LessonExtractor;
