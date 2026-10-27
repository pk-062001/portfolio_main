import { getCollection, type CollectionEntry } from 'astro:content';

export type Project = CollectionEntry<'projects'>;

export async function getProjects() {
  const all = await getCollection('projects', ({ data }) => !data.draft);
  return all.sort((a, b) => a.data.order - b.data.order || Number(b.data.year) - Number(a.data.year));
}
