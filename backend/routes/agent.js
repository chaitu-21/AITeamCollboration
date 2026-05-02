const express = require('express');
const router = express.Router();
const db = require('../db');

// This simulates the MCP Agent integration
// In a production GCP environment, this would call Vertex AI (Gemini)
// and provide it with an MCP Server (e.g., our database) to fetch context.
router.post('/chat', async (req, res) => {
  const { message } = req.body;
  
  try {
    // 1. Fetch current context from the database (Simulating what an MCP tool would do)
    const tasks = await db.all('SELECT * FROM tasks');
    
    // 2. Simple Mock AI Logic (Simulating Gemini Agent)
    let aiResponse = "";
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('standup') || lowerMessage.includes('summary')) {
      const doneTasks = tasks.filter(t => t.status === 'Done');
      const inProgress = tasks.filter(t => t.status === 'In Progress');
      aiResponse = `**Daily Standup Summary:**\nWe have completed ${doneTasks.length} tasks recently. There are currently ${inProgress.length} tasks in progress. Keep up the good work!`;
    } 
    else if (lowerMessage.includes('block') || lowerMessage.includes('stuck')) {
      aiResponse = `I checked the board. Currently, there are no tasks explicitly marked as blocked, but Alice has a task "In Progress" that might need review. Should I ping her?`;
    }
    else if (lowerMessage.includes('triage') || lowerMessage.includes('new')) {
      aiResponse = `I can help triage new issues. Based on recent workloads, I suggest assigning frontend bugs to Charlie and backend to Bob.`;
    }
    else {
      aiResponse = `As your AI Scrum Master, I am monitoring the board. You have ${tasks.length} total tasks. How can I help you coordinate today?`;
    }

    // Simulate network delay for AI generation
    setTimeout(() => {
      res.json({ reply: aiResponse });
    }, 1000);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Agent failed to respond' });
  }
});

module.exports = router;
