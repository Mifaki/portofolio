'use client';

import { IProject } from "@/models/projectinterfaces";
import { useMemo } from 'react';

export function useSortImage(project: IProject) {
  const processedImages = useMemo(() => {
    const sortedImages = [...project.images].sort((a, b) => a.position - b.position);

    const classNames = [
      "col-span-12 lg:col-span-9 row-span-2 lg:row-span-5",
      "col-span-12 lg:col-span-3 row-span-5 lg:row-span-5",
      "col-span-12 lg:col-span-4 row-span-2 lg:row-span-3",
      "col-span-12 lg:col-span-5 row-span-2 lg:row-span-3",
      "col-span-12 lg:col-span-9 row-span-2 lg:row-span-5"
    ];

    return sortedImages.map((image, index) => ({
      ...image,
      className: project.videoUrl ? classNames[index] : classNames[index - 1],
    }));
  }, [project.images]);

  const mainImage = project.videoUrl ? null : processedImages[0];
  const additionalImages = project.videoUrl ? processedImages.slice(0, 5) : processedImages.slice(1, 6);

  return {
    mainImage,
    additionalImages,
    hasVideo: !!project.videoUrl
  };
}
