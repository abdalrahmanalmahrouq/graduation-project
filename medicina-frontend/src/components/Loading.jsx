import React from 'react'
export default function Loading() {
  return (
    <div className="text-center py-5">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">جاري التحميل...</span>
      </div>
      <p className="mt-3 text-muted">جاري التحميل ...</p>
    </div>
  )
}
