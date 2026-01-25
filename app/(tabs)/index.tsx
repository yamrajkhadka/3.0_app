import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  StyleSheet,
  Modal,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';
import { APP_CONFIG } from '@/constants/Config';
import { legalApiService } from '@/services/api';
import { useChatStore, Message } from '@/store/chatStore';
import { useAuthStore } from '@/store/authStore';
import { format } from 'date-fns';

export default function ChatScreen() {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const { chats, currentChatId, createChat, deleteChat, addMessage, setCurrentChat, getCurrentChat, loadChats } = useChatStore();
  const { user, logout } = useAuthStore();

  const currentChat = getCurrentChat();

  useEffect(() => {
    loadChats();
  }, []);

  const handleNewChat = () => {
    createChat();
    setShowSidebar(false);
  };

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    let chatId = currentChatId;
    if (!chatId) {
      chatId = createChat();
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    await addMessage(chatId, userMessage);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await legalApiService.askQuestion(userMessage.text);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.answer,
        isUser: false,
        timestamp: new Date(),
      };
      await addMessage(chatId, aiMessage);
    } catch (error: any) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `Error: ${error.message || 'Failed to get response'}`,
        isUser: false,
        timestamp: new Date(),
      };
      await addMessage(chatId, errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setShowSidebar(true)} style={styles.menuButton}>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{currentChat?.title || 'LexNepal AI'}</Text>
        <TouchableOpacity onPress={handleNewChat}>
          <Text style={styles.newChatIcon}>✏️</Text>
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <KeyboardAvoidingView style={styles.content} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd()}
        >
          {(!currentChat || currentChat.messages.length === 0) && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>🇳🇵 Welcome to LexNepal AI</Text>
              <Text style={styles.emptySubtitle}>Ask anything about Nepal law</Text>
              {APP_CONFIG.SAMPLE_QUESTIONS.slice(0, 3).map((q, i) => (
                <TouchableOpacity key={i} style={styles.sampleButton} onPress={() => setInputText(q)}>
                  <Text style={styles.sampleText}>{q}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {currentChat?.messages.map((msg) => (
            <View key={msg.id} style={[styles.messageBubble, msg.isUser ? styles.userBubble : styles.aiBubble]}>
              <Text style={msg.isUser ? styles.userText : styles.aiText}>{msg.text}</Text>
            </View>
          ))}

          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={Colors.primary} />
              <Text style={styles.loadingText}>Thinking...</Text>
            </View>
          )}
        </ScrollView>

        {/* Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Message LexNepal AI..."
            placeholderTextColor={Colors.textLight}
            multiline
            maxLength={500}
            editable={!isLoading}
          />
          <TouchableOpacity
            style={[styles.sendButton, (!inputText.trim() || isLoading) && styles.sendButtonDisabled]}
            onPress={sendMessage}
            disabled={!inputText.trim() || isLoading}
          >
            <Text style={styles.sendButtonText}>➤</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Sidebar */}
      <Modal visible={showSidebar} animationType="slide" transparent onRequestClose={() => setShowSidebar(false)}>
        <View style={styles.sidebarOverlay}>
          <View style={styles.sidebar}>
            <View style={styles.sidebarHeader}>
              <TouchableOpacity onPress={handleNewChat} style={styles.newChatButton}>
                <Text style={styles.newChatButtonText}>+ New Chat</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowSidebar(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={chats}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.chatItem, item.id === currentChatId && styles.chatItemActive]}
                  onPress={() => {
                    setCurrentChat(item.id);
                    setShowSidebar(false);
                  }}
                >
                  <View style={styles.chatItemContent}>
                    <Text style={styles.chatItemTitle} numberOfLines={1}>
                      {item.title}
                    </Text>
                    <Text style={styles.chatItemDate}>{format(item.updatedAt, 'MMM d')}</Text>
                  </View>
                  <TouchableOpacity onPress={() => deleteChat(item.id)}>
                    <Text style={styles.deleteButton}>🗑️</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              )}
            />

            <View style={styles.sidebarFooter}>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{user?.name}</Text>
                <Text style={styles.userEmail}>{user?.email}</Text>
              </View>
              <TouchableOpacity onPress={logout} style={styles.logoutButton}>
                <Text style={styles.logoutText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  menuButton: { marginRight: 12 },
  menuIcon: { fontSize: 24, color: Colors.text },
  headerTitle: { flex: 1, fontSize: 16, fontWeight: '600', color: Colors.text },
  newChatIcon: { fontSize: 20 },
  content: { flex: 1 },
  messagesContainer: { flex: 1 },
  messagesContent: { padding: 16 },
  emptyState: { alignItems: 'center', paddingTop: 60 },
  emptyTitle: { fontSize: 24, fontWeight: '600', color: Colors.text, marginBottom: 8 },
  emptySubtitle: { fontSize: 14, color: Colors.textLight, marginBottom: 24 },
  sampleButton: {
    backgroundColor: Colors.surface,
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sampleText: { color: Colors.primary, fontSize: 14 },
  messageBubble: { maxWidth: '80%', padding: 12, borderRadius: 16, marginBottom: 12 },
  userBubble: { alignSelf: 'flex-end', backgroundColor: Colors.primary },
  aiBubble: { alignSelf: 'flex-start', backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border },
  userText: { color: 'white', fontSize: 15 },
  aiText: { color: Colors.text, fontSize: 15, lineHeight: 22 },
  loadingContainer: { flexDirection: 'row', alignItems: 'center', padding: 12 },
  loadingText: { marginLeft: 8, color: Colors.textLight },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 8,
    fontSize: 15,
    maxHeight: 100,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: { opacity: 0.5 },
  sendButtonText: { color: 'white', fontSize: 20 },
  sidebarOverlay: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sidebar: {
    width: '75%',
    backgroundColor: Colors.surface,
    borderRightWidth: 1,
    borderRightColor: Colors.border,
  },
  sidebarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  newChatButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  newChatButtonText: { color: 'white', fontWeight: '600' },
  closeButton: { fontSize: 24, color: Colors.textLight },
  chatItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  chatItemActive: { backgroundColor: Colors.background },
  chatItemContent: { flex: 1 },
  chatItemTitle: { fontSize: 14, fontWeight: '500', color: Colors.text },
  chatItemDate: { fontSize: 12, color: Colors.textLight, marginTop: 4 },
  deleteButton: { fontSize: 18, padding: 4 },
  sidebarFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    marginTop: 'auto',
  },
  userInfo: { marginBottom: 12 },
  userName: { fontSize: 14, fontWeight: '600', color: Colors.text },
  userEmail: { fontSize: 12, color: Colors.textLight },
  logoutButton: {
    backgroundColor: Colors.error,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutText: { color: 'white', fontWeight: '600' },
});
