import type { CollectionConfig } from 'payload'

export const Pastries: CollectionConfig = {
  slug: 'pastries',
  access: {
    read: () => true, // public — powers the storefront menu
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  admin: { useAsTitle: 'name' },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'description', type: 'textarea' },
    { name: 'price', type: 'number', required: true, admin: { description: 'In USD' } },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Cakes', value: 'cakes' },
        { label: 'Cookies', value: 'cookies' },
        { label: 'Breads', value: 'breads' },
         { label: 'Pastry', value: 'Pastry' },
        { label: 'Seasonal', value: 'seasonal' },
      ],
    },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'inStock', type: 'checkbox', defaultValue: true },
    { name: 'featured', type: 'checkbox', defaultValue: false },
  ],
}