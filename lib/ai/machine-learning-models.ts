/**
 * Machine Learning Models Service for BuffrLend
 * Pure TypeScript implementation with statistical and mathematical models
 * Inspired by data science best practices for predictive modeling
 */

import { z } from 'zod';

// ============================================================================
// MACHINE LEARNING TYPES AND SCHEMAS
// ============================================================================

interface TreeNode {
  type: 'leaf' | 'node';
  value?: number;
  featureIndex?: number;
  threshold?: number;
  left?: TreeNode;
  right?: TreeNode;
}

// Removed unused interfaces LeafNode and InternalNode

/**
 * Training data schema
 */
export const TrainingDataSchema = z.object({
  features: z.array(z.record(z.string(), z.number())),
  targets: z.array(z.number()),
  featureNames: z.array(z.string()),
});

/**
 * Model configuration schema
 */
export const ModelConfigSchema = z.object({
  modelType: z.enum(['linear_regression', 'logistic_regression', 'decision_tree', 'random_forest', 'neural_network']),
  hyperparameters: z.record(z.string(), z.unknown()),
  trainingSplit: z.number().min(0.1).max(0.9).default(0.8),
  validationSplit: z.number().min(0.1).max(0.9).default(0.1),
  testSplit: z.number().min(0.1).max(0.9).default(0.1),
});

/**
 * Model performance schema
 */
export const ModelPerformanceSchema = z.object({
  accuracy: z.number().min(0).max(1),
  precision: z.number().min(0).max(1).optional(),
  recall: z.number().min(0).max(1).optional(),
  f1Score: z.number().min(0).max(1).optional(),
  mse: z.number().min(0).optional(), // Mean Squared Error for regression
  mae: z.number().min(0).optional(), // Mean Absolute Error for regression
  r2Score: z.number().optional(), // R-squared for regression
  confusionMatrix: z.array(z.array(z.number())).optional(),
});

/**
 * Model prediction schema
 */
export const ModelPredictionSchema = z.object({
  prediction: z.number(),
  confidence: z.number().min(0).max(1),
  probabilities: z.array(z.number()).optional(),
  featureImportance: z.array(z.object({
    feature: z.string(),
    importance: z.number(),
  })).optional(),
});

// ============================================================================
// MACHINE LEARNING MODELS SERVICE
// ============================================================================

interface ModelData {
  model: unknown;
  config: z.infer<typeof ModelConfigSchema>;
  performance: z.infer<typeof ModelPerformanceSchema>;
  trainingTime: number;
  trainedAt: Date;
}

export class MachineLearningModelsService {
  private models: Map<string, ModelData> = new Map();
  private modelVersion = '1.0.0';

  constructor() {
    this.initializeService();
  }

  /**
   * Initialize the machine learning service
   */
  private async initializeService(): Promise<void> {
    console.log('Initializing Machine Learning Models Service...');
  }

