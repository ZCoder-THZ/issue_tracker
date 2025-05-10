'use client'

import { useEffect, useState } from 'react';
import FsLightbox from 'fslightbox-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
interface IssueImagesProps {
    issueImages: { id: number; imageUrl: string }[];
}
function IssueImages({ issueImages }: IssueImagesProps) {
    const router = useRouter()
    useEffect(() => {
        router.refresh()
    }, [router]);
    const [lightboxController, setLightboxController] = useState({
        toggler: false,
        slide: 1,
    });

    const openLightbox = (index: number) => {
        setLightboxController({
            toggler: !lightboxController.toggler,
            slide: index + 1, // FsLightbox slides start from 1
        });
    };

    return (
        <div>
            {issueImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {issueImages.map((img, index) => (
                        <div
                            key={img.id}
                            className="relative w-full h-32 md:h-40 rounded-lg overflow-hidden shadow-md cursor-pointer"
                            onClick={() => openLightbox(index)}
                        >
                            <Image
                                priority
                                src={img.imageUrl}
                                alt={`Issue Image ${img.id}`}
                                layout="fill"
                                objectFit="cover"
                                className="rounded-lg"
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* FsLightbox component */}
            <FsLightbox
                toggler={lightboxController.toggler}
                sources={issueImages.map((img) => img.imageUrl)}
                slide={lightboxController.slide}
            />
        </div>
    );
}

export default IssueImages;
