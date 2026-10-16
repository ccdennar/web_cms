import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: { useAsTitle: 'email' },
  auth: { useAPIKey: true }, // turns this into a login-enabled collection
  fields: [],
}