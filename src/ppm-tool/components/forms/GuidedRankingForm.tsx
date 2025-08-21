'use client';

import React from 'react';
import { X } from 'lucide-react';
import { Criterion } from '@/ppm-tool/shared/types';
import { useClickOutside } from '@/ppm-tool/shared/hooks/useClickOutside';
import { useTouchDevice } from '@/ppm-tool/shared/hooks/useTouchDevice';
import { motion, AnimatePresence } from 'framer-motion';

interface GuidedRankingFormProps {
  isOpen: boolean;
  onClose: () => void;
  criteria: Criterion[];
  onUpdateRankings: (rankings: { [key: string]: number }) => void;
  onRealTimeUpdate?: (rankings: { [key: string]: number }) => void;
  onSaveAnswers?: (answers: Record<string, QuestionAnswer>, personalizationData: Record<string, QuestionAnswer>) => void;
}

interface QuestionOption {
  text: string;
  value: number;
}

interface Question {
  id: string;
  text: string;
  criteriaImpact: { [key: string]: number };
  options: QuestionOption[];
  isPersonalization?: boolean;
  isMultiSelect?: boolean;
}

type QuestionAnswer = number | number[] | string;

const questions: Question[] = [
  {
    id: 'q1',
    text: 'On average, how many projects does your organization complete annually?',
    criteriaImpact: { 'Scalability': 1 },
    options: [
      { text: 'Less than 10 projects per year', value: 1 },
      { text: '10-29 projects per year', value: 2 },
      { text: '30-99 projects per year', value: 3 },
      { text: '100-499 projects per year', value: 4 },
      { text: 'Greater than 499 projects per year', value: 5 }
    ]
  },
  {
    id: 'q2',
    text: 'Approximately how many tasks or action items are there per project?',
    criteriaImpact: { 'Scalability': 1 },
    options: [
      { text: 'Less than 20 tasks per project', value: 1 },
      { text: '20-99 tasks per project', value: 2 },
      { text: '100-499 tasks per project', value: 3 },
      { text: '500-999 tasks per project', value: 4 },
      { text: 'Greater than 999 tasks per project', value: 5 }
    ]
  },
  {
    id: 'q3',
    text: 'What is the typical technical expertise level of the primary users who will interact with the PPM tool?',
    criteriaImpact: { 'Ease of Use': 1 },
    options: [
      { text: 'Advanced technical users (devs/engineers, tolerates complex interfaces)', value: 1 },
      { text: 'Mostly technical with some non-technical (IT teams, needs intuitive but feature-rich UI, <2 days training)', value: 2 },
      { text: 'Mix of technical and non-technical (requires user-friendly design, drag-and-drop, <1 day training)', value: 3 },
      { text: 'Primarily non-technical with some technical (business users, demands simple navigation, templates, <4 hours training)', value: 4 },
      { text: 'All non-technical users (must be very simple to use, <1 hour onboarding)', value: 5 }
    ]
  },
  {
    id: 'q4',
    text: 'How critical are advanced data visualization and reporting features to your needs?',
    criteriaImpact: { 'Reporting & Analytics': 1 },
    options: [
      { text: 'Basic status reports (static PDFs, simple lists, no interactivity)', value: 1 },
      { text: 'Standard reports with basic charts (bar graphs, export to Excel)', value: 2 },
      { text: 'Customizable dashboards (real-time metrics, 5-10 chart types)', value: 3 },
      { text: 'Dynamic dashboards with drill-down (filters/sorts, slice/dice data, ad-hoc queries, 10+ visuals)', value: 4 },
      { text: 'Advanced analytics with trends (Month over Month / Year over Year tracking, predictive AI, full BI integration)', value: 5 }
    ]
  },
  {
    id: 'q5',
    text: 'What level of portfolio management functionality is required for your operations?',
    criteriaImpact: { 'Portfolio Management': 1 },
    options: [
      { text: 'Solo project tracking (single-user task views, no sharing or collaboration features)', value: 1 },
      { text: 'Basic team collaboration (shared portfolio views for small groups)', value: 2 },
      { text: 'Standard portfolio features (rollup dashboards with 3-5 KPIs like cost/schedule variance, real-time updates)', value: 3 },
      { text: 'Advanced portfolio optimization (dependency tracking with visual graphs, resource allocation and capacity planning)', value: 4 },
      { text: 'Enterprise portfolio suite (AI-driven resource allocation, predictive scheduling, multi-level dependency mapping)', value: 5 }
    ]
  },
  {
    id: 'q6',
    text: 'How frequently do your project & portfolio management processes change?',
    criteriaImpact: { 'Flexibility & Customization': 0.5 },
    options: [
      { text: 'Rarely (fixed process)', value: 1 },
      { text: 'Occasionally (minor adjustments)', value: 2 },
      { text: 'Regularly (4-6 changes/year)', value: 3 },
      { text: 'Frequently (7-12 changes/year)', value: 4 },
      { text: 'Constantly (>12 changes/year)', value: 5 }
    ]
  },
  {
    id: 'q7',
    text: 'What level of workflow automation do you need?',
    criteriaImpact: { 'Flexibility & Customization': 0.5 },
    options: [
      { text: 'Manual processes (no automation, basic alerts only)', value: 1 },
      { text: 'Simple automation (single-item automation)', value: 2 },
      { text: 'Basic rule-based (triggers, conditional logic, actions)', value: 3 },
      { text: 'Advanced workflows (dynamic variables)', value: 4 },
      { text: 'Complex automation (API/scripting)', value: 5 }
    ]
  },
  {
    id: 'q8',
    text: 'How many external systems or tools (CRM, ERP, budgeting software) need to integrate with your PPM solution?',
    criteriaImpact: { 'Integrations & Extensibility': 1 },
    options: [
      { text: '0 tools (standalone use, no data exchange needed)', value: 1 },
      { text: 'One-way import/export', value: 2 },
      { text: '1 tool (simple connection, once-a-day sync)', value: 3 },
      { text: '2-4 tools (multi-way integrations, close to real-time)', value: 4 },
      { text: '>4 tools/complex ecosystem (full stack, custom webhooks, zero-latency)', value: 5 }
    ]
  },
  {
    id: 'q9',
    text: 'What are your key requirements for security features and regulatory compliance?',
    criteriaImpact: { 'Security & Compliance': 1 },
    options: [
      { text: 'Basic security (password protection, no compliance requirements)', value: 1 },
      { text: 'Standard security (SSO, basic audit trails)', value: 2 },
      { text: 'Enhanced security (role-based access, detailed logging)', value: 3 },
      { text: 'Advanced security (encryption, compliance frameworks)', value: 4 },
      { text: 'Enterprise security (SOC 2, GDPR, HIPAA compliance)', value: 5 }
    ]
  },
  {
    id: 'q10',
    text: 'Approximately how many users will actively engage with the PPM tool?',
    criteriaImpact: {},
    isPersonalization: true,
    options: [
      { text: '1-10 users', value: 1 },
      { text: '11-50 users', value: 2 },
      { text: '51-200 users', value: 3 },
      { text: '201-1000 users', value: 4 },
      { text: '1000+ users', value: 5 }
    ]
  },
  {
    id: 'q11',
    text: 'In which primary functions or departments will the PPM tool be used? (Select all that apply)',
    criteriaImpact: {},
    isPersonalization: true,
    isMultiSelect: true,
    options: [
      { text: 'Engineering', value: 1 },
      { text: 'Marketing', value: 2 },
      { text: 'Product & Design', value: 3 },
      { text: 'IT & Support', value: 4 },
      { text: 'Sales & Account Management', value: 5 },
      { text: 'Operations', value: 6 },
      { text: 'Finance', value: 7 },
      { text: 'HR', value: 8 },
      { text: 'Other', value: 9 }
    ]
  },
  {
    id: 'q12',
    text: 'Which project management methodologies are you planning to support? (Select all that apply)',
    criteriaImpact: {},
    isPersonalization: true,
    isMultiSelect: true,
    options: [
      { text: 'Agile', value: 1 },
      { text: 'Waterfall', value: 2 },
      { text: 'Continuous Improvement', value: 3 }
    ]
  }
];

