# 🧠 Mental Health Support Platform

A comprehensive full-stack mental health application providing AI-powered support, crisis intervention, and personalized wellness tracking. Built with modern web technologies and designed with user safety and privacy as top priorities.

![Next.js](https://img.shields.io/badge/Next.js-15.4.5-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.1.0-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![AWS S3](https://img.shields.io/badge/AWS_S3-Cloud_Storage-orange?style=for-the-badge&logo=amazon-aws)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--3.5--turbo-green?style=for-the-badge&logo=openai)

## 🌟 Features

### 🤖 **AI-Powered Chatbot**
- **Intelligent Conversations**: GPT-3.5-turbo integration with specialized mental health prompts
- **Crisis Detection**: Real-time keyword analysis for immediate intervention (no API cost)
- **Personalized Responses**: Context-aware AI using user mood patterns and preferences
- **Cost Optimization**: Smart token usage tracking and rate limiting
- **24/7 Availability**: Always-on support with comprehensive crisis resources

### 👤 **User Profile & Tracking**
- **Comprehensive Profiles**: Personal information, focus areas, and preferences
- **Mood Tracking**: Daily mood logging with notes, triggers, and coping strategies
- **Weekly Check-ins**: Multi-dimensional wellness assessments (mood, sleep, stress, exercise)
- **Progress Analytics**: Visual insights and trends over time
- **Data Privacy**: Secure, encrypted user data with GDPR considerations

### 📚 **Resource Library**
- **Mental Health Disorders**: Comprehensive information on anxiety, depression, ADHD, PTSD
- **Self-Care Techniques**: Interactive breathing exercises, mindfulness practices
- **External Resources**: Curated links to professional help and support organizations
- **Crisis Resources**: Immediate access to hotlines, emergency services, and safety planning

### 🆘 **Crisis Support**
- **Immediate Intervention**: Real-time crisis detection with instant response
- **Emergency Resources**: 988 Suicide Prevention, Crisis Text Line (741741), 911
- **Safety Planning**: Comprehensive crisis management and coping strategies
- **Professional Referrals**: Direct links to mental health professionals and services

### 💬 **Chat History & Sessions**
- **Persistent Conversations**: Save and continue previous chat sessions
- **Session Management**: Create, rename, and delete conversation threads
- **Message History**: Complete chat logs with timestamps and context
- **Export Capability**: Download conversation history for personal records

## 🛠️ Tech Stack

### **Frontend**
- **Next.js 15.4.5** - React framework with App Router and Turbopack
- **React 19.1.0** - Modern React with hooks and concurrent features
- **TypeScript 5.0** - Type-safe development with full IDE support
- **Tailwind CSS 3.4.1** - Utility-first CSS framework with custom design system
- **Responsive Design** - Mobile-first approach with accessibility features

### **Backend**
- **Next.js API Routes** - Serverless API endpoints with TypeScript
- **NextAuth.js 4.24.11** - Secure authentication with JWT and sessions
- **bcryptjs** - Password hashing and security
- **Node.js** - Server-side JavaScript runtime

### **AI & APIs**
- **OpenAI API** - GPT-3.5-turbo integration with custom prompts
- **Cost Management** - Usage tracking, rate limiting, and budget controls
- **Context Awareness** - Personalized AI responses using user data

### **Cloud & Storage**
- **AWS S3** - Scalable cloud storage with SDK integration
- **Hybrid Storage** - Local development + cloud production architecture
- **Data Migration** - Seamless local-to-cloud data transfer
- **Backup Systems** - Automated data backup and recovery

### **Development Tools**
- **ESLint** - Code linting and quality assurance
- **PostCSS** - CSS processing and optimization
- **Autoprefixer** - Cross-browser CSS compatibility
- **Git** - Version control with comprehensive commit history

## 🚀 Getting Started

### **Prerequisites**
- Node.js 18+ and npm
- OpenAI API key
- AWS account (optional, for cloud storage)

### **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/Full-Stack-Mental-Health-App.git
   cd Full-Stack-Mental-Health-App/mental-health-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_nextauth_secret_here
   OPENAI_API_KEY=sk-your_openai_api_key_here
   MAX_DAILY_REQUESTS=50
   MAX_MONTHLY_COST=20
   
   # AWS Configuration (Optional)
   USE_S3_STORAGE=false
   AWS_ACCESS_KEY_ID=your_aws_access_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret_key
   AWS_REGION=us-east-1
   AWS_S3_BUCKET_NAME=your-bucket-name
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
mental-health-app/
├── src/
│   ├── app/
│   │   ├── api/                 # API routes
│   │   │   ├── auth/           # Authentication endpoints
│   │   │   ├── chatbot/        # AI chatbot API
│   │   │   ├── profile/        # User profile management
│   │   │   └── admin/          # Admin dashboard
│   │   ├── components/         # Reusable React components
│   │   ├── lib/                # Utility functions and services
│   │   │   ├── userStore.ts    # User data management
│   │   │   ├── s3Service.ts    # AWS S3 integration
│   │   │   └── usageTracker.ts # API usage monitoring
│   │   ├── hooks/              # Custom React hooks
│   │   ├── home/               # Home page
│   │   ├── chatbot/            # AI chat interface
│   │   ├── profile/            # User profile pages
│   │   ├── learn/              # Resource library
│   │   ├── support/            # Crisis resources
│   │   └── admin/              # Admin dashboard
│   └── types/                  # TypeScript type definitions
├── public/                     # Static assets
├── package.json               # Dependencies and scripts
└── tailwind.config.js         # Tailwind CSS configuration
```

## 🔐 Security Features

- **Secure Authentication**: NextAuth.js with bcrypt password hashing
- **Data Encryption**: User data protection with secure storage
- **Rate Limiting**: API abuse prevention and cost control
- **Input Validation**: Sanitization and validation of user inputs
- **Crisis Safety**: Immediate intervention for mental health emergencies
- **Privacy Controls**: User data management and deletion options

## 🎯 Key Achievements

- **Cost-Effective AI**: Optimized OpenAI integration with budget controls
- **Crisis Prevention**: Real-time intervention without API costs
- **Scalable Architecture**: Hybrid storage supporting growth
- **User-Centric Design**: Accessibility and mental health considerations
- **Data Security**: Enterprise-level security practices
- **Performance**: Optimized loading and responsive design

## 📊 Usage & Analytics

- **Smart Rate Limiting**: 50 requests/day, $20/month budget
- **Usage Tracking**: Real-time monitoring of API costs and usage
- **User Analytics**: Mood trends, check-in patterns, engagement metrics
- **Performance Metrics**: Response times, error rates, user satisfaction

## 🤝 Contributing

This project was built as a comprehensive full-stack demonstration. For contributions or questions:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is for portfolio and educational purposes. Please respect the mental health resources and crisis information provided.

## 🆘 Crisis Resources

If you or someone you know is in crisis:
- **Call 988** - Suicide & Crisis Lifeline (US)
- **Text HOME to 741741** - Crisis Text Line
- **Call 911** - Emergency Services
- **International**: Visit [findahelpline.com](https://findahelpline.com)

## 📞 Contact

**Developer**: Ahmed Azmi  
**Project**: Full-Stack Mental Health Platform  
**Technologies**: Next.js, React, TypeScript, AWS, OpenAI  

---

*Built with ❤️ for mental health awareness and support*

