import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// Gemini-backed LLD Evaluation Endpoint
app.post('/api/evaluate', async (req, res) => {
  try {
    const { problem, submission, deterministicFindings } = req.body;

    if (!problem || !submission) {
      return res.status(400).json({ error: 'Missing problem or submission data' });
    }

    if (!process.env.GEMINI_API_KEY) {
      // Graceful fallback to deterministic analysis when no API key is provided
      return res.json({
        source: 'fallback',
        message: 'No GEMINI_API_KEY provided; returning deterministic evaluation.',
        evaluation: null,
      });
    }

    const prompt = `You are a Principal Software Architect and Senior Staff Engineer evaluating a Low-Level Design (LLD) interview attempt.
Review the following candidate submission against the problem requirements.

PROBLEM:
Title: ${problem.title}
Brief: ${problem.brief}
Functional Requirements: ${JSON.stringify(problem.requirements?.functional || [])}
Non-Functional & Constraints: ${JSON.stringify(problem.requirements?.nonFunctional || [])}
Key Expected Entities: ${JSON.stringify(problem.keyEntities || [])}
Recommended Patterns: ${JSON.stringify(problem.recommendedPatterns || [])}

CANDIDATE SUBMISSION:
Attempt Number: ${submission.attemptNumber || 1}
Design Decisions & Trade-offs:
- Patterns Used: ${submission.content?.designDecisions?.patternsUsed || 'None stated'}
- Concurrency Strategy: ${submission.content?.designDecisions?.concurrencyStrategy || 'None stated'}
- Extensibility Notes: ${submission.content?.designDecisions?.extensibilityNotes || 'None stated'}
- Trade-offs: ${submission.content?.designDecisions?.tradeoffsConsidered || 'None stated'}

Classes & UML Schema:
${submission.content?.classDiagramUml || 'None provided'}

Source Code / Method Signatures:
${submission.content?.sourceCode || 'None provided'}

STATIC ANALYSIS FINDINGS (from Deterministic Pre-check):
${JSON.stringify(deterministicFindings || {})}

EVALUATION RUBRIC:
Evaluate objectively across these 5 dimensions (each scored 0-20, total 0-100):
1. Single Responsibility & Cohesion (Are classes focused, avoiding God classes? Clear domain boundaries?)
2. Abstraction & Interfaces (Are interfaces used to decouple clients? Dependency inversion followed?)
3. Design Pattern Suitability (Are patterns like Strategy, Factory, State, Observer appropriately applied or over-engineered?)
4. Extensibility & Open-Closed (Can new requirements or strategies be added without rewriting existing classes?)
5. Concurrency & Edge Cases (Are race conditions, thread safety, validation, and boundary conditions addressed?)

Provide actionable, constructive, explainable feedback with pros, cons, concrete refactoring suggestions, and alternative designs.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallScore: { type: Type.NUMBER, description: 'Score from 0 to 100' },
            verdict: { type: Type.STRING, description: 'Exemplary, Strong, Competent, Needs Revision, or Unacceptable' },
            rubricBreakdown: {
              type: Type.OBJECT,
              properties: {
                singleResponsibility: {
                  type: Type.OBJECT,
                  properties: {
                    score: { type: Type.NUMBER, description: 'Score out of 20' },
                    status: { type: Type.STRING, description: 'PASS, WARN, or FAIL' },
                    feedback: { type: Type.STRING },
                  },
                  required: ['score', 'status', 'feedback'],
                },
                abstractionAndInterfaces: {
                  type: Type.OBJECT,
                  properties: {
                    score: { type: Type.NUMBER, description: 'Score out of 20' },
                    status: { type: Type.STRING, description: 'PASS, WARN, or FAIL' },
                    feedback: { type: Type.STRING },
                  },
                  required: ['score', 'status', 'feedback'],
                },
                designPatternSuitability: {
                  type: Type.OBJECT,
                  properties: {
                    score: { type: Type.NUMBER, description: 'Score out of 20' },
                    status: { type: Type.STRING, description: 'PASS, WARN, or FAIL' },
                    feedback: { type: Type.STRING },
                  },
                  required: ['score', 'status', 'feedback'],
                },
                openClosedExtensibility: {
                  type: Type.OBJECT,
                  properties: {
                    score: { type: Type.NUMBER, description: 'Score out of 20' },
                    status: { type: Type.STRING, description: 'PASS, WARN, or FAIL' },
                    feedback: { type: Type.STRING },
                  },
                  required: ['score', 'status', 'feedback'],
                },
                concurrencyAndEdgeCases: {
                  type: Type.OBJECT,
                  properties: {
                    score: { type: Type.NUMBER, description: 'Score out of 20' },
                    status: { type: Type.STRING, description: 'PASS, WARN, or FAIL' },
                    feedback: { type: Type.STRING },
                  },
                  required: ['score', 'status', 'feedback'],
                },
              },
              required: [
                'singleResponsibility',
                'abstractionAndInterfaces',
                'designPatternSuitability',
                'openClosedExtensibility',
                'concurrencyAndEdgeCases',
              ],
            },
            explainableCritique: {
              type: Type.OBJECT,
              properties: {
                verdictSummary: { type: Type.STRING },
                strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                criticalFlaws: { type: Type.ARRAY, items: { type: Type.STRING } },
                refactoringSuggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
                alternativeDesigns: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ['verdictSummary', 'strengths', 'criticalFlaws', 'refactoringSuggestions', 'alternativeDesigns'],
            },
          },
          required: ['overallScore', 'verdict', 'rubricBreakdown', 'explainableCritique'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({
      source: 'gemini',
      evaluation: parsed,
    });
  } catch (error: any) {
    console.error('Gemini evaluation error:', error);
    return res.status(500).json({
      error: error.message || 'LLM evaluation failed',
      source: 'error_fallback',
    });
  }
});

// Vite dev server or static files
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true, host: '0.0.0.0', port: PORT },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`LLD Practice Platform running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
