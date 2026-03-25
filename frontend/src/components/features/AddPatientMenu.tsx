import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { PatientAddForm, PatientFormData } from './PatientAddForm'

interface AddPatientMenuProps {
  onAddText?: (data: PatientFormData) => void
  isSubmitting?: boolean
  onAddVoice?: () => void
  onAddImage?: () => void
  onUploadDataset?: (files: FileList | null) => void
}

export function AddPatientMenu({
  onAddText,
  isSubmitting = false,
  onAddVoice,
  onAddImage,
  onUploadDataset,
}: AddPatientMenuProps) {
  const [mainOpen, setMainOpen] = useState(false)
  const [subOpen, setSubOpen] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setMainOpen(false)
        setSubOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleDatasetClick = () => {
    // open native file picker
    fileInputRef.current?.click()
    setMainOpen(false)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUploadDataset && onUploadDataset(e.target.files)
  }

  const handleFormSubmit = async (data: PatientFormData) => {
    if (onAddText) {
      await onAddText(data)
    }
    setShowForm(false)
    setMainOpen(false)
    setSubOpen(false)
  }

  return (
    <div className="relative inline-block" ref={containerRef}>
      <Button
        size="sm"
        variant="secondary"
        onClick={() => setMainOpen((o) => !o)}
      >
        + Add
      </Button>

      {mainOpen && (
        <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded shadow-lg z-20">
          <button
            className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700"
            onClick={() => {
              setSubOpen(true)
            }}
          >
            Add Patient
          </button>
          <button
            className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700"
            onClick={handleDatasetClick}
          >
            Add Dataset
          </button>
        </div>
      )}

      {subOpen && (
        <div className="absolute right-full top-0 mt-2 w-44 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded shadow-lg z-30">
          <button
            className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700"
            onClick={() => {
              setMainOpen(false)
              setSubOpen(false)
              setShowForm(true)
            }}
          >
            Text Mode
          </button>
          <button
            className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700"
            onClick={() => {
              setMainOpen(false)
              setSubOpen(false)
              onAddVoice && onAddVoice()
            }}
          >
            Voice Mode
          </button>
          <button
            className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700"
            onClick={() => {
              setMainOpen(false)
              setSubOpen(false)
              onAddImage && onAddImage()
            }}
          >
            Image
          </button>
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      // allow multiple files if needed
      />

      <PatientAddForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={handleFormSubmit}
        isLoading={isSubmitting}
      />
    </div>
  )
}
