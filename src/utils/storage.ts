import { ProjectFile } from '../types';

const STORAGE_KEY = 'giant_js_files';

export const storage = {
  getFiles: (): ProjectFile[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveFile: (file: ProjectFile) => {
    const files = storage.getFiles();
    const index = files.findIndex(f => f.id === file.id);
    if (index >= 0) {
      files[index] = { ...file, lastModified: Date.now() };
    } else {
      files.push({ ...file, lastModified: Date.now() });
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(files));
  },

  deleteFile: (id: string) => {
    const files = storage.getFiles().filter(f => f.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(files));
  },

  getFile: (id: string): ProjectFile | undefined => {
    return storage.getFiles().find(f => f.id === id);
  }
};
