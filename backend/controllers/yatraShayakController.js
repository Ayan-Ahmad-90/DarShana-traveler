const fs = require('fs');
const path = require('path');

// Load knowledge base
const dataPath = path.join(__dirname, '../data/chatbot_knowledge_base.json');
let knowledgeBase = [];

try {
  const data = fs.readFileSync(dataPath, 'utf8');
  knowledgeBase = JSON.parse(data);
} catch (err) {
  console.error("Error loading chatbot knowledge base:", err);
  // Fallback if file fails to load
  knowledgeBase = [
    {
      questions: ["hello", "hi"],
      answer: "Namaste! I am Yatra Shayak. (System Note: Knowledge base failed to load)"
    }
  ];
}

// Levenshtein distance for fuzzy matching
function levenshteinDistance(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix = [];

  // increment along the first column of each row
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  // increment each column in the first row
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  // Fill in the rest of the matrix
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          Math.min(
            matrix[i][j - 1] + 1, // insertion
            matrix[i - 1][j] + 1 // deletion
          )
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

function findBestMatch(userMessage) {
  const lowerUserMsg = userMessage.toLowerCase().trim();
  let bestMatch = null;
  let lowestDistance = Infinity;
  
  // Threshold: Allow some errors, but not too many. 
  // For short words, strictness should be higher.
  // A simple heuristic: distance <= word_length * 0.4 (40% difference allowed)
  
  for (const entry of knowledgeBase) {
    for (const question of entry.questions) {
      const dist = levenshteinDistance(lowerUserMsg, question);
      
      // Calculate a relative score to handle different word lengths
      // Lower score is better match
      const score = dist / Math.max(lowerUserMsg.length, question.length);

      // Check if this is a better match than what we found so far
      // We use a threshold of 0.4 (40% difference allowed) for fuzzy matching
      if (score < 0.4 && dist < lowestDistance) {
        lowestDistance = dist;
        bestMatch = entry;
      }
      
      // Exact substring match check (for longer sentences)
      if (lowerUserMsg.includes(question) && question.length > 3) {
          return entry; // Immediate return for strong keyword matches
      }
    }
  }

  return bestMatch;
}

exports.chat = async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ response: "Please say something!" });
    }

    const match = findBestMatch(message);

    let response;
    if (match) {
      response = match.answer;
    } else {
      response = "I'm not sure I understand. Could you please rephrase? You can ask me about bookings, safety, festivals, or travel tips.";
    }

    res.json({ response });
  } catch (error) {
    console.error("Chatbot Error:", error);
    res.status(500).json({ message: 'Chat failed', error: error.message });
  }
};
