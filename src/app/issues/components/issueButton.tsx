'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
function IssueButton({
    href,
    title
}: {
    href: string,
    title: String
}) {
    const router = useRouter()
    return (
        <Link href={href} >
            {
                title
            }
        </Link>
    )
}

export default IssueButton