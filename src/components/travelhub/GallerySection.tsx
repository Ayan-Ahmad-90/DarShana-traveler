const galleryItems = [
  {
    id: 'pangong-stars',
    media: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
    label: 'Starlit Pangong Lake – Ladakh',
  },
  {
    id: 'varanasi-ghats',
    media: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=80',
    label: 'Dev Deepawali Aarti – Varanasi',
  },
  {
    id: 'alleppey-dawn',
    media: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80',
    label: 'Backwater sunrise – Alleppey',
  },
  {
    id: 'bandhavgarh-safari',
    media: 'https://images.unsplash.com/photo-1484406566174-9da000fda645?auto=format&fit=crop&w=900&q=80',
    label: 'Tiger trail golden hour – Bandhavgarh',
  },
];

const GallerySection = () => (
  <section id="gallery" className="pt-16">
    <div className="flex flex-col gap-3 text-center">
      <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Visual stories</p>
      <h2 className="text-3xl font-semibold text-[#0f172a]">Gallery & video tours</h2>
      <p className="text-slate-500">High-resolution imagery, quick reels, and VR-ready clips to help guests picture the experience.</p>
    </div>

    <div className="mt-8 grid gap-4 md:grid-cols-4">
      {galleryItems.map((item) => (
        <figure key={item.id} className="relative overflow-hidden rounded-3xl">
          <img src={item.media} alt={item.label} className="h-64 w-full object-cover" loading="lazy" />
          <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent text-white text-sm p-4">
            {item.label}
          </figcaption>
        </figure>
      ))}
    </div>

    <div className="mt-6 text-center">
      <button className="px-5 py-2 rounded-full border border-[#06b6d4] text-[#06b6d4] font-semibold">
        Watch 360° tours
      </button>
    </div>
  </section>
);

export default GallerySection;
