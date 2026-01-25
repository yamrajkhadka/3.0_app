import { API_CONFIG } from '@/constants/Config';
export interface ApiResponse {
  answer: string;
  sources?: any[];
}
class LegalApiService {
  private async makeRequest(question: string, retryCount = 0): Promise<ApiResponse> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);
      const response = await fetch(API_CONFIG.BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ query: question.trim() }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      const data = await response.json();
      return { answer: data.answer || 'No answer received', sources: data.sources };
    } catch (error: any) {
      if (retryCount < API_CONFIG.MAX_RETRIES) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        return this.makeRequest(question, retryCount + 1);
      }
      throw error;
    }
  }
  async askQuestion(question: string): Promise<ApiResponse> {
    if (!question?.trim()) throw new Error('Question cannot be empty');
    return this.makeRequest(question);
  }
}
export const legalApiService = new LegalApiService();
