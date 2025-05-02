'use client';

import { useFormContext } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { UploadCloud, Cloud, Server, X } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

const MultiImageUpload = () => {
    const { watch, setValue, getValues } = useFormContext();

    const images = watch('images') || [];
    const [storageType, setStorageType] = useState<string>(getValues('storageType') || 's3');

    // Set storageType in form when changed
    useEffect(() => {
        setValue('storageType', storageType, { shouldValidate: true });
    }, [storageType, setValue]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const newFiles = Array.from(files).filter((f) => f.type.startsWith('image/'));
        setValue('images', [...images, ...newFiles], { shouldValidate: true });
    };

    const handleRemove = (index: number) => {
        const updated = [...images];
        updated.splice(index, 1);
        setValue('images', updated, { shouldValidate: true });
    };

    return (
        <div className="space-y-4 p-4 border rounded-lg shadow">
            <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-gray-600">
                    <Switch
                        checked={storageType === 's3'}
                        onCheckedChange={(checked) => setStorageType(checked ? 's3' : 'cloudinary')}
                    />
                    {storageType === 's3' ? (
                        <>
                            <Server size={16} /> Amazon S3
                        </>
                    ) : (
                        <>
                            <Cloud size={16} /> Cloudinary
                        </>
                    )}
                </label>

                <Button type="button" onClick={() => document.getElementById('imageInput')?.click()} variant="outline">
                    <UploadCloud className="mr-2" size={18} />
                    Upload Images
                </Button>
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    id="imageInput"
                    className="hidden"
                />
            </div>

            {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {images.map((img: any, index: number) => {
                        const src = img instanceof File ? URL.createObjectURL(img) : img.imageUrl;
                        return (
                            <div key={index} className="relative border rounded overflow-hidden shadow">
                                <Image
                                    src={src}
                                    alt={`Image ${index}`}
                                    width={300}
                                    height={300}
                                    className="w-full h-48 object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemove(index)}
                                    className="absolute top-1 right-1 bg-white p-1 rounded-full shadow"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default MultiImageUpload;
