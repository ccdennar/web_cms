import type { CollectionConfig } from 'payload'

// "Screenshot 2026-10-14 at 4.20.52 PM.png" -> "screenshot-2026-10-14-at-4.20.52-pm.png"
function cleanFilename(name: string): string {
  return name
    .normalize('NFKD')            // turns the narrow no-break space into a normal space
    .replace(/[^\w.\-]+/g, '-')   // spaces and odd characters become hyphens
    .replace(/-+/g, '-')          // collapse repeated hyphens
    .replace(/^-|-$/g, '')        // trim leading/trailing hyphens
    .toLowerCase()
}

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true, // images must be publicly viewable
  },
  hooks: {
    // Runs before Payload generates the stored filename, so the cleaned name is what's saved
    beforeOperation: [
      ({ args, operation }) => {
        if (operation === 'create' || operation === 'update') {
          const file = args?.req?.file
          if (file?.name) file.name = cleanFilename(file.name)
        }
        return args
      },
    ],
  },
  upload: {
    staticDir: 'media', // files saved to ./media/ locally
    imageSizes: [
      { name: 'card', width: 400, height: 180, crop: 'center' },
    ],
    mimeTypes: ['image/png', 'image/jpeg', 'image/webp'],
  },
  fields: [{ name: 'alt', type: 'text' }], // alt text for accessibility
}