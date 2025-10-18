import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import MainLayout from './components/Layout/MainLayout';
import FAQManagement from './components/FAQ/FAQManagement';
import FlaggedConversations from './components/Conversations/FlaggedConversations';
import ConversationDetail from './components/Conversations/ConversationDetail';
import MaterialsManagement from './components/Materials/MaterialsManagement';
import QuestionAnalytics from './components/Analytics/QuestionAnalytics';
import KnowledgeGapAnalysis from './components/KnowledgeGap/KnowledgeGapAnalysis';
import QuizDetail from './components/KnowledgeGap/QuizDetail';

import './App.css';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Navigate to="/faq" replace />} />
              <Route path="faq" element={<FAQManagement />} />
              <Route path="conversations" element={<FlaggedConversations />} />
              <Route path="conversations/:id" element={<ConversationDetail />} />
              <Route path="materials" element={<MaterialsManagement />} />
              <Route path="analytics" element={<QuestionAnalytics />} />
              <Route path="knowledge-gap" element={<KnowledgeGapAnalysis />} />
              <Route path="knowledge-gap/quiz/:id" element={<QuizDetail />} />

            </Route>
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
