'use client';

import { useState, useEffect } from 'react';

interface LearningItem {
  id: string;
  text: string;
  completed: boolean;
}

interface LearningStep {
  id: string;
  title: string;
  items: LearningItem[];
}

interface LearningModule {
  id: string;
  title: string;
  description: string;
  steps: LearningStep[];
}

const learningData: LearningModule[] = [
  {
    id: 'python',
    title: '1. Python — only what AI requires',
    description: 'Essential Python skills for AI development',
    steps: [
      {
        id: 'python-basics',
        title: 'Python Fundamentals',
        items: [
          { id: 'python-1', text: 'Write functions/classes comfortably', completed: false },
          { id: 'python-2', text: 'Use lists, dictionaries, sets, tuples', completed: false },
          { id: 'python-3', text: 'Understand comprehensions', completed: false },
          { id: 'python-4', text: 'Work with modules/packages/virtual environments', completed: false },
          { id: 'python-5', text: 'Read/write files', completed: false },
          { id: 'python-6', text: 'Handle exceptions', completed: false },
          { id: 'python-7', text: 'Understand iterators/generators at a basic level', completed: false },
          { id: 'python-8', text: 'Use pip', completed: false },
          { id: 'python-9', text: 'Read basic Python code without getting lost', completed: false }
        ]
      },
      {
        id: 'numpy',
        title: 'NumPy Arrays',
        items: [
          { id: 'numpy-1', text: 'shape', completed: false },
          { id: 'numpy-2', text: 'dimensions', completed: false },
          { id: 'numpy-3', text: 'indexing/slicing', completed: false },
          { id: 'numpy-4', text: 'broadcasting', completed: false },
          { id: 'numpy-5', text: 'matrix multiplication', completed: false }
        ]
      }
    ]
  },
  {
    id: 'math',
    title: '2. Math for ML',
    description: 'Essential mathematics for machine learning',
    steps: [
      {
        id: 'linear-algebra',
        title: 'Linear Algebra',
        items: [
          { id: 'la-1', text: 'vectors', completed: false },
          { id: 'la-2', text: 'matrices', completed: false },
          { id: 'la-3', text: 'tensors', completed: false },
          { id: 'la-4', text: 'dot product', completed: false },
          { id: 'la-5', text: 'matrix multiplication', completed: false },
          { id: 'la-6', text: 'transpose', completed: false },
          { id: 'la-7', text: 'dimensions/shapes', completed: false },
          { id: 'la-8', text: 'linear transformations', completed: false }
        ]
      },
      {
        id: 'calculus',
        title: 'Calculus',
        items: [
          { id: 'calc-1', text: 'derivative', completed: false },
          { id: 'calc-2', text: 'partial derivative', completed: false },
          { id: 'calc-3', text: 'gradient', completed: false },
          { id: 'calc-4', text: 'chain rule', completed: false }
        ]
      },
      {
        id: 'probability',
        title: 'Probability & Statistics',
        items: [
          { id: 'prob-1', text: 'probability distributions', completed: false },
          { id: 'prob-2', text: 'mean/variance', completed: false },
          { id: 'prob-3', text: 'conditional probability', completed: false },
          { id: 'prob-4', text: 'expectation', completed: false },
          { id: 'prob-5', text: 'likelihood', completed: false },
          { id: 'prob-6', text: 'basic Bayes theorem', completed: false }
        ]
      }
    ]
  },
  {
    id: 'ml-fundamentals',
    title: '3. Machine Learning Fundamentals',
    description: 'Core ML concepts and implementation',
    steps: [
      {
        id: 'ml-concepts',
        title: 'ML Concepts',
        items: [
          { id: 'ml-1', text: 'What a dataset is', completed: false },
          { id: 'ml-2', text: 'Features vs labels', completed: false },
          { id: 'ml-3', text: 'Training/validation/test sets', completed: false },
          { id: 'ml-4', text: 'Regression vs classification', completed: false },
          { id: 'ml-5', text: 'Overfitting/underfitting', completed: false },
          { id: 'ml-6', text: 'Loss functions', completed: false },
          { id: 'ml-7', text: 'Gradient descent', completed: false },
          { id: 'ml-8', text: 'Learning rate', completed: false },
          { id: 'ml-9', text: 'Parameters vs hyperparameters', completed: false },
          { id: 'ml-10', text: 'Batch/epoch', completed: false },
          { id: 'ml-11', text: 'Accuracy, precision, recall', completed: false },
          { id: 'ml-12', text: 'Normalization', completed: false },
          { id: 'ml-13', text: 'Regularization', completed: false }
        ]
      },
      {
        id: 'ml-implementation',
        title: 'Implementation',
        items: [
          { id: 'mli-1', text: 'Implement linear regression with NumPy', completed: false },
          { id: 'mli-2', text: 'Implement a simple classifier with NumPy', completed: false }
        ]
      }
    ]
  },
  {
    id: 'neural-networks',
    title: '4. Neural Networks',
    description: 'Deep learning foundations with PyTorch',
    steps: [
      {
        id: 'nn-concepts',
        title: 'Neural Network Concepts',
        items: [
          { id: 'nn-1', text: 'Perceptron', completed: false },
          { id: 'nn-2', text: 'Layers', completed: false },
          { id: 'nn-3', text: 'Weights/biases', completed: false },
          { id: 'nn-4', text: 'Activation functions', completed: false },
          { id: 'nn-5', text: 'Forward propagation', completed: false },
          { id: 'nn-6', text: 'Backpropagation', completed: false },
          { id: 'nn-7', text: 'Gradient descent', completed: false },
          { id: 'nn-8', text: 'ReLU', completed: false },
          { id: 'nn-9', text: 'Softmax', completed: false },
          { id: 'nn-10', text: 'Cross-entropy', completed: false },
          { id: 'nn-11', text: 'Batch training', completed: false }
        ]
      },
      {
        id: 'pytorch-build',
        title: 'PyTorch Projects',
        items: [
          { id: 'pt-1', text: 'Build a simple classifier', completed: false },
          { id: 'pt-2', text: 'Build an image classifier using a small dataset', completed: false }
        ]
      }
    ]
  },
  {
    id: 'cnn',
    title: '5. CNNs + Computer Vision',
    description: 'Convolutional neural networks for vision tasks',
    steps: [
      {
        id: 'cnn-concepts',
        title: 'CNN Concepts',
        items: [
          { id: 'cnn-1', text: 'Images as tensors', completed: false },
          { id: 'cnn-2', text: 'Convolution', completed: false },
          { id: 'cnn-3', text: 'Kernels/filters', completed: false },
          { id: 'cnn-4', text: 'Stride', completed: false },
          { id: 'cnn-5', text: 'Padding', completed: false },
          { id: 'cnn-6', text: 'Pooling', completed: false },
          { id: 'cnn-7', text: 'Feature maps', completed: false },
          { id: 'cnn-8', text: 'CNN architecture', completed: false },
          { id: 'cnn-9', text: 'Image classification', completed: false },
          { id: 'cnn-10', text: 'Object detection — conceptually', completed: false },
          { id: 'cnn-11', text: 'Segmentation — conceptually', completed: false }
        ]
      },
      {
        id: 'cnn-build',
        title: 'CNN Implementation',
        items: [
          { id: 'cnnb-1', text: 'Build a small image classifier', completed: false }
        ]
      }
    ]
  },
  {
    id: 'transformers',
    title: '6. Transformers',
    description: 'Attention mechanisms and transformer architecture',
    steps: [
      {
        id: 'transformer-concepts',
        title: 'Transformer Concepts',
        items: [
          { id: 'trans-1', text: 'Tokens', completed: false },
          { id: 'trans-2', text: 'Tokenization', completed: false },
          { id: 'trans-3', text: 'Embeddings', completed: false },
          { id: 'trans-4', text: 'Positional encoding', completed: false },
          { id: 'trans-5', text: 'Attention', completed: false },
          { id: 'trans-6', text: 'Query / Key / Value', completed: false },
          { id: 'trans-7', text: 'Self-attention', completed: false },
          { id: 'trans-8', text: 'Multi-head attention', completed: false },
          { id: 'trans-9', text: 'Transformer blocks', completed: false },
          { id: 'trans-10', text: 'Feed-forward layers', completed: false },
          { id: 'trans-11', text: 'Layer normalization', completed: false },
          { id: 'trans-12', text: 'Residual connections', completed: false },
          { id: 'trans-13', text: 'Causal attention', completed: false },
          { id: 'trans-14', text: 'Encoder vs decoder', completed: false },
          { id: 'trans-15', text: 'Autoregressive generation', completed: false }
        ]
      },
      {
        id: 'transformer-build',
        title: 'Transformer Implementation',
        items: [
          { id: 'transb-1', text: 'Implement a tiny transformer in PyTorch', completed: false }
        ]
      }
    ]
  },
  {
    id: 'llms',
    title: '7. LLMs',
    description: 'Large language models and modern AI ecosystem',
    steps: [
      {
        id: 'llm-concepts',
        title: 'LLM Concepts',
        items: [
          { id: 'llm-1', text: 'Pretraining', completed: false },
          { id: 'llm-2', text: 'Next-token prediction', completed: false },
          { id: 'llm-3', text: 'Context windows', completed: false },
          { id: 'llm-4', text: 'Instruction tuning', completed: false },
          { id: 'llm-5', text: 'RLHF/DPO — conceptually', completed: false },
          { id: 'llm-6', text: 'Fine-tuning', completed: false },
          { id: 'llm-7', text: 'LoRA', completed: false },
          { id: 'llm-8', text: 'Quantization', completed: false },
          { id: 'llm-9', text: 'Inference', completed: false },
          { id: 'llm-10', text: 'KV cache — conceptually', completed: false },
          { id: 'llm-11', text: 'Embeddings', completed: false },
          { id: 'llm-12', text: 'RAG', completed: false },
          { id: 'llm-13', text: 'Tool calling', completed: false },
          { id: 'llm-14', text: 'Agents', completed: false }
        ]
      },
      {
        id: 'llm-build',
        title: 'LLM Projects',
        items: [
          { id: 'llmb-1', text: 'Build local LLM application', completed: false },
          { id: 'llmb-2', text: 'Build RAG application', completed: false },
          { id: 'llmb-3', text: 'Build tool-using agent', completed: false }
        ]
      }
    ]
  },
  {
    id: 'generative-ai',
    title: '8. Generative AI',
    description: 'Diffusion models and generative systems',
    steps: [
      {
        id: 'diffusion',
        title: 'Diffusion Models',
        items: [
          { id: 'diff-1', text: 'Noise', completed: false },
          { id: 'diff-2', text: 'Forward diffusion', completed: false },
          { id: 'diff-3', text: 'Reverse diffusion', completed: false },
          { id: 'diff-4', text: 'Denoising', completed: false },
          { id: 'diff-5', text: 'U-Net', completed: false },
          { id: 'diff-6', text: 'Latent space', completed: false },
          { id: 'diff-7', text: 'Text conditioning', completed: false },
          { id: 'diff-8', text: 'Cross-attention', completed: false },
          { id: 'diff-9', text: 'Stable Diffusion architecture', completed: false }
        ]
      },
      {
        id: 'video',
        title: 'Video Generation',
        items: [
          { id: 'vid-1', text: 'Frame generation', completed: false },
          { id: 'vid-2', text: 'Temporal consistency', completed: false },
          { id: 'vid-3', text: 'Video latent representations', completed: false },
          { id: 'vid-4', text: 'Diffusion for video', completed: false },
          { id: 'vid-5', text: 'Image-to-video', completed: false },
          { id: 'vid-6', text: 'Text-to-video', completed: false }
        ]
      }
    ]
  },
  {
    id: 'fine-tuning',
    title: '9. Fine-tuning + Open Models',
    description: 'Customizing models for specific tasks',
    steps: [
      {
        id: 'fine-tuning-concepts',
        title: 'Fine-tuning Process',
        items: [
          { id: 'ft-1', text: 'Dataset preparation', completed: false },
          { id: 'ft-2', text: 'Data quality', completed: false },
          { id: 'ft-3', text: 'Training configuration', completed: false },
          { id: 'ft-4', text: 'LoRA', completed: false },
          { id: 'ft-5', text: 'QLoRA', completed: false },
          { id: 'ft-6', text: 'Evaluation', completed: false },
          { id: 'ft-7', text: 'Quantization', completed: false },
          { id: 'ft-8', text: 'Model serving', completed: false },
          { id: 'ft-9', text: 'GPU memory constraints', completed: false }
        ]
      },
      {
        id: 'fine-tuning-build',
        title: 'Fine-tuning Project',
        items: [
          { id: 'ftb-1', text: 'Build a specialized model for one real problem', completed: false }
        ]
      }
    ]
  },
  {
    id: 'ai-engineering',
    title: '10. AI Engineering → Product',
    description: 'Production AI systems and deployment',
    steps: [
      {
        id: 'engineering-concepts',
        title: 'Engineering Considerations',
        items: [
          { id: 'eng-1', text: 'Inference costs', completed: false },
          { id: 'eng-2', text: 'GPU vs CPU', completed: false },
          { id: 'eng-3', text: 'Latency', completed: false },
          { id: 'eng-4', text: 'Model selection', completed: false },
          { id: 'eng-5', text: 'Caching', completed: false },
          { id: 'eng-6', text: 'Batching', completed: false },
          { id: 'eng-7', text: 'Privacy', completed: false },
          { id: 'eng-8', text: 'Local inference', completed: false },
          { id: 'eng-9', text: 'APIs', completed: false },
          { id: 'eng-10', text: 'Deployment', completed: false },
          { id: 'eng-11', text: 'Evaluation', completed: false },
          { id: 'eng-12', text: 'Monitoring', completed: false }
        ]
      },
      {
        id: 'product-build',
        title: 'Product Development',
        items: [
          { id: 'prod-1', text: 'Combine AI skills with existing software engineering', completed: false },
          { id: 'prod-2', text: 'Build actual products', completed: false }
        ]
      }
    ]
  }
];

