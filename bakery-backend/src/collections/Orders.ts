import type { CollectionConfig } from 'payload'

export const Orders: CollectionConfig = {
  slug: 'orders',
  access: {
    // Only logged-in users or the storefront's API key can create orders.
    // The storefront server does this after PayPal confirms payment.
    create: ({ req: { user } }) => Boolean(user),
    read: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  admin: {
    useAsTitle: 'customerName',
    defaultColumns: ['customerName', 'total', 'paymentStatus', 'pickupDate', 'status', 'createdAt'],
  },
  fields: [
    { name: 'customerName', type: 'text', required: true },
    { name: 'customerEmail', type: 'email', required: true },
    { name: 'customerPhone', type: 'text', required: true },
    { name: 'pickupDate', type: 'date', required: true },
    { name: 'notes', type: 'textarea' },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Baking', value: 'baking' },
        { label: 'Ready for Pickup', value: 'ready' },
        { label: 'Completed', value: 'completed' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      fields: [
        { name: 'pastryId', type: 'text', required: true },
        { name: 'name', type: 'text', required: true },
        { name: 'unitPrice', type: 'number', required: true },
        { name: 'quantity', type: 'number', required: true, min: 1 },
      ],
    },
    { name: 'total', type: 'number', required: true },

    // --- Payment ---
    {
      name: 'paymentStatus',
      type: 'select',
      defaultValue: 'unpaid',
      options: [
        { label: 'Unpaid', value: 'unpaid' },
        { label: 'Paid', value: 'paid' },
        { label: 'Refunded', value: 'refunded' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'paypalOrderId',
      type: 'text',
      unique: true, // stops the same PayPal payment creating two orders
      index: true,
      admin: { position: 'sidebar', readOnly: true },
    },
    {
      name: 'paypalCaptureId',
      type: 'text',
      admin: { position: 'sidebar', readOnly: true },
    },
  ],
}