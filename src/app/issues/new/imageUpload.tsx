'use client';

import { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Cloud, Server } from 'lucide-react';
import Image from 'next/image';
import { Switch } from '@/components/ui/switch';

const MultiImageUpload: React.FC<{ issueImages?: { id: number; imageUrl: string }[] }> = ({ issueImages = [] }) => {
    const { setValue, getValues } = useFormContext();
    const [images, setImages] = useState<File[]>(getValues('images') || []);
    const [storageType, setStorageType] = useState<string>(getValues('storageType') || 's3');
    const [existingImages, setExistingImages] = useState(issueImages || []);

    useEffect(() => {
        setValue('images', images);
    }, [images, setValue]);

    useEffect(() => {
        setValue('storageType', storageType);
    }, [storageType, setValue]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const validImages = Array.from(files).filter((file) => file.type.startsWith('image/'));
            setImages([...images, ...validImages]);
        }
    };

    const handleRemoveImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const handleRemoveExistingImage = (id: number) => {
        setExistingImages(existingImages.filter((image) => image.id !== id));
    };

    return (
        <Card className="p-6 shadow-lg border border-gray-200 rounded-xl">
            <CardHeader className="flex flex-col gap-2">
                <CardTitle className="text-xl font-semibold">Upload Images</CardTitle>
                <div className="flex items-center gap-2">
                    <Switch
                        checked={storageType === 's3'}
                        onCheckedChange={(checked) => setStorageType(checked ? 's3' : 'cloudinary')}
                    />
                    <span className="text-sm text-gray-600 flex items-center gap-1">
                        {storageType === 's3' ? <Server size={16} /> : <Cloud size={16} />}
                        {storageType === 's3' ? 'Amazon S3' : 'Cloudinary'}
                    </span>
                </div>
                <CardDescription>Choose a storage provider and upload your images.</CardDescription>
            </CardHeader>
            <CardContent>
                <div
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-100 transition"
                    onClick={() => document.getElementById('fileUpload')?.click()}
                >
                    <input
                        id="fileUpload"
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleFileChange}
                    />
                    <p className="text-gray-500">Drag & Drop your images here or click to upload</p>
                </div>

                {/* Existing Images Preview */}
                {existingImages.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
                        {existingImages.map((image) => (
                            <div key={image.id} className="relative border rounded-lg overflow-hidden shadow-md">
                                <Image src={image.imageUrl} alt="Existing Image" width={200} height={200} className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md"
                                    onClick={() => handleRemoveExistingImage(image.id)}
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* New Uploaded Images Preview */}
                {images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
                        {images.map((image, index) => (
                            <div key={index} className="relative border rounded-lg overflow-hidden shadow-md">
                                <Image src={URL.createObjectURL(image)} alt={`Preview ${index + 1}`} width={200} height={200} className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md"
                                    onClick={() => handleRemoveImage(index)}
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default MultiImageUpload;
