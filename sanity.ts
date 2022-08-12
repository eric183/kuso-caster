import { createClient } from 'next-sanity';

export const config = {
  projectId: process.env.NEXT_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_SANITY_DATASET || 'production',
  useCdn: process.env.NODE_ENV === 'production',
  apiVersion: 'v1',
  token: process.env.SANITY_API_TOKEN,
};

export const sanityClient = createClient(config);
