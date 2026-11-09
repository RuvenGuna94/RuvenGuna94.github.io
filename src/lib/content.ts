export const previewDrafts = import.meta.env.DEV || import.meta.env.PREVIEW_DRAFTS === 'true';
export const visible = (entry: { data: { draft?: boolean } }) => !entry.data.draft || previewDrafts;
export const url = (path = '') => `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
