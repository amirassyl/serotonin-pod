import { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { CloudIntro } from '@/components/CloudIntro';
import { FeelingWheel } from '@/components/FeelingWheel';
import { EmotionDetail } from '@/components/EmotionDetail';
import { Studio } from '@/components/Studio';
import { BreathingStudio } from '@/components/BreathingStudio';
import { CoreEmotionData, Emotion, getCoreEmotionByName } from '@/data/emotions';

type View =
  | { screen: 'cloud' }
  | { screen: 'wheel' }
  | { screen: 'detail'; coreEmotion: CoreEmotionData }
  | { screen: 'studio'; emotion: Emotion };

const Index = () => {
  const [view, setView] = useState<View>({ screen: 'cloud' });
  const [collectedEmotions, setCollectedEmotions] = useState<string[]>([]);

  const handleSelectCore = useCallback((core: CoreEmotionData) => {
    setView({ screen: 'detail', coreEmotion: core });
  }, []);

  const handleSelectEmotion = useCallback((emotion: Emotion) => {
    setView({ screen: 'studio', emotion });
  }, []);

  const handleSkipToWheel = useCallback(() => {
    setView({ screen: 'wheel' });
  }, []);

  const handleBackToWheel = useCallback(() => {
    setView({ screen: 'wheel' });
  }, []);

  const handleBackToDetail = useCallback((coreEmotion: CoreEmotionData) => {
    setView({ screen: 'detail', coreEmotion });
  }, []);

  const handleComplete = useCallback((emotionId: string) => {
    setCollectedEmotions((prev) => {
      if (prev.includes(emotionId)) return prev;
      return [...prev, emotionId];
    });
  }, []);

  const handleStudioBack = useCallback(() => {
    if (view.screen === 'studio') {
      const core = getCoreEmotionByName(view.emotion.coreEmotion);
      if (core) {
        handleBackToDetail(core);
      } else {
        handleBackToWheel();
      }
    }
  }, [view, handleBackToDetail, handleBackToWheel]);

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        {view.screen === 'cloud' && (
          <CloudIntro
            key="cloud"
            onSelectEmotion={handleSelectEmotion}
            onSkip={handleSkipToWheel}
          />
        )}
        {view.screen === 'wheel' && (
          <FeelingWheel
            key="wheel"
            collectedEmotions={collectedEmotions}
            onSelectCore={handleSelectCore}
          />
        )}
        {view.screen === 'detail' && (
          <EmotionDetail
            key={`detail-${view.coreEmotion.name}`}
            coreEmotion={view.coreEmotion}
            collectedEmotions={collectedEmotions}
            onSelectEmotion={handleSelectEmotion}
            onBack={handleBackToWheel}
          />
        )}
        {view.screen === 'studio' && view.emotion.coreEmotion === 'Fear' && (
          <BreathingStudio
            key={`breathing-${view.emotion.id}`}
            emotion={view.emotion}
            onBack={handleStudioBack}
            onComplete={handleComplete}
          />
        )}
        {view.screen === 'studio' && view.emotion.coreEmotion !== 'Fear' && (
          <Studio
            key={`studio-${view.emotion.id}`}
            emotion={view.emotion}
            onBack={handleStudioBack}
            onComplete={handleComplete}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