const STORAGE_KEY = 'skill-tree-progress';

export default function SkillTree() {
  const [modules, setModules] = useState<LearningModule[]>(learningData);
  const [expandedModule, setExpandedModule] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setModules(prev => prev.map(module => {
          const savedModule = parsed.find((m: any) => m.id === module.id);
          if (savedModule) {
            return {
              ...module,
              steps: module.steps.map(step => {
                const savedStep = savedModule.steps.find((s: any) => s.id === step.id);
                if (savedStep) {
                  return {
                    ...step,
                    items: step.items.map(item => {
                      const savedItem = savedStep.items.find((i: any) => i.id === item.id);
                      return savedItem ? { ...item, completed: savedItem.completed } : item;
                    })
                  };
                }
                return step;
              })
            };
          }
          return module;
        }));
      } catch (e) {
        console.error('Failed to load saved progress:', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(modules));
  }, [modules]);

  const toggleItem = (moduleId: string, stepId: string, itemId: string) => {
    setModules(prev => prev.map(module => {
      if (module.id === moduleId) {
        return {
          ...module,
          steps: module.steps.map(step => 
            step.id === stepId 
              ? {
                  ...step,
                  items: step.items.map(item => 
                    item.id === itemId ? { ...item, completed: !item.completed } : item
                  )
                }
              : step
          )
        };
      }
      return module;
    }));
  };

  const toggleModule = (moduleId: string) => {
    setExpandedModule(expandedModule === moduleId ? null : moduleId);
  };

  const calculateModuleProgress = (module: LearningModule) => {
    let totalItems = 0;
    let completedItems = 0;
    module.steps.forEach(step => {
      step.items.forEach(item => {
        totalItems++;
        if (item.completed) completedItems++;
      });
    });
    return totalItems > 0 ? (completedItems / totalItems) * 100 : 0;
  };

  const calculateTotalProgress = () => {
    let totalItems = 0;
    let completedItems = 0;
    modules.forEach(module => {
      module.steps.forEach(step => {
        step.items.forEach(item => {
          totalItems++;
          if (item.completed) completedItems++;
        });
      });
    });
    return totalItems > 0 ? (completedItems / totalItems) * 100 : 0;
  };

  const totalProgress = calculateTotalProgress();

  const getModuleColor = (index: number) => {
    const colors = [
      'from-emerald-400 to-teal-500',
      'from-orange-400 to-amber-500',
      'from-rose-400 to-pink-500',
      'from-cyan-400 to-blue-500',
      'from-violet-400 to-purple-500',
      'from-fuchsia-400 to-pink-500',
      'from-lime-400 to-green-500',
      'from-sky-400 to-indigo-500',
      'from-red-400 to-orange-500',
      'from-yellow-400 to-amber-500'
    ];
    return colors[index % colors.length];
  };

  return (
    <div className=" bg-gradient-to-br from-slate-900 via-slate-800 overflow-y-scroll to-slate-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header with Total Progress */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl md:text-5xl font-bold text-white mb-2">
            AI Learning Journey
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mb-6">Track your progress from Python to AI Engineering</p>
          
          {/* Total Progress Circle */}
          <div className="relative inline-flex items-center justify-center">
            <svg className="w-32 h-32 md:w-40 md:h-40 transform -rotate-90">
              <circle
                cx="50%"
                cy="50%"
                r="45%"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-slate-700"
              />
              <circle
                cx="50%"
                cy="50%"
                r="45%"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={`${totalProgress * 2.83} 283`}
                className="text-gradient-to-r from-emerald-400 to-teal-500"
                style={{
                  stroke: `url(#gradient)`,
                  transition: 'stroke-dasharray 0.5s ease'
                }}
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#34d399" />
                  <stop offset="100%" stopColor="#14b8a6" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl md:text-4xl font-bold text-white">
                {Math.round(totalProgress)}%
              </span>
            </div>
          </div>
        </div>

        {/* Modules Grid */}
        <div className="space-y-4">
          {modules.map((module, moduleIndex) => {
            const progress = calculateModuleProgress(module);
            const isExpanded = expandedModule === module.id;
            const colorClass = getModuleColor(moduleIndex);

            return (
              <div
                key={module.id}
                className="bg-slate-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300"
              >
                {/* Module Header */}
                <button
                  onClick={() => toggleModule(module.id)}
                  className="w-full p-4 md:p-6 text-left"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <h2 className="text-xl md:text-2xl font-bold text-white mb-1">
                        {module.title}
                      </h2>
                      <p className="text-slate-400 text-sm md:text-base">
                        {module.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      {/* Progress Bar */}
                      <div className="hidden sm:block w-24">
                        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${colorClass} transition-all duration-500`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <p className="text-xs text-slate-400 mt-1 text-center">
                          {Math.round(progress)}%
                        </p>
                      </div>
                      
                      {/* Chevron */}
                      <div className={`transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                        <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  {/* Mobile Progress */}
                  <div className="sm:hidden mt-3">
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${colorClass} transition-all duration-500`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      {Math.round(progress)}% complete
                    </p>
                  </div>
                </button>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="px-4 pb-4 md:px-6 md:pb-6 border-t border-slate-700/50 pt-4">
                    <div className="space-y-3">
                      {module.steps.map((step) => (
                        <div
                          key={step.id}
                          className={`p-4 rounded-xl border transition-all duration-300 ${
                            step.items.every(i => i.completed)
                              ? 'bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-emerald-500/30'
                              : 'bg-slate-700/30 border-slate-600/30 hover:border-slate-500/50'
                          }`}
                        >
                          <div className="flex-1">
                            <h3 className={`font-semibold mb-3 ${step.items.every(i => i.completed) ? 'text-emerald-400' : 'text-white'}`}>
                              {step.title}
                            </h3>
                            <ul className="space-y-2">
                              {step.items.map((item) => (
                                <li
                                  key={item.id}
                                  className="text-sm text-slate-400 flex items-start gap-3"
                                >
                                  <button
                                    onClick={() => toggleItem(module.id, step.id, item.id)}
                                    className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-300 flex-shrink-0 ${
                                      item.completed
                                        ? 'bg-gradient-to-r from-emerald-400 to-teal-500 border-emerald-400'
                                        : 'border-slate-500 hover:border-emerald-400'
                                    }`}
                                  >
                                    {item.completed && (
                                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                      </svg>
                                    )}
                                  </button>
                                  <span className={item.completed ? 'text-emerald-400 line-through' : ''}>{item.text}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-slate-500 text-sm">
          <p>Progress is saved automatically in your browser</p>
        </div>
      </div>
    </div>
  );
}
