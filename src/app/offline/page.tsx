'use client'

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <p className="text-[10px] font-sans font-bold tracking-[0.2em] uppercase text-[#999] mb-6">
          Nebbuler · Sin conexión
        </p>
        <h1 className="font-serif text-4xl font-bold text-[#121212] mb-4">
          Sin conexión a internet
        </h1>
        <p className="font-sans text-base text-[#666] leading-relaxed mb-8">
          Parece que no tienes conexión. Revisa tu red y vuelve a intentarlo.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="font-sans text-sm font-semibold text-white bg-[#121212] px-6 py-3 hover:bg-[#333] transition-colors"
        >
          Reintentar
        </button>
      </div>
    </div>
  )
}
