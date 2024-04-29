
'use client';
import { Fragment, use } from 'react'
import { Menu, Popover, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'

const user = {
    name: 'Tom Cook',
    email: 'tom@example.com',
    imageUrl:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
}
const navigation = [
    { name: 'Home', href: '#', current: true },
    { name: 'Profile', href: '#', current: false },
    { name: 'Resources', href: '#', current: false },
    { name: 'Company Directory', href: '#', current: false },
    { name: 'Openings', href: '#', current: false },
]
const userNavigation = [
    { name: 'Your Profile', href: '#' },
    { name: 'Settings', href: '#' },
    { name: 'Sign out', href: '#' },
]

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

export default function StackedLayout(form: {}, response: string) {
    return (
        <>
            <div className="min-h-full">
                <main className="pt-4 pb-8 bg-indigo-600">
                    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
                        {/* <h1 className="sr-only">Page title</h1> */}
                        {/* Main 3 column grid */}
                        <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-3 lg:gap-8">
                            <div className="grid grid-cols-1 gap-4">
                                <section aria-labelledby="section-2-title">
                                    <h2 className="sr-only" id="section-2-title">
                                        Section title
                                    </h2>
                                    <div className="overflow-hidden rounded-lg bg-white shadow">
                                        <div className="p-6"></div>
                                    </div>
                                </section>
                            </div>

                            {response &&
                                <div className="grid grid-cols-1 gap-4 lg:col-span-2">
                                    <section aria-labelledby="section-1-title">
                                        <h2 className="sr-only" id="section-1-title">
                                            Section title
                                        </h2>
                                        <div className="overflow-hidden rounded-lg bg-white shadow">
                                            <div className="p-6"></div>
                                        </div>
                                    </section>
                                </div>
                            }

                        </div>
                    </div>
                </main>

            </div>
        </>
    )
}
