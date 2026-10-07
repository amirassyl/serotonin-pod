import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';

interface ScientificContextProps {
  benefit: string;
}

const ScientificContext = ({ benefit }: ScientificContextProps) => {
  return (
    <motion.div
      className="bg-card/95 backdrop-blur-sm p-5 rounded-2xl shadow-elevated max-w-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200, delay: 0.4 }}
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-primary/10">
          <Brain className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
            Scientific Insight
          </h4>
          <p className="text-sm text-foreground leading-relaxed">
            {benefit}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default ScientificContext;
