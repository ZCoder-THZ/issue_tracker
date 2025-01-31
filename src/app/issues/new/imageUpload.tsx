'use client';

import { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { X } from 'lucide-react';
import Image from 'next/image';

const MultiImageUpload: React.FC<{ issueImages?: { id: number; imageUrl: string }[] }> = ({ issueImages = [] }) => {
    const { setValue, getValues } = useFormContext(); // Access react-hook-form context
    const [images, setImages] = useState<File[]>(getValues('images') || []);
    const [existingImages, setExistingImages] = useState(issueImages || []);

    useEffect(() => {
        setValue('images', images); // Ensure form state updates when images change
    }, [images, setValue]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const validImages = Array.from(files).filter((file) => file.type.startsWith('image/'));
            const updatedImages = [...images, ...validImages];

            setImages(updatedImages);
            setValue('images', updatedImages); // Update form state
        }
    };

    const handleRemoveImage = (index: number) => {
        const updatedImages = images.filter((_, i) => i !== index);
        setImages(updatedImages);
        setValue('images', updatedImages); // Ensure the form state updates properly
    };

    const handleRemoveExistingImage = (id: number) => {
        const updatedExistingImages = existingImages.filter((image) => image.id !== id);
        setExistingImages(updatedExistingImages);
        setValue('existingImages', updatedExistingImages); // Ensure the form state reflects the removal
    };

    return (
        <Card className="p-6">
            <CardHeader>
                <CardTitle>Upload Images</CardTitle>
                <CardDescription>Drag and drop images or click to upload.</CardDescription>
            </CardHeader>
            <CardContent>
                <div
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer"
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
                                    className="absolute top-0 right-0 m-2 bg-white rounded-full p-1 shadow-lg"
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
                                    className="absolute top-0 right-0 m-2 bg-white rounded-full p-1 shadow-lg"
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
