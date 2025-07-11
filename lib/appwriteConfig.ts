import {Client,Account} from 'react-native-appwrite';
import {Platform} from 'react-native';

const endpoint = process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT;
const projectId = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID;
const bundleId = process.env.EXPO_PUBLIC_APPWRITE_BUNDLE_ID;

if (!endpoint) {
    throw new Error('EXPO_PUBLIC_APPWRITE_ENDPOINT is not defined');
}
if (!projectId) {
    throw new Error('EXPO_PUBLIC_APPWRITE_PROJECT_ID is not defined');
}
if (!bundleId) {
    throw new Error('EXPO_PUBLIC_APPWRITE_BUNDLE_ID is not defined');
}

const client = new Client()
    .setEndpoint(endpoint)
    .setProject(projectId)
    

switch (Platform.OS) {
    case 'ios':
        client.setPlatform(bundleId);
        break;
    case 'android':
        client.setPlatform(bundleId);
        break;
}

const account = new Account(client);

export {client, account};