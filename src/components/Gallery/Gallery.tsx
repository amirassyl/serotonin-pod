import { motion } from 'framer-motion';
import { poses, Pose } from '@/data/poses';
import PoseCard from './PoseCard';
import { Progress } from '@/components/ui/progress';
import { ChevronRight } from 'lucide-react';

interface GalleryProps {
  completedPoses: string[];
  currentPoseIndex: number;
  onSelectPose: (pose: Pose) => void;
}

const Gallery = ({ completedPoses, currentPoseIndex, onSelectPose }: GalleryProps) => {
  const progress = (completedPoses.length / poses.length) * 100;
  const nextPose = poses[currentPoseIndex];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header 
        className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm shadow-sm"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h1 className="text-2xl font-bold text-foreground tracking-tight">
                Stance Studio
              </h1>
              <p className="text-sm text-muted-foreground">
                Your wellness journey
              </p>
            </div>

            {/* Progress tracker */}
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Progress</p>
                <p className="text-xl font-semibold text-foreground">
                  {completedPoses.length}/{poses.length}
                </p>
              </div>
              <div className="w-24">
                <Progress value={progress} className="h-2" />
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main content */}
      <main className="container mx-auto px-6 pt-28 pb-32">
        {/* Hero section */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200, delay: 0.1 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Discover Your{' '}
            <span className="text-primary">Power Poses</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Follow the guided journey through scientifically-backed power poses, 
            designed to shift your biochemistry and boost confidence.
          </p>
        </motion.div>

        {/* Pose grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.08,
              },
            },
          }}
        >
          {poses.map((pose, index) => (
            <motion.div
              key={pose.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { 
                  opacity: 1, 
                  y: 0,
                  transition: { type: 'spring', damping: 25, stiffness: 200 }
                },
              }}
            >
              <PoseCard
                pose={pose}
                isNext={index === currentPoseIndex}
                isCompleted={completedPoses.includes(pose.id)}
                onClick={() => onSelectPose(pose)}
                layoutId={`pose-card-${pose.id}`}
              />
            </motion.div>
          ))}
        </motion.div>
      </main>

      {/* Guide CTA */}
      {nextPose && (
        <motion.div
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200, delay: 0.6 }}
        >
          <button
            onClick={() => onSelectPose(nextPose)}
            className="bg-card px-6 py-4 rounded-full flex items-center gap-3 shadow-elevated-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 group"
          >
            <span className="text-muted-foreground text-sm">Begin with</span>
            <span className="text-lg font-semibold text-primary">
              {nextPose.title}
            </span>
            <ChevronRight className="w-5 h-5 text-primary group-hover:translate-x-0.5 transition-transform" />
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default Gallery;
