"use client";
import React, { ReactNode } from 'react'

type LoadingSpinnerProps = {
    children?: ReactNode
}

export default function LoadingSpinner({ children }: LoadingSpinnerProps) {
    return (
        <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
    )
}
