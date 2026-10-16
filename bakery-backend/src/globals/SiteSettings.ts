import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  access: { read: () => true }, // public
  fields: [
    { name: 'bakeryName', type: 'text', defaultValue: 'Butter & Crumb' },
    { name: 'heroTitle', type: 'text', defaultValue: 'Baked fresh every morning' },
    { name: 'heroSubtitle', type: 'textarea', defaultValue: 'Small-batch pastries, made with real butter.' },
    { name: 'heroImage', type: 'upload', relationTo: 'media' },
    { name: 'featuredHeading', type: 'text', defaultValue: "Today's Favorites" },
    { name: 'footerText', type: 'textarea', defaultValue: '123 Flour Lane' },
    { name: 'hours', type: 'text', defaultValue: 'Tue–Sun · 7am–3pm' },
  ],
}