// Remove the QuestionNavigation component since we won't use it anymore

export const GuidedRankingForm: React.FC<GuidedRankingFormProps> = ({
  isOpen,
  onClose,
  criteria,
  onUpdateRankings,
  onRealTimeUpdate,
  onSaveAnswers
}) => {
  const [answers, setAnswers] = React.useState<Record<string, QuestionAnswer>>({});
  const [currentStep, setCurrentStep] = React.useState(0);
  const [otherAnswers, setOtherAnswers] = React.useState<Record<string, string>>({});

  const formRef = React.useRef<HTMLDivElement>(null);
  const isTouchDevice = useTouchDevice();
  
  // Reset form state whenever the form closes
  const resetFormState = () => {
    setAnswers({});
    setOtherAnswers({});
    setCurrentStep(0);
  };

  const handleClose = () => {
    // If user has answered any questions, apply partial rankings with defaults
    if (Object.keys(answers).length > 0) {
      const rankings = calculateRankings();
      const personalizationData = extractPersonalizationData(answers);
      
      // Apply rankings to criteria but keep sliders unlocked
      onUpdateRankings(rankings);
      
      // Save answers and personalization data if available
      onSaveAnswers?.(answers, personalizationData);
    }
    
    resetFormState();
    onClose();
  };

  useClickOutside(formRef, handleClose);

  // Reset form state when form opens to ensure it always starts fresh
  React.useEffect(() => {
    if (isOpen) {
      resetFormState();
    }
  }, [isOpen]);

  const handleAnswer = (questionId: string, value: number) => {
    const question = questions.find(q => q.id === questionId);
    
    if (question?.isMultiSelect) {
      // For multi-select, toggle values in an array
      setAnswers(prev => {
        const currentValues = (prev[questionId] as number[]) || [];
        const newValues = currentValues.includes(value)
          ? currentValues.filter((v: number) => v !== value)
          : [...currentValues, value];
        return { ...prev, [questionId]: newValues };
      });
    } else {
      // For single-select, just set the value
      setAnswers(prev => ({ ...prev, [questionId]: value }));
    }
  };

  const isQuestionAnswered = (question: Question) => {
    // Q11 multi-select needs at least one selection
    if (question.id === 'q11') {
      const selectedValues = (answers[question.id] as number[]) || [];
      // If "Other" is selected, check if text is provided
      if (selectedValues.includes(9) && !otherAnswers[question.id]?.trim()) {
        return false;
      }
      return selectedValues.length > 0;
    }
    return !!answers[question.id];
  };

  const extractPersonalizationData = (answers: Record<string, QuestionAnswer>) => {
    const personalizationData: Record<string, QuestionAnswer> = {};
    questions.forEach(question => {
      if (question.isPersonalization && answers[question.id]) {
        personalizationData[question.id] = answers[question.id];
        // Include other text answers for Q11
        if (question.id === 'q11' && otherAnswers[question.id]) {
          personalizationData[`${question.id}_other`] = otherAnswers[question.id];
        }
      }
    });
    return personalizationData;
  };

  const calculateRankings = () => {
    const rankings: { [key: string]: number } = {};
    const weights: { [key: string]: number } = {};
    
    // Initialize rankings with actual criteria IDs - default to 3 (neutral)
    criteria.forEach(criterion => {
      rankings[criterion.id] = 3;
      weights[criterion.id] = 0;
    });

    // Create a mapping from criteria names to IDs for easier lookup
    const criteriaNameToId: { [key: string]: string } = {};
    criteria.forEach(criterion => {
      criteriaNameToId[criterion.name] = criterion.id;
    });

    // Calculate Scalability using multiplication rule for Q1 and Q2 with proper range mapping
    const scalabilityId = criteriaNameToId['Scalability'];
    
    // Only calculate scalability if both Q1 and Q2 are answered
    if (answers['q1'] && answers['q2'] && scalabilityId) {
      const projectsQuestionValue = answers['q1'] as number;
      const tasksQuestionValue = answers['q2'] as number;
      
      // Map question values to actual ranges (always use HIGH side of ranges)
      const projectRanges = [10, 29, 99, 499, 500]; // <10, 10-29, 30-99, 100-499, 500+
      const taskRanges = [20, 99, 499, 999, 1000];  // <20, 20-99, 100-499, 500-999, 1000+
      
      const projectsPerYear = projectRanges[projectsQuestionValue - 1] || 500;
      const tasksPerProject = taskRanges[tasksQuestionValue - 1] || 1000;
      const totalVolume = projectsPerYear * tasksPerProject;
      
      // Convert total volume to scalability score using correct bands
      let scalabilityScore = 1;
      if (totalVolume >= 200000) scalabilityScore = 5;     // ≥200,000 total = Score 5
      else if (totalVolume >= 30000) scalabilityScore = 4; // 30,000-199,999 total = Score 4  
      else if (totalVolume >= 5000) scalabilityScore = 3;  // 5,000-29,999 total = Score 3
      else if (totalVolume >= 500) scalabilityScore = 2;   // 500-4,999 total = Score 2
      // else scalabilityScore = 1;                         // <500 total = Score 1
      
      rankings[scalabilityId] = scalabilityScore;
      weights[scalabilityId] = 1;
    }
    // If Q1 or Q2 not answered, scalability remains at default value of 3

    // Calculate other criteria from individual questions
    Object.entries(answers).forEach(([questionId, answer]) => {
      const question = questions.find(q => q.id === questionId);
      if (question && !question.isPersonalization && !Array.isArray(answer) && typeof answer === 'number') {
        Object.entries(question.criteriaImpact).forEach(([criteriaName, weight]) => {
          // Map criteria names to actual IDs
          const criteriaId = criteriaNameToId[criteriaName];
          if (criteriaId && criteriaId !== scalabilityId) { // Skip scalability as it's calculated above
            // Reset to 0 for calculation on first answer for this criterion
            if (weights[criteriaId] === 0) {
              rankings[criteriaId] = 0;
            }
            rankings[criteriaId] += answer * weight;
            weights[criteriaId] += weight;
          }
        });
      }
    });

    // Calculate weighted averages for non-scalability criteria
    Object.keys(rankings).forEach(criterionId => {
      if (criterionId !== scalabilityId && weights[criterionId] > 0) {
        // Calculate the value from answered questions
        rankings[criterionId] = Math.round(rankings[criterionId] / weights[criterionId]);
        rankings[criterionId] = Math.max(1, Math.min(5, rankings[criterionId]));
      }
      // If weights[criterionId] === 0, keep the default value of 3
    });

    // Handle flexibility calculation (Q6 + Q7 / 2) - rounds UP for in-between values
    const flexibilityId = criteriaNameToId['Flexibility & Customization'];
    if (flexibilityId && answers['q6'] && answers['q7']) {
      // Only calculate if both Q6 and Q7 are answered
      const processChanges = answers['q6'] as number;
      const workflowAutomation = answers['q7'] as number;
      const flexibilityAverage = (processChanges + workflowAutomation) / 2;
      rankings[flexibilityId] = Math.ceil(flexibilityAverage);
    }
    // If Q6 or Q7 not answered, flexibility remains at default value of 3

    return rankings;
  };

  // Real-time update effect
  React.useEffect(() => {
    if (isOpen && Object.keys(answers).length > 0) {
      const rankings = calculateRankings();
      onRealTimeUpdate?.(rankings);
    }
  }, [answers, onRealTimeUpdate, isOpen]);

  const handleSubmit = () => {
    const rankings = calculateRankings();
    const personalizationData = extractPersonalizationData(answers);
    
    // Apply rankings to criteria but keep sliders unlocked
    onUpdateRankings(rankings);
    
    // Save answers and personalization data
    onSaveAnswers?.(answers, personalizationData);
    
    // Reset form state and close
    resetFormState();
    onClose();
  };

  if (!isOpen) return null;

  const currentQuestion = questions[currentStep];
  const progress = (currentStep + 1) / questions.length * 100;

  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.3,
        ease: [0.25, 0.1, 0.25, 1] as const
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95,
      transition: {
        duration: 0.2,
        ease: [0.42, 0, 1, 1] as const
      }
    }
  };

  const questionVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
          onClick={handleClose}
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div 
            className="absolute inset-2 sm:inset-4 flex items-center justify-center pointer-events-none"
          >
            <motion.div 
              ref={formRef} 
              className={`bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden pointer-events-auto flex flex-col ${
                isTouchDevice 
                  ? 'h-[96vh] max-h-[50rem] sm:h-[92vh] sm:max-h-[55rem] md:h-[96vh] md:max-h-[65rem]' 
                  : 'h-[95vh] max-h-[55rem] sm:h-[90vh] sm:max-h-[65rem] md:h-[98vh] md:max-h-[75rem] lg:h-[95vh] lg:max-h-[75rem]'
              }`}
              style={{
                WebkitOverflowScrolling: 'touch',
                overscrollBehavior: 'contain',
                scrollBehavior: 'smooth'
              }}
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
              
            >
            {/* Header */}
            <div className="px-4 md:px-6 py-3 md:py-4 border-b flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center justify-between flex-1 min-w-0">
                <div className="flex-1 min-w-0 pr-4">
                  <h3 className="text-base md:text-lg font-semibold text-gray-900">Guided Rankings</h3>
                  <p className="text-xs md:text-sm text-gray-500">Our guided method ensures your rankings follow the same research-backed framework we use to evaluate tools.</p>
                </div>
                <div className="text-xs md:text-sm text-gray-600 flex-shrink-0 text-center leading-tight">
                  <div>Question</div>
                  <div>{currentStep + 1} of {questions.length}</div>
                </div>
              </div>
              <motion.button
                onClick={handleClose}
                className="ml-4 p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Progress bar */}
            <div className="h-1 bg-gray-100 overflow-hidden">
              <motion.div
                className="h-full bg-blue-500"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ 
                  duration: 0.8, 
                  ease: "easeOut",
                  type: "spring",
                  stiffness: 100,
                  damping: 15
                }}
              />
            </div>

            {/* Question Content - Scrollable Container */}
            <div className="flex-1 overflow-y-auto" style={{ minHeight: 0 }}>
              <div className={`p-4 md:p-6 ${isTouchDevice ? 'pb-6' : ''}`}
                style={{
                  WebkitOverflowScrolling: 'touch',
                  overscrollBehavior: 'contain'
                }}
              >
                <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  variants={questionVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.15, ease: "easeInOut" }}
                  className="h-full"
                >
                  <div>
                    <h4 className="text-base md:text-lg font-medium text-gray-900 mb-4 md:mb-8">
                      {currentQuestion.text}
                    </h4>
                    <div 
                      className="space-y-2 md:space-y-3"
                    >
                        {currentQuestion.options.map((option) => {
                          const isSelected = currentQuestion.isMultiSelect
                            ? (answers[currentQuestion.id] as number[])?.includes(option.value)
                            : answers[currentQuestion.id] === option.value;

                          // Split text into main text and helper text (in parentheses)
                          const match = option.text.match(/(.*?)(\s*\((.*)\))?$/);
                          const mainText = match?.[1]?.trim() || option.text;
                          const helperText = match?.[3] || '';

                          return (
                            <button
                              key={option.value}
                              onClick={() => handleAnswer(currentQuestion.id, option.value)}
                              className={`w-full text-left px-3 md:px-4 py-3 md:py-4 rounded-lg border transition-all duration-200 text-sm md:text-base ${
                                isSelected
                                  ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm'
                                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-900'
                              } ${isTouchDevice ? 'py-4 touch-manipulation' : ''}`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex flex-col">
                                  <span className="font-medium text-sm md:text-base">{mainText}</span>
                                  {helperText && (
                                    <span className="text-xs md:text-sm text-gray-500 mt-1">{helperText}</span>
                                  )}
                                </div>
                                <AnimatePresence>
                                  {isSelected && (
                                    <motion.div
                                      className="w-4 h-4 md:w-5 md:h-5 bg-blue-500 rounded-full flex items-center justify-center"
                                      initial={{ scale: 0, opacity: 0 }}
                                      animate={{ scale: 1, opacity: 1 }}
                                      exit={{ scale: 0, opacity: 0 }}
                                      transition={{ 
                                        duration: 0.3,
                                        type: "spring",
                                        stiffness: 200
                                      }}
                                    >
                                      <motion.div
                                        className="w-1.5 h-1.5 md:w-2 md:h-2 bg-white rounded-full"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.1 }}
                                      />
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            </button>
                          );
                        })}
                        
                        {/* Other text input for Q11 */}
                        {currentQuestion.id === 'q11' && (answers[currentQuestion.id] as number[])?.includes(9) && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mt-3"
                          >
                            <input
                              type="text"
                              placeholder="Please specify your department/function..."
                              value={otherAnswers[currentQuestion.id] || ''}
                              onChange={(e) => setOtherAnswers(prev => ({ ...prev, [currentQuestion.id]: e.target.value }))}
                              className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base"
                              autoFocus
                            />
                          </motion.div>
                        )}
                      </div>
                  </div>
                </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Footer - Always visible */}
            <div className={`px-4 md:px-6 py-3 md:py-4 border-t bg-gray-50 flex justify-between flex-shrink-0 sticky bottom-0 ${isTouchDevice ? 'py-4' : ''}`}>
              <button
                onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                disabled={currentStep === 0}
                className={`px-3 md:px-4 py-2 text-xs md:text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all ${isTouchDevice ? 'py-3 touch-manipulation' : ''}`}
              >
                Previous
              </button>
              <button
                onClick={() => {
                  if (currentStep < questions.length - 1) {
                    setCurrentStep(prev => prev + 1);
                  } else {
                    handleSubmit();
                  }
                }}
                disabled={!isQuestionAnswered(currentQuestion)}
                className={`px-4 md:px-6 py-2 text-xs md:text-sm font-medium text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ${
                  isQuestionAnswered(currentQuestion) 
                    ? 'bg-blue-600 hover:bg-blue-500' 
                    : 'bg-gray-400 hover:bg-gray-400'
                } ${isTouchDevice ? 'py-3 touch-manipulation' : ''}`}
              >
                {currentStep < questions.length - 1 ? 'Next' : 'Generate Your Rankings'}
              </button>
            </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};