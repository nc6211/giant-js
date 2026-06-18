
export type FileType = 'js' | 'jsx';

export interface ProjectFile {
  id: string;
  name: string;
  content: string;
  type: FileType;
  lastModified: number;
}
