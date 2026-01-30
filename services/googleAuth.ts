import { GoogleSignin } from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
  iosClientId: process.env.EXPO_PUBLIC_IOS_CLIENT_ID,
  offlineAccess: true,
  scopes: ['profile', 'email'],
});

export const signInWithGoogle = async () => {
  try {
    console.log('🔍 Checking Play Services...');
    // @ts-ignore
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    
    console.log('🚀 Starting Google Sign-In...');
    // @ts-ignore
    const response = await GoogleSignin.signIn();
    
    console.log('✅ Sign-in successful!');
    console.log('📦 Response:', JSON.stringify(response, null, 2));
    
    const user = (response as any)?.data?.user;
    
    if (user) {
      console.log('✅ User Email:', user?.email);
      console.log('✅ User Name:', user?.name);
    }
    
    return response;
  } catch (error: any) {
    console.error('❌ Sign-In Error:', error);
    throw error;
  }
};

export const signOutFromGoogle = async () => {
  try {
    // @ts-ignore
    await GoogleSignin.signOut();
    console.log('✅ Signed out');
  } catch (error) {
    console.error('❌ Sign-out error:', error);
  }
};

export const isSignedIn = async () => {
  try {
    // @ts-ignore
    return await GoogleSignin.isSignedIn();
  } catch (error) {
    return false;
  }
};

export const getCurrentUser = async () => {
  try {
    // @ts-ignore
    const user = await GoogleSignin.getCurrentUser();
    return (user as any)?.data?.user || null;
  } catch (error) {
    return null;
  }
};