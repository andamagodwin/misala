import {Client,Account} from 'react-native-appwrite';
import {Platform} from 'react-native';

const endpoint = process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT;
const projectId = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID;
const bundleId = process.env.EXPO_PUBLIC_APPWRITE_BUNDLE_ID;

console.log('Appwrite config:', { endpoint, projectId, bundleId });

if (!endpoint) {
    console.error('EXPO_PUBLIC_APPWRITE_ENDPOINT is not defined');
    throw new Error('EXPO_PUBLIC_APPWRITE_ENDPOINT is not defined');
}
if (!projectId) {
    console.error('EXPO_PUBLIC_APPWRITE_PROJECT_ID is not defined');
    throw new Error('EXPO_PUBLIC_APPWRITE_PROJECT_ID is not defined');
}
if (!bundleId) {
    console.error('EXPO_PUBLIC_APPWRITE_BUNDLE_ID is not defined');
    throw new Error('EXPO_PUBLIC_APPWRITE_BUNDLE_ID is not defined');
}

let client: Client;
let account: Account;

try {
    client = new Client()
        .setEndpoint(endpoint)
        .setProject(projectId);
    
    switch (Platform.OS) {
        case 'ios':
            client.setPlatform(bundleId);
            break;
        case 'android':
            client.setPlatform(bundleId);
            break;
    }

    account = new Account(client);
    console.log('Appwrite client initialized successfully');
} catch (error) {
    console.error('Failed to initialize Appwrite client:', error);
    throw error;
}

export {client, account};