/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { ChatLayout } from './components/ChatLayout';

export default function App() {
  const [appState, setAppState] = useState<'landing' | 'chat'>('landing');

  return (
    <>
      {appState === 'landing' ? (
         <LandingPage onLaunch={() => setAppState('chat')} />
      ) : (
         <ChatLayout onBack={() => setAppState('landing')} />
      )}
    </>
  );
}
