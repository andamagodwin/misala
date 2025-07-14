import { Databases, ID, Query, Models, Permission, Role } from 'react-native-appwrite';
import { client, storage } from './appwriteConfig';

// Initialize Databases
const databases = new Databases(client);

// Constants
export const GUIDEBOOK_DATABASE_ID = '6871206100262eb02793'; // Use the same database as blogs
export const GUIDEBOOK_COLLECTION_ID = '6874901a000373be1fb7'; // You'll need to create this collection
export const GUIDEBOOK_STORAGE_BUCKET_ID = '68748f42002ef688a621'; // You'll need to create this bucket

// Guidebook Document Interface
export interface GuidebookDocument extends Models.Document {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: string[];
  $collectionId: string;
  $databaseId: string;
  title: string;
  description: string;
  fileName: string;
  fileId: string;
  fileUrl: string;
  fileSize: number;
  fileType: string;
  uploadedBy: string;
  uploaderName: string;
  category: string;
  tags: string[];
  downloadCount: number;
  createdAt: string;
  updatedAt: string;
}

// File Upload Response Interface
export interface FileUploadResponse {
  $id: string;
  bucketId: string;
  name: string;
  signature: string;
  mimeType: string;
  sizeOriginal: number;
  chunksTotal: number;
  chunksUploaded: number;
}

class GuidebookService {
  // Test connection to Appwrite
  async testConnection(): Promise<void> {
    try {
      console.log('Testing Appwrite connection...');
      
      // Test database connection
      const dbTest = await databases.listDocuments(
        GUIDEBOOK_DATABASE_ID,
        GUIDEBOOK_COLLECTION_ID,
        [Query.limit(1)]
      );
      console.log('Database connection successful:', dbTest);
      
      // Test storage connection by listing files
      console.log('Storage bucket ID:', GUIDEBOOK_STORAGE_BUCKET_ID);
      console.log('Client config:', {
        endpoint: client.config.endpoint,
        project: client.config.project
      });
      
    } catch (error) {
      console.error('Connection test failed:', error);
      throw error;
    }
  }

  // Upload file to storage
  async uploadFile(file: any, fileName: string): Promise<FileUploadResponse> {
    try {
      console.log('Uploading file:', fileName);
      console.log('File object:', file);
      
      // Create a proper file object for Appwrite
      const fileToUpload = {
        name: file.name,
        type: file.mimeType || file.type,
        size: file.size,
        uri: file.uri
      };
      
      console.log('Processed file for upload:', fileToUpload);
      
      const uploadedFile = await storage.createFile(
        GUIDEBOOK_STORAGE_BUCKET_ID,
        ID.unique(),
        fileToUpload
      );
      
      console.log('File uploaded successfully:', uploadedFile);
      return uploadedFile;
    } catch (error) {
      console.error('Error uploading file:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      throw new Error(`Failed to upload file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Get file URL
  getFileUrl(fileId: string): string {
    try {
      return `${client.config.endpoint}/storage/buckets/${GUIDEBOOK_STORAGE_BUCKET_ID}/files/${fileId}/view?project=${client.config.project}`;
    } catch (error) {
      console.error('Error getting file URL:', error);
      throw new Error('Failed to get file URL');
    }
  }

  // Get file download URL
  getFileDownloadUrl(fileId: string): string {
    try {
      return `${client.config.endpoint}/storage/buckets/${GUIDEBOOK_STORAGE_BUCKET_ID}/files/${fileId}/download?project=${client.config.project}`;
    } catch (error) {
      console.error('Error getting file download URL:', error);
      throw new Error('Failed to get file download URL');
    }
  }

  // Create guidebook document
  async createGuidebook(
    title: string,
    description: string,
    fileName: string,
    fileId: string,
    fileUrl: string,
    fileSize: number,
    fileType: string,
    uploadedBy: string,
    uploaderName: string,
    category: string,
    tags: string[]
  ): Promise<GuidebookDocument> {
    try {
      const guidebook = await databases.createDocument(
        GUIDEBOOK_DATABASE_ID,
        GUIDEBOOK_COLLECTION_ID,
        ID.unique(),
        {
          title,
          description,
          fileName,
          fileId,
          fileUrl,
          fileSize,
          fileType,
          uploadedBy,
          uploaderName,
          category,
          tags,
          downloadCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        [
          Permission.read(Role.any()),
          Permission.update(Role.user(uploadedBy)),
          Permission.delete(Role.user(uploadedBy))
        ]
      );

      console.log('Guidebook created successfully:', guidebook);
      return guidebook as GuidebookDocument;
    } catch (error) {
      console.error('Error creating guidebook:', error);
      throw new Error(`Failed to create guidebook: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Fetch all guidebooks
  async fetchGuidebooks(): Promise<{ documents: GuidebookDocument[] }> {
    try {
      const response = await databases.listDocuments(
        GUIDEBOOK_DATABASE_ID,
        GUIDEBOOK_COLLECTION_ID,
        [
          Query.orderDesc('$createdAt'),
          Query.limit(50)
        ]
      );

      console.log('Guidebooks fetched successfully:', response.documents.length);
      return response as unknown as { documents: GuidebookDocument[] };
    } catch (error) {
      console.error('Error fetching guidebooks:', error);
      throw new Error(`Failed to fetch guidebooks: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Search guidebooks
  async searchGuidebooks(query: string): Promise<{ documents: GuidebookDocument[] }> {
    try {
      const response = await databases.listDocuments(
        GUIDEBOOK_DATABASE_ID,
        GUIDEBOOK_COLLECTION_ID,
        [
          Query.or([
            Query.search('title', query),
            Query.search('description', query),
            Query.search('category', query)
          ]),
          Query.orderDesc('$createdAt'),
          Query.limit(50)
        ]
      );

      console.log('Guidebooks search completed:', response.documents.length);
      return response as unknown as { documents: GuidebookDocument[] };
    } catch (error) {
      console.error('Error searching guidebooks:', error);
      throw new Error(`Failed to search guidebooks: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Update download count
  async incrementDownloadCount(guidebookId: string): Promise<void> {
    try {
      const guidebook = await databases.getDocument(
        GUIDEBOOK_DATABASE_ID,
        GUIDEBOOK_COLLECTION_ID,
        guidebookId
      );

      await databases.updateDocument(
        GUIDEBOOK_DATABASE_ID,
        GUIDEBOOK_COLLECTION_ID,
        guidebookId,
        {
          downloadCount: (guidebook.downloadCount || 0) + 1,
          updatedAt: new Date().toISOString()
        }
      );

      console.log('Download count updated successfully');
    } catch (error) {
      console.error('Error updating download count:', error);
      throw new Error('Failed to update download count');
    }
  }

  // Delete guidebook
  async deleteGuidebook(guidebookId: string, fileId: string): Promise<void> {
    try {
      // Delete file from storage
      await storage.deleteFile(GUIDEBOOK_STORAGE_BUCKET_ID, fileId);
      
      // Delete document from database
      await databases.deleteDocument(
        GUIDEBOOK_DATABASE_ID,
        GUIDEBOOK_COLLECTION_ID,
        guidebookId
      );

      console.log('Guidebook deleted successfully');
    } catch (error) {
      console.error('Error deleting guidebook:', error);
      throw new Error(`Failed to delete guidebook: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

export const guidebookService = new GuidebookService();
