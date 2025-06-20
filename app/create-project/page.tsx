"use client";

import { useRouter } from 'next/navigation';
import { NotionEditor } from '@/components/projects/NotionEditor';

export default function CreateProjectPage() {
  const router = useRouter();

  const handleSave = (projectData: any) => {
    console.log('Project created:', projectData);
    // You can handle the saved project data here
    // For now, redirect back to dashboard
    router.push('/');
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <NotionEditor 
      onSave={handleSave}
      onBack={handleBack}
    />
  );
} 