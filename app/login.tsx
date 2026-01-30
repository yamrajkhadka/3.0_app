import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { signInWithGoogle } from '../services/googleAuth';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    console.log('🔘 Button pressed!');
    
    try {
      console.log('📞 Calling signInWithGoogle...');
      const userInfo = await signInWithGoogle();
      
      console.log('✅ Got user info:', userInfo);
      
      // The correct way to access user data:
      const email = userInfo?.data?.user?.email;
      const name = userInfo?.data?.user?.name;
      const photo = userInfo?.data?.user?.photo;
      
      console.log('User Email:', email);
      console.log('User Name:', name);
      console.log('User Photo:', photo);
      
      if (name) {
        Alert.alert('Success', `Welcome ${name}!`);
      } else {
        Alert.alert('Success', 'Signed in successfully!');
      }
      
      // Navigate to home or save user data
      // router.push('/(tabs)');
      
    } catch (error: any) {
      console.log('❌ Error caught:', error);
      console.log('Error code:', error?.code);
      console.log('Error message:', error?.message);
      
      Alert.alert('Error', `Failed to sign in: ${error?.message || 'Unknown error'}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>LexNepal AI</Text>
      <Text style={styles.subtitle}>Legal AI Assistant</Text>
      
      <TouchableOpacity 
        style={styles.googleButton}
        onPress={handleGoogleSignIn}
      >
        <Text style={styles.buttonText}>🔐 Sign in with Google</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 50,
  },
  googleButton: {
    backgroundColor: '#4285F4',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    minWidth: 250,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});