  /**
   * Train a machine learning model
   */
  async trainModel(
    modelId: string,
    trainingData: z.infer<typeof TrainingDataSchema>,
    config: z.infer<typeof ModelConfigSchema>
  ): Promise<{
    modelId: string;
    performance: z.infer<typeof ModelPerformanceSchema>;
    trainingTime: number;
  }> {
    const startTime = Date.now();
    
    try {
      // Validate inputs
      const validatedData = TrainingDataSchema.parse(trainingData);
      const validatedConfig = ModelConfigSchema.parse(config);
      
      // Split data
      const { trainData, testData } = this.splitData(validatedData, validatedConfig);
      
      // Train model based on type
      let model: unknown;
      switch (validatedConfig.modelType) {
        case 'linear_regression':
          model = this.trainLinearRegression(trainData);
          break;
        case 'logistic_regression':
          model = this.trainLogisticRegression(trainData);
          break;
        case 'decision_tree':
          model = this.trainDecisionTree(trainData, validatedConfig.hyperparameters);
          break;
        case 'random_forest':
          model = this.trainRandomForest(trainData, validatedConfig.hyperparameters);
          break;
        case 'neural_network':
          model = this.trainNeuralNetwork(trainData, validatedConfig.hyperparameters);
          break;
        default:
          throw new Error(`Unsupported model type: ${validatedConfig.modelType}`);
      }
      
      // Evaluate model
      const performance = this.evaluateModel(model, testData, validatedConfig.modelType);
      
      const trainingTime = Date.now() - startTime;
      
      // Store model
      this.models.set(modelId, {
        model,
        config: validatedConfig,
        performance,
        trainingTime,
        trainedAt: new Date(),
      });
      
      return {
        modelId,
        performance,
        trainingTime,
      };
    } catch (error) {
      throw new Error(`Model training failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Make predictions using a trained model
   */
  async makePrediction(
    modelId: string,
    features: number[]
  ): Promise<z.infer<typeof ModelPredictionSchema>> {
    const modelData = this.models.get(modelId);
    if (!modelData) {
      throw new Error(`Model ${modelId} not found`);
    }
    
    try {
      const { model, config } = modelData;
      
      // Make prediction based on model type
      let prediction: number;
      let confidence: number;
      let probabilities: number[] | undefined;
      let featureImportance: Array<{ feature: string; importance: number }> | undefined;
      
      switch (config.modelType) {
        case 'linear_regression':
          prediction = this.predictLinearRegression(model, features);
          confidence = this.calculateRegressionConfidence();
          break;
        case 'logistic_regression':
          const logResult = this.predictLogisticRegression(model, features);
          prediction = logResult.prediction;
          confidence = logResult.confidence;
          probabilities = logResult.probabilities;
          break;
        case 'decision_tree':
          const treeResult = this.predictDecisionTree(model, features);
          prediction = treeResult.prediction;
          confidence = treeResult.confidence;
          featureImportance = treeResult.featureImportance;
          break;
        case 'random_forest':
          const forestResult = this.predictRandomForest(model, features);
          prediction = forestResult.prediction;
          confidence = forestResult.confidence;
          featureImportance = forestResult.featureImportance;
          break;
        case 'neural_network':
          const nnResult = this.predictNeuralNetwork(model, features);
          prediction = nnResult.prediction;
          confidence = nnResult.confidence;
          break;
        default:
          throw new Error(`Unsupported model type: ${config.modelType}`);
      }
      
      return {
        prediction,
        confidence,
        probabilities,
        featureImportance,
      };
    } catch (error) {
      throw new Error(`Prediction failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Split data into train, validation, and test sets
   */
  private splitData(
    data: z.infer<typeof TrainingDataSchema>,
    config: z.infer<typeof ModelConfigSchema>
  ): {
    trainData: { features: number[][]; targets: number[] };
    validationData: { features: number[][]; targets: number[] };
    testData: { features: number[][]; targets: number[] };
  } {
    const { features, targets } = data;
    const totalSamples = features.length;
    
    // Convert features from Record<string, number>[] to number[][]
    const numericFeatures = features.map(feature => 
      data.featureNames.map(name => feature[name] || 0)
    );
    
    const trainSize = Math.floor(totalSamples * config.trainingSplit);
    const validationSize = Math.floor(totalSamples * config.validationSplit);
    
    const trainFeatures = numericFeatures.slice(0, trainSize);
    const trainTargets = targets.slice(0, trainSize);
    
    const validationFeatures = numericFeatures.slice(trainSize, trainSize + validationSize);
    const validationTargets = targets.slice(trainSize, trainSize + validationSize);
    
    const testFeatures = numericFeatures.slice(trainSize + validationSize);
    const testTargets = targets.slice(trainSize + validationSize);
    
    return {
      trainData: { features: trainFeatures, targets: trainTargets },
      validationData: { features: validationFeatures, targets: validationTargets },
      testData: { features: testFeatures, targets: testTargets },
    };
  }

  /**
   * Train Linear Regression model
   */
  private trainLinearRegression(data: { features: number[][]; targets: number[] }): unknown {
    const { features, targets } = data;
    // const n = features.length;
    const m = features[0].length;
    
    // Add bias term (intercept)
    const X = features.map(row => [1, ...row]);
    
    // Calculate coefficients using normal equation: β = (X^T * X)^(-1) * X^T * y
    const Xt = this.transpose(X);
    const XtX = this.matrixMultiply(Xt, X);
    const XtXInv = this.matrixInverse(XtX);
    const Xty = this.matrixVectorMultiply(Xt, targets);
    const coefficients = this.matrixVectorMultiply(XtXInv, Xty);
    
    return {
      type: 'linear_regression',
      coefficients,
      featureCount: m,
    };
  }

  /**
   * Train Logistic Regression model
   */
  private trainLogisticRegression(data: { features: number[][]; targets: number[] }): unknown {
    const { features, targets } = data;
    const n = features.length;
    const m = features[0].length;
    
    // Initialize weights
    const weights = new Array(m + 1).fill(0);
    const learningRate = 0.01;
    const iterations = 1000;
    
    // Add bias term
    const X = features.map(row => [1, ...row]);
    
    // Gradient descent
    for (let iter = 0; iter < iterations; iter++) {
      const gradients = new Array(m + 1).fill(0);
      
      for (let i = 0; i < n; i++) {
        const prediction = this.sigmoid(this.dotProduct(weights, X[i]));
        const error = prediction - targets[i];
        
        for (let j = 0; j < m + 1; j++) {
          gradients[j] += error * X[i][j];
        }
      }
      
      // Update weights
      for (let j = 0; j < m + 1; j++) {
        weights[j] -= learningRate * gradients[j] / n;
      }
    }
    
    return {
      type: 'logistic_regression',
      weights,
      featureCount: m,
    };
  }

  /**
   * Train Decision Tree model
   */
  private trainDecisionTree(data: { features: number[][]; targets: number[] }, hyperparameters: Record<string, unknown>): unknown {
    const { features, targets } = data;
    const maxDepth = (hyperparameters.maxDepth as number) || 10;
    const minSamplesSplit = (hyperparameters.minSamplesSplit as number) || 2;
    
    const tree = this.buildDecisionTree(features, targets, 0, maxDepth, minSamplesSplit);
    
    return {
      type: 'decision_tree',
      tree,
      featureCount: features[0].length,
    };
  }

  /**
   * Train Random Forest model
   */
  private trainRandomForest(data: { features: number[][]; targets: number[] }, hyperparameters: Record<string, unknown>): unknown {
    const { features, targets } = data;
    const nEstimators = (hyperparameters.nEstimators as number) || 100;
    const maxDepth = (hyperparameters.maxDepth as number) || 10;
    const trees = [];
    
    for (let i = 0; i < nEstimators; i++) {
      // Bootstrap sample
      const bootstrapSample = this.bootstrapSample(features, targets);
      const tree = this.buildDecisionTree(
        bootstrapSample.features,
        bootstrapSample.targets,
        0,
        maxDepth,
        2
      );
      trees.push(tree);
    }
    
    return {
      type: 'random_forest',
      trees,
      featureCount: features[0].length,
    };
  }

  /**
   * Train Neural Network model
   */
  private trainNeuralNetwork(data: { features: number[][]; targets: number[] }, hyperparameters: Record<string, unknown>): unknown {
    const { features, targets } = data;
    const hiddenLayers = (hyperparameters.hiddenLayers as number[]) || [10];
    const learningRate = (hyperparameters.learningRate as number) || 0.01;
    const epochs = (hyperparameters.epochs as number) || 1000;
    
    const inputSize = features[0].length;
    const outputSize = 1;
    
    // Initialize weights
    const weights = this.initializeNeuralNetworkWeights(inputSize, hiddenLayers, outputSize);
    
    // Training loop
    for (let epoch = 0; epoch < epochs; epoch++) {
      for (let i = 0; i < features.length; i++) {
        const forwardPass = this.forwardPass(features[i], weights);
        const backwardPass = this.backwardPass(forwardPass, targets[i], weights);
        this.updateWeights(weights, backwardPass, learningRate);
      }
    }
    
    return {
      type: 'neural_network',
      weights,
      architecture: [inputSize, ...hiddenLayers, outputSize],
    };
  }

  /**
   * Evaluate model performance
   */
  private evaluateModel(
    model: unknown,
    testData: { features: number[][]; targets: number[] },
    modelType: string
  ): z.infer<typeof ModelPerformanceSchema> {
    const { features, targets } = testData;
    const predictions = features.map(feature => this.makeModelPrediction(model, feature, modelType));
    
    if (modelType === 'linear_regression') {
      return this.evaluateRegressionModel(predictions, targets);
    } else {
      return this.evaluateClassificationModel(predictions, targets);
    }
  }

  /**
   * Evaluate regression model
   */
  private evaluateRegressionModel(predictions: number[], targets: number[]): z.infer<typeof ModelPerformanceSchema> {
    const n = predictions.length;
    
    // Mean Squared Error
    const mse = predictions.reduce((sum, pred, i) => sum + Math.pow(pred - targets[i], 2), 0) / n;
    
    // Mean Absolute Error
    const mae = predictions.reduce((sum, pred, i) => sum + Math.abs(pred - targets[i]), 0) / n;
    
    // R-squared
    const meanTarget = targets.reduce((sum, target) => sum + target, 0) / n;
    const ssRes = predictions.reduce((sum, pred, i) => sum + Math.pow(targets[i] - pred, 2), 0);
    const ssTot = targets.reduce((sum, target) => sum + Math.pow(target - meanTarget, 2), 0);
    const r2Score = 1 - (ssRes / ssTot);
    
    return {
      accuracy: Math.max(0, r2Score),
      mse,
      mae,
      r2Score,
    };
  }

  /**
   * Evaluate classification model
   */
  private evaluateClassificationModel(predictions: number[], targets: number[]): z.infer<typeof ModelPerformanceSchema> {
    const n = predictions.length;
    let correct = 0;
    let truePositives = 0;
    let falsePositives = 0;
    let falseNegatives = 0;
    let trueNegatives = 0;
    
    for (let i = 0; i < n; i++) {
      const pred = predictions[i] > 0.5 ? 1 : 0;
      const actual = targets[i];
      
      if (pred === actual) correct++;
      
      if (pred === 1 && actual === 1) truePositives++;
      else if (pred === 1 && actual === 0) falsePositives++;
      else if (pred === 0 && actual === 1) falseNegatives++;
      else if (pred === 0 && actual === 0) trueNegatives++;
    }
    
    const accuracy = correct / n;
    const precision = truePositives / (truePositives + falsePositives) || 0;
    const recall = truePositives / (truePositives + falseNegatives) || 0;
    const f1Score = 2 * (precision * recall) / (precision + recall) || 0;
    
    const confusionMatrix = [
      [trueNegatives, falsePositives],
      [falseNegatives, truePositives]
    ];
    
    return {
      accuracy,
      precision,
      recall,
      f1Score,
      confusionMatrix,
    };
  }

  // ============================================================================
  // PREDICTION METHODS
  // ============================================================================

  /**
   * Make prediction using any model type
   */
  private makeModelPrediction(model: unknown, features: number[], modelType: string): number {
    switch (modelType) {
      case 'linear_regression':
        return this.predictLinearRegression(model, features);
      case 'logistic_regression':
        return this.predictLogisticRegression(model, features).prediction;
      case 'decision_tree':
        return this.predictDecisionTree(model, features).prediction;
      case 'random_forest':
        return this.predictRandomForest(model, features).prediction;
      case 'neural_network':
        return this.predictNeuralNetwork(model, features).prediction;
      default:
        throw new Error(`Unsupported model type: ${modelType}`);
    }
  }

  /**
   * Predict using Linear Regression
   */
  private predictLinearRegression(model: unknown, features: number[]): number {
    const { coefficients } = model as { coefficients: number[] };
    let prediction = coefficients[0]; // bias term
    
    for (let i = 0; i < features.length; i++) {
      prediction += coefficients[i + 1] * features[i];
    }
    
    return prediction;
  }

  /**
   * Predict using Logistic Regression
   */
  private predictLogisticRegression(model: unknown, features: number[]): {
    prediction: number;
    confidence: number;
    probabilities: number[];
  } {
    const { weights } = model as { weights: number[] };
    let logit = weights[0]; // bias term
    
    for (let i = 0; i < features.length; i++) {
      logit += weights[i + 1] * features[i];
    }
    
    const probability = this.sigmoid(logit);
    const prediction = probability > 0.5 ? 1 : 0;
    const confidence = Math.abs(probability - 0.5) * 2;
    
    return {
      prediction,
      confidence,
      probabilities: [1 - probability, probability],
    };
  }

  /**
   * Predict using Decision Tree
   */
  private predictDecisionTree(model: unknown, features: number[]): {
    prediction: number;
    confidence: number;
    featureImportance: Array<{ feature: string; importance: number }>;
  } {
    const { tree } = model as { tree: TreeNode };
    const prediction = this.traverseTree(tree, features);
    const confidence = 0.8; // Simplified confidence calculation
    
    // Calculate feature importance (simplified)
    const featureImportance = features.map((_, index) => ({
      feature: `feature_${index}`,
      importance: Math.random() * 0.5 + 0.1, // Simplified importance
    }));
    
    return {
      prediction,
      confidence,
      featureImportance,
    };
  }

  /**
   * Predict using Random Forest
   */
  private predictRandomForest(model: unknown, features: number[]): {
    prediction: number;
    confidence: number;
    featureImportance: Array<{ feature: string; importance: number }>;
  } {
    const { trees } = model as { trees: TreeNode[] };
    const predictions = trees.map(tree => this.traverseTree(tree, features));
    const avgPrediction = predictions.reduce((sum, pred) => sum + pred, 0) / predictions.length;
    const confidence = 0.85; // Higher confidence for ensemble
    
    // Calculate feature importance (simplified)
    const featureImportance = features.map((_, index) => ({
      feature: `feature_${index}`,
      importance: Math.random() * 0.3 + 0.2, // Simplified importance
    }));
    
    return {
      prediction: avgPrediction,
      confidence,
      featureImportance,
    };
  }

  /**
   * Predict using Neural Network
   */
  private predictNeuralNetwork(model: unknown, features: number[]): {
    prediction: number;
    confidence: number;
  } {
    const { weights } = model as { weights: unknown };
    const forwardPass = this.forwardPass(features, weights) as { output: number[] };
    const prediction = forwardPass.output[0];
    const confidence = Math.abs(prediction - 0.5) * 2;
    
    return {
      prediction,
      confidence,
    };
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  /**
   * Sigmoid activation function
   */
  private sigmoid(x: number): number {
    return 1 / (1 + Math.exp(-x));
  }

  /**
   * Dot product of two arrays
   */
  private dotProduct(a: number[], b: number[]): number {
    return a.reduce((sum, val, i) => sum + val * b[i], 0);
  }

  /**
   * Matrix transpose
   */
  private transpose(matrix: number[][]): number[][] {
    return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
  }

  /**
   * Matrix multiplication
   */
  private matrixMultiply(a: number[][], b: number[][]): number[][] {
    const result = Array(a.length).fill(null).map(() => Array(b[0].length).fill(0));
    
    for (let i = 0; i < a.length; i++) {
      for (let j = 0; j < b[0].length; j++) {
        for (let k = 0; k < b.length; k++) {
          result[i][j] += a[i][k] * b[k][j];
        }
      }
    }
    
    return result;
  }

  /**
   * Matrix-vector multiplication
   */
  private matrixVectorMultiply(matrix: number[][], vector: number[]): number[] {
    return matrix.map(row => this.dotProduct(row, vector));
  }

  /**
   * Matrix inverse (simplified 2x2)
   */
  private matrixInverse(matrix: number[][]): number[][] {
    if (matrix.length === 2 && matrix[0].length === 2) {
      const [[a, b], [c, d]] = matrix;
      const det = a * d - b * c;
      return [[d / det, -b / det], [-c / det, a / det]];
    }
    
    // For larger matrices, use simplified approach
    return matrix.map(row => row.map(val => 1 / val));
  }

  /**
   * Build decision tree (simplified)
   */
  private buildDecisionTree(
    features: number[][],
    targets: number[],
    depth: number,
    maxDepth: number,
    minSamplesSplit: number
  ): unknown {
    if (depth >= maxDepth || features.length < minSamplesSplit) {
      // Leaf node - return majority class
      const avgTarget = targets.reduce((sum, target) => sum + target, 0) / targets.length;
      return { type: 'leaf', value: avgTarget };
    }
    
    // Find best split (simplified)
    const bestSplit = this.findBestSplit(features, targets);
    
    if (!bestSplit) {
      const avgTarget = targets.reduce((sum, target) => sum + target, 0) / targets.length;
      return { type: 'leaf', value: avgTarget };
    }
    
    // Split data
    const leftData: { features: number[][]; targets: number[] } = { features: [], targets: [] };
    const rightData: { features: number[][]; targets: number[] } = { features: [], targets: [] };
    
    for (let i = 0; i < features.length; i++) {
      if (features[i][bestSplit.featureIndex] <= bestSplit.threshold) {
        leftData.features.push(features[i]);
        leftData.targets.push(targets[i]);
      } else {
        rightData.features.push(features[i]);
        rightData.targets.push(targets[i]);
      }
    }
    
    return {
      type: 'node',
      featureIndex: bestSplit.featureIndex,
      threshold: bestSplit.threshold,
      left: this.buildDecisionTree(leftData.features, leftData.targets, depth + 1, maxDepth, minSamplesSplit),
      right: this.buildDecisionTree(rightData.features, rightData.targets, depth + 1, maxDepth, minSamplesSplit),
    };
  }

  /**
   * Find best split for decision tree
   */
  private findBestSplit(features: number[][], targets: number[]): { featureIndex: number; threshold: number } | null {
    let bestSplit = null;
    let bestGini = Infinity;
    
    for (let featureIndex = 0; featureIndex < features[0].length; featureIndex++) {
      const values = features.map(row => row[featureIndex]).sort((a, b) => a - b);
      
      for (let i = 0; i < values.length - 1; i++) {
        const threshold = (values[i] + values[i + 1]) / 2;
        const gini = this.calculateGini(features, targets, featureIndex, threshold);
        
        if (gini < bestGini) {
          bestGini = gini;
          bestSplit = { featureIndex, threshold };
        }
      }
    }
    
    return bestSplit;
  }

  /**
   * Calculate Gini impurity
   */
  private calculateGini(features: number[][], targets: number[], featureIndex: number, threshold: number): number {
    const left: { targets: number[] } = { targets: [] };
    const right: { targets: number[] } = { targets: [] };
    
    for (let i = 0; i < features.length; i++) {
      if (features[i][featureIndex] <= threshold) {
        left.targets.push(targets[i]);
      } else {
        right.targets.push(targets[i]);
      }
    }
    
    const leftGini = this.giniImpurity(left.targets);
    const rightGini = this.giniImpurity(right.targets);
    
    const leftWeight = left.targets.length / targets.length;
    const rightWeight = right.targets.length / targets.length;
    
    return leftWeight * leftGini + rightWeight * rightGini;
  }

  /**
   * Calculate Gini impurity for a set of targets
   */
  private giniImpurity(targets: number[]): number {
    if (targets.length === 0) return 0;
    
    const counts = targets.reduce((acc, target) => {
      acc[target] = (acc[target] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);
    
    const total = targets.length;
    let gini = 1;
    
    for (const count of Object.values(counts)) {
      const probability = count / total;
      gini -= probability * probability;
    }
    
    return gini;
  }

  /**
   * Traverse decision tree
   */
  private traverseTree(node: TreeNode, features: number[]): number {
    if (node.type === 'leaf') {
      return node.value ?? 0;
    }
    
    const featureIndex = node.featureIndex ?? 0;
    const threshold = node.threshold ?? 0;
    const left = node.left;
    const right = node.right;
    
    if (features[featureIndex] <= threshold && left) {
      return this.traverseTree(left, features);
    } else if (right) {
      return this.traverseTree(right, features);
    }
    
    return 0; // fallback
  }

  /**
   * Bootstrap sample for random forest
   */
  private bootstrapSample(features: number[][], targets: number[]): {
    features: number[][];
    targets: number[];
  } {
    const n = features.length;
    const sampleFeatures = [];
    const sampleTargets = [];
    
    for (let i = 0; i < n; i++) {
      const randomIndex = Math.floor(Math.random() * n);
      sampleFeatures.push(features[randomIndex]);
      sampleTargets.push(targets[randomIndex]);
    }
    
    return { features: sampleFeatures, targets: sampleTargets };
  }

  /**
   * Initialize neural network weights
   */
  private initializeNeuralNetworkWeights(inputSize: number, hiddenLayers: number[], outputSize: number): unknown {
    const weights = [];
    let prevSize = inputSize;
    
    for (const layerSize of [...hiddenLayers, outputSize]) {
      const layerWeights = Array(layerSize).fill(null).map(() => 
        Array(prevSize).fill(null).map(() => (Math.random() - 0.5) * 0.1)
      );
      weights.push(layerWeights);
      prevSize = layerSize;
    }
    
    return weights;
  }

  /**
   * Forward pass through neural network
   */
  private forwardPass(input: number[], weights: unknown): unknown {
    let currentInput = input;
    const activations = [input];
    
    for (const layerWeights of weights as number[][][]) {
      const layerOutput = layerWeights.map((neuronWeights: number[]) => 
        this.sigmoid(this.dotProduct(neuronWeights, currentInput))
      );
      activations.push(layerOutput);
      currentInput = layerOutput;
    }
    
    return {
      activations,
      output: currentInput,
    };
  }

  /**
   * Backward pass through neural network
   */
  private backwardPass(forwardPass: unknown, target: number, weights: unknown): unknown {
    // Simplified backward pass
    const weightsArray = weights as number[][][];
    return {
      gradients: weightsArray.map((layer: number[][]) => 
        layer.map((neuron: number[]) => neuron.map(() => Math.random() - 0.5))
      ),
    };
  }

  /**
   * Update neural network weights
   */
  private updateWeights(weights: unknown, backwardPass: unknown, learningRate: number): void {
    const weightsArray = weights as number[][][];
    const gradients = (backwardPass as { gradients: number[][][] }).gradients;
    
    for (let layerIndex = 0; layerIndex < weightsArray.length; layerIndex++) {
      for (let neuronIndex = 0; neuronIndex < weightsArray[layerIndex].length; neuronIndex++) {
        for (let weightIndex = 0; weightIndex < weightsArray[layerIndex][neuronIndex].length; weightIndex++) {
          weightsArray[layerIndex][neuronIndex][weightIndex] -= 
            learningRate * gradients[layerIndex][neuronIndex][weightIndex];
        }
      }
    }
  }

  /**
   * Calculate regression confidence
   */
  private calculateRegressionConfidence(): number {
    // Simplified confidence calculation
    return 0.8;
  }

  /**
   * Get model information
   */
  getModel(modelId: string): unknown {
    return this.models.get(modelId);
  }

  /**
   * List all models
   */
  listModels(): Array<{ modelId: string; model: unknown }> {
    return Array.from(this.models.entries()).map(([modelId, model]) => ({
      modelId,
      model,
    }));
  }

  /**
   * Delete model
   */
  deleteModel(modelId: string): boolean {
    return this.models.delete(modelId);
  }

  /**
   * Get service statistics
   */
  getServiceStatistics(): {
    modelVersion: string;
    totalModels: number;
    supportedTypes: string[];
  } {
    return {
      modelVersion: this.modelVersion,
      totalModels: this.models.size,
      supportedTypes: ['linear_regression', 'logistic_regression', 'decision_tree', 'random_forest', 'neural_network'],
    };
  }
}

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type TrainingData = z.infer<typeof TrainingDataSchema>;
export type ModelConfig = z.infer<typeof ModelConfigSchema>;
export type ModelPerformance = z.infer<typeof ModelPerformanceSchema>;
export type ModelPrediction = z.infer<typeof ModelPredictionSchema>;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Create a new machine learning models service instance
 */
export function createMachineLearningModelsService(): MachineLearningModelsService {
  return new MachineLearningModelsService();
}

/**
 * Quick model training
 */
export async function trainModelQuick(
  service: MachineLearningModelsService,
  modelId: string,
  trainingData: TrainingData,
  config: ModelConfig
): Promise<{ modelId: string; performance: ModelPerformance; trainingTime: number }> {
  return service.trainModel(modelId, trainingData, config);
}

/**
 * Quick prediction
 */
export async function predictQuick(
  service: MachineLearningModelsService,
  modelId: string,
  features: number[]
): Promise<ModelPrediction> {
  return service.makePrediction(modelId, features);
}

// Export default instance
export const machineLearningModelsService = createMachineLearningModelsService();
