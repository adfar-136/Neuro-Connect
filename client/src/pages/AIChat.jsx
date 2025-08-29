import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Send, 
  Bot, 
  User, 
  Brain, 
  Heart, 
  Shield, 
  Lightbulb,
  Loader2,
  AlertCircle
} from 'lucide-react';

const AIChat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showContext, setShowContext] = useState(false);
  const messagesEndRef = useRef(null);

  const GEMINI_API_KEY = 'AIzaSyCKFABuQkvkN0mDKvP4rZqV_oNGZaEjF5k';
  const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

  // Initial welcome message
  useEffect(() => {
    setMessages([
      {
        id: 1,
        type: 'ai',
        content: `Hello! I'm your AI mental health companion. I'm here to help you with mental health concerns, emotional well-being, and life challenges.

I can help with:
• Mental health conditions (depression, anxiety, stress)
• Emotional struggles and mood concerns
• Relationship and family issues (breakups, conflicts, loss)
• Academic and work-related stress
• Life transitions and major changes
• Personal struggles and challenges
• Social and interpersonal issues
• Coping strategies and self-help techniques
• Guidance on when to seek professional help
• Support for difficult emotions and situations

You can ask me anything like:
• "I broke up with my girlfriend and I'm devastated"
• "I'm feeling overwhelmed with school work"
• "How do I deal with a difficult family situation?"
• "I can't seem to focus or get motivated"
• "What should I do when I feel anxious?"
• "I'm having trouble sleeping"
• "I failed my exam and feel like a failure"
• "How do I know if I need professional help?"
• "I feel lonely and have no friends"
• "I'm struggling with my relationship"

Please note: I'm not a replacement for professional mental health care. If you're in crisis or need immediate help, please contact emergency services or a mental health professional.

What would you like to talk about today?`,
        timestamp: new Date()
      }
    ]);
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const isMentalHealthRelated = (message) => {
    // First, check for crisis situations (these should always be flagged)
    if (detectCrisis(message)) {
      return true;
    }

    // Mental health keywords for direct detection
    const mentalHealthKeywords = [
      'depression', 'anxiety', 'stress', 'mental health', 'therapy', 'counseling',
      'sad', 'lonely', 'hopeless', 'worried', 'nervous', 'panic', 'fear',
      'mood', 'emotion', 'feeling', 'sleep', 'appetite', 'energy', 'motivation',
      'suicide', 'self-harm', 'trauma', 'grief', 'loss', 'relationship',
      'work', 'school', 'family', 'social', 'confidence', 'self-esteem',
      'meditation', 'mindfulness', 'breathing', 'exercise', 'coping'
    ];

    // Emotional and psychological indicators
    const emotionalIndicators = [
      'feel', 'feeling', 'feelings', 'emotion', 'emotional', 'mood', 'upset',
      'sad', 'happy', 'angry', 'frustrated', 'overwhelmed', 'stressed',
      'worried', 'concerned', 'scared', 'afraid', 'nervous', 'anxious',
      'tired', 'exhausted', 'burned out', 'unmotivated', 'hopeless',
      'lonely', 'isolated', 'misunderstood', 'judged', 'pressured'
    ];

    // Life situation indicators that often relate to mental health
    const lifeSituationIndicators = [
      'relationship', 'breakup', 'divorce', 'marriage', 'dating', 'girlfriend', 'boyfriend',
      'family', 'parent', 'child', 'sibling', 'friend', 'colleague',
      'work', 'job', 'career', 'boss', 'workplace', 'college', 'university',
      'school', 'exam', 'test', 'assignment', 'deadline', 'pressure',
      'money', 'financial', 'bills', 'debt', 'housing', 'moving',
      'health', 'illness', 'pain', 'chronic', 'disability'
    ];

    // Question patterns that suggest mental health concerns
    const questionPatterns = [
      'how to', 'what should i do', 'why do i', 'how can i', 'what if',
      'is it normal', 'am i', 'do you think', 'should i', 'can you help',
      'i need help', 'i need advice', 'i don\'t know what to do',
      'i feel like', 'i think i', 'i wonder if', 'i\'m not sure'
    ];

    // Behavioral and thought patterns
    const behavioralPatterns = [
      'can\'t sleep', 'sleeping too much', 'eating too much', 'not eating',
      'avoiding', 'procrastinating', 'overthinking', 'racing thoughts',
      'mind won\'t stop', 'always worried', 'never happy', 'always sad',
      'don\'t enjoy', 'lost interest', 'no motivation', 'can\'t focus',
      'easily irritated', 'short temper', 'crying', 'emotional'
    ];

    // Major life events and changes that affect mental health
    const majorLifeEvents = [
      'broke up', 'breakup', 'broken up', 'ended relationship', 'lost my',
      'failed', 'failed exam', 'failed test', 'got fired', 'lost job',
      'moved', 'moving', 'changed schools', 'transferred', 'graduated',
      'started college', 'started university', 'started new job',
      'death', 'died', 'passed away', 'lost someone', 'funeral',
      'accident', 'injury', 'hospital', 'surgery', 'diagnosis',
      'pregnancy', 'baby', 'child', 'marriage', 'wedding',
      'divorce', 'separation', 'cheating', 'betrayal', 'lied to me'
    ];

    // Personal struggles and challenges
    const personalStruggles = [
      'struggling', 'having trouble', 'can\'t handle', 'too much',
      'overwhelmed', 'stressed out', 'burned out', 'exhausted',
      'don\'t know what to do', 'at a loss', 'confused',
      'stuck', 'trapped', 'no way out', 'hopeless',
      'worthless', 'useless', 'failure', 'disappointment',
      'embarrassed', 'ashamed', 'guilty', 'regret'
    ];

    // Social and interpersonal issues
    const socialIssues = [
      'no friends', 'lonely', 'alone', 'isolated', 'left out',
      'bullied', 'harassed', 'teased', 'made fun of', 'laughed at',
      'ignored', 'rejected', 'abandoned', 'betrayed', 'lied to',
      'gossip', 'rumors', 'social media', 'online', 'cyberbullying',
      'peer pressure', 'fitting in', 'belonging', 'accepted'
    ];

    const lowerMessage = message.toLowerCase();

    // Check for direct mental health keywords
    if (mentalHealthKeywords.some(keyword => lowerMessage.includes(keyword))) {
      return true;
    }

    // Check for emotional indicators
    if (emotionalIndicators.some(indicator => lowerMessage.includes(indicator))) {
      return true;
    }

    // Check for life situations that often relate to mental health
    if (lifeSituationIndicators.some(indicator => lowerMessage.includes(indicator))) {
      return true;
    }

    // Check for major life events that significantly affect mental health
    if (majorLifeEvents.some(event => lowerMessage.includes(event))) {
      return true;
    }

    // Check for personal struggles and challenges
    if (personalStruggles.some(struggle => lowerMessage.includes(struggle))) {
      return true;
    }

    // Check for social and interpersonal issues
    if (socialIssues.some(issue => lowerMessage.includes(issue))) {
      return true;
    }

    // Check for question patterns that suggest seeking help
    if (questionPatterns.some(pattern => lowerMessage.includes(pattern))) {
      return true;
    }

    // Check for behavioral patterns
    if (behavioralPatterns.some(pattern => lowerMessage.includes(pattern))) {
      return true;
    }

    // Check for personal pronouns and emotional language
    const personalPronouns = ['i', 'me', 'my', 'myself', 'i\'m', 'i am'];
    const hasPersonalPronoun = personalPronouns.some(pronoun => lowerMessage.includes(pronoun));
    
    // If message contains personal pronouns and seems like a personal question/concern
    if (hasPersonalPronoun && (lowerMessage.includes('?') || lowerMessage.includes('help') || lowerMessage.includes('advice'))) {
      return true;
    }

    // Check for general well-being and life advice requests
    const wellBeingIndicators = [
      'better', 'improve', 'change', 'fix', 'solve', 'deal with',
      'handle', 'manage', 'cope', 'get through', 'overcome',
      'advice', 'suggestion', 'tip', 'help', 'support', 'guidance'
    ];

    if (wellBeingIndicators.some(indicator => lowerMessage.includes(indicator))) {
      return true;
    }

    // Check for any personal statement that might indicate emotional distress
    // This is a broader catch-all for personal situations
    if (hasPersonalPronoun && (
      lowerMessage.includes('broke') || 
      lowerMessage.includes('lost') || 
      lowerMessage.includes('failed') || 
      lowerMessage.includes('can\'t') || 
      lowerMessage.includes('won\'t') || 
      lowerMessage.includes('always') || 
      lowerMessage.includes('never') ||
      lowerMessage.includes('hate') ||
      lowerMessage.includes('love') ||
      lowerMessage.includes('miss') ||
      lowerMessage.includes('want') ||
      lowerMessage.includes('need')
    )) {
      return true;
    }

    return false;
  };

  const detectCrisis = (message) => {
    const crisisKeywords = [
      'suicide', 'kill myself', 'want to die', 'end it all', 'no reason to live',
      'self-harm', 'cut myself', 'hurt myself', 'better off dead',
      'planning suicide', 'suicidal thoughts', 'suicidal ideation'
    ];

    const lowerMessage = message.toLowerCase();
    return crisisKeywords.some(keyword => lowerMessage.includes(keyword));
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setError('');

    try {
      // Check for crisis situations first
      if (detectCrisis(inputMessage)) {
        const crisisResponse = {
          id: Date.now() + 1,
          type: 'ai',
          content: `I'm very concerned about what you're sharing. This sounds like a crisis situation that requires immediate professional help.

🚨 CRISIS RESOURCES:
• National Suicide Prevention Lifeline (US): 988 or 1-800-273-8255
• Crisis Text Line: Text HOME to 741741
• Emergency Services: 911 (US) or your local emergency number

Please reach out to one of these resources immediately. You don't have to go through this alone, and there are people who want to help you.

If you're in immediate danger, please call emergency services right now.`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, crisisResponse]);
        setIsLoading(false);
        return;
      }

      // Check if message is mental health related
      if (!isMentalHealthRelated(inputMessage)) {
        const aiResponse = {
          id: Date.now() + 1,
          type: 'ai',
          content: `I'm here specifically to help with mental health, emotional well-being, and life challenges. I can assist you with:

• Emotional struggles and mood concerns
• Relationship and family issues (breakups, conflicts, loss)
• Academic and work-related stress
• Life transitions and major changes
• Personal struggles and challenges
• Social and interpersonal issues
• Coping strategies and self-help techniques
• Understanding mental health conditions
• Self-care practices and wellness
• Guidance on seeking professional help

Examples of what I can help with:
• "I broke up with my girlfriend and I'm devastated"
• "I'm feeling overwhelmed with my studies"
• "How do I handle a difficult family situation?"
• "I can't seem to focus or get motivated lately"
• "What should I do when I feel stressed?"
• "I'm having trouble sleeping because of worry"
• "I failed my exam and feel like a failure"
• "How do I know if I need to see a therapist?"
• "I feel lonely and have no friends"
• "I'm struggling with my relationship"

Could you please rephrase your question to focus on your emotional well-being, mental health, relationships, stress, life challenges, or any personal struggles you're experiencing? I'm here to support you with these important topics.`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiResponse]);
        setIsLoading(false);
        return;
      }

      // Build conversation context for the AI
      const conversationContext = messages
        .filter(msg => msg.type === 'user' || msg.type === 'ai')
        .slice(-10) // Last 10 messages for context
        .map(msg => `${msg.type === 'user' ? 'Student' : 'AI'}: ${msg.content}`)
        .join('\n\n');

      // Prepare the prompt for Gemini with conversation context
      const prompt = `You are a compassionate AI mental health companion designed to help students with mental health and emotional well-being. You are having an ongoing conversation with a student.

IMPORTANT GUIDELINES:
- Be supportive, empathetic, and non-judgmental
- Provide practical coping strategies and self-help techniques
- Always encourage seeking professional help when appropriate
- Never give medical advice or diagnose conditions
- Focus on education, support, and resources
- Keep responses helpful but concise (2-3 paragraphs max)
- If the student mentions crisis situations, immediately provide crisis resources
- Always end with encouragement to seek professional help if needed
- Understand that students may express concerns in various ways - not just using clinical terms
- Look for underlying emotional needs even in seemingly simple questions
- Provide guidance on when to seek professional help
- Be especially sensitive to relationship issues, breakups, academic failures, and major life changes
- Recognize that these situations can significantly impact mental health and emotional well-being
- Offer practical advice for coping with difficult life events
- Validate their feelings and experiences
- IMPORTANT: Always consider the conversation context and relate new messages to what was discussed before
- If the student mentions feeling stressed, anxious, or any other emotion, connect it to previous topics they've shared
- Build on previous conversation to provide more personalized and relevant support

CONVERSATION CONTEXT (recent messages):
${conversationContext}

Student's latest message: "${inputMessage}"

Please provide a helpful, supportive response that:
1. Acknowledges the current message
2. Connects it to the ongoing conversation context when relevant
3. Provides practical support and coping strategies
4. Encourages professional help when appropriate
5. Shows understanding of their situation and feelings

Remember to maintain conversation continuity and relate their current feelings or concerns to what they've shared previously.`;

      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        const aiResponse = {
          id: Date.now() + 1,
          type: 'ai',
          content: data.candidates[0].content.parts[0].text,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiResponse]);
      } else {
        throw new Error('Invalid response format from API');
      }

    } catch (error) {
      console.error('Error sending message:', error);
      setError('Sorry, I encountered an error. Please try again or contact support if the problem persists.');
      
      const errorResponse = {
        id: Date.now() + 1,
        type: 'ai',
        content: `I'm having trouble connecting right now. Please try again in a moment. If you need immediate mental health support, please consider:

• Contacting a mental health professional
• Calling a crisis helpline
• Reaching out to a trusted friend or family member
• Using other mental health resources available to you

I'm here to help when the connection is restored.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AI Mental Health Companion</h1>
                <p className="text-sm text-gray-600">Your 24/7 mental health support</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-xl shadow-lg h-[600px] flex flex-col">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-emerald-500 to-blue-600 text-white p-4 rounded-t-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Brain className="w-6 h-6" />
                <div>
                  <h2 className="font-semibold">Mental Health Support</h2>
                  <p className="text-sm text-emerald-100">Confidential • Supportive • Educational</p>
                </div>
              </div>
              <button
                onClick={() => setShowContext(!showContext)}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1 rounded-lg text-sm transition-colors"
                title="Show conversation context"
              >
                {showContext ? 'Hide Context' : 'Show Context'}
              </button>
            </div>
            
            {/* Context Display */}
            {showContext && messages.length > 1 && (
              <div className="mt-3 p-3 bg-white bg-opacity-10 rounded-lg">
                <p className="text-xs text-emerald-100 mb-2">AI is considering this conversation context:</p>
                <div className="text-xs text-emerald-100 max-h-20 overflow-y-auto">
                  {messages
                    .filter(msg => msg.type === 'user' || msg.type === 'ai')
                    .slice(-6)
                    .map((msg, index) => (
                      <div key={index} className="mb-1">
                        <span className="font-medium">
                          {msg.type === 'user' ? 'You' : 'AI'}:
                        </span>
                        <span className="ml-2">
                          {msg.content.length > 50 
                            ? msg.content.substring(0, 50) + '...' 
                            : msg.content
                          }
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.type === 'user'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.type === 'ai' && (
                      <Bot className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    )}
                    {message.type === 'user' && (
                      <User className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="whitespace-pre-wrap">{message.content}</p>
                      <p className={`text-xs mt-2 ${
                        message.type === 'user' ? 'text-emerald-100' : 'text-gray-500'
                      }`}>
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-5 h-5 text-emerald-600 animate-spin" />
                    <span className="text-gray-600">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="flex justify-start">
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <span className="text-red-700 text-sm">{error}</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex space-x-3">
              <div className="flex-1 relative">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Share your thoughts, feelings, or ask about mental health..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                  rows="2"
                  disabled={isLoading}
                />
                <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                  Press Enter to send
                </div>
              </div>
              <button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-300 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 disabled:cursor-not-allowed"
              >
                <Send className="h-5 w-5" />
                <span>Send</span>
              </button>
            </div>
            
            {/* Context Indicator */}
            {messages.length > 1 && (
              <div className="mt-3 flex items-center space-x-2 text-xs text-emerald-600">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span>AI is maintaining conversation context</span>
                <button
                  onClick={() => setShowContext(!showContext)}
                  className="text-emerald-600 hover:text-emerald-700 underline"
                >
                  {showContext ? 'Hide' : 'Show'} context
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mental Health Resources */}
        <div className="mt-6 bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Heart className="w-5 h-5 text-emerald-600 mr-2" />
            Mental Health Resources
          </h3>
          
          {/* Safety Notice */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2 mb-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <span className="font-medium text-red-800">Important Safety Notice</span>
            </div>
            <p className="text-red-700 text-sm">
              This AI chat is for educational and supportive purposes only. It is not a replacement for professional mental health care. 
              If you are experiencing a crisis or need immediate help, please contact emergency services or a mental health professional.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-emerald-50 rounded-lg">
              <Shield className="w-8 h-8 text-emerald-600 mb-2" />
              <h4 className="font-medium text-gray-900 mb-1">Crisis Support</h4>
              <p className="text-sm text-gray-600 mb-2">24/7 helplines and emergency resources</p>
              <div className="text-xs text-emerald-700 space-y-1">
                <p>• National Suicide Prevention: 988</p>
                <p>• Crisis Text Line: Text HOME to 741741</p>
                <p>• Emergency Services: 911</p>
              </div>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <Lightbulb className="w-8 h-8 text-blue-600 mb-2" />
              <h4 className="font-medium text-gray-900 mb-1">Self-Help Tools</h4>
              <p className="text-sm text-gray-600 mb-2">Techniques and exercises for daily use</p>
              <div className="text-xs text-blue-700 space-y-1">
                <p>• Breathing exercises</p>
                <p>• Mindfulness techniques</p>
                <p>• Coping strategies</p>
              </div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <Brain className="w-8 h-8 text-purple-600 mb-2" />
              <h4 className="font-medium text-gray-900 mb-1">Professional Help</h4>
              <p className="text-sm text-gray-600 mb-2">When and how to seek professional support</p>
              <div className="text-xs text-purple-700 space-y-1">
                <p>• Find a therapist</p>
                <p>• University counseling</p>
                <p>• Support groups</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
