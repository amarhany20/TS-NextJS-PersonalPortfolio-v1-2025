export interface MediaAsset {
  id: string;
  filename: string;
  originalName?: string;
  path: string;
  url: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  checksum?: string;
  createdAt: string;
  createdById?: string;
  createdByName?: string;
}
