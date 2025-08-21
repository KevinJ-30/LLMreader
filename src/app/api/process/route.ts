import { NextRequest, NextResponse } from 'next/server';
import { AssistantRequest, AssistantResponse } from '@/types';

const mockResponses: Record<string, string> = {
  explain: `This text appears to be discussing a complex scientific or academic concept. Here's a detailed explanation:

The passage introduces key terminology and concepts that are fundamental to understanding the broader topic. It establishes definitions and provides context that will be built upon throughout the document.

Key points covered:
" Important definitions and terminology
" Background context and historical perspective
" Methodological approaches or theoretical frameworks
" Connections to related fields or concepts

This type of introductory material is typically found in academic papers to ensure readers have the necessary foundation to understand the more complex analysis that follows.`,

  define: `Key terms and definitions from the selected text:

**Primary Term**: The main concept being discussed, referring to [specific definition based on context]

**Related Terms**:
" Technical terminology specific to the field
" Methodological concepts
" Theoretical frameworks
" Industry-standard definitions

**Context**: These terms are being used in an academic/research setting to establish precise meanings that will be consistently applied throughout the document.

**Etymology/Origin**: Many of these terms derive from [relevant field] and have evolved to encompass modern understanding of the concepts.`,

  simplify: `Here's the same information in simpler terms:

The text is basically explaining [main concept] in a straightforward way. 

Think of it like this: Imagine you're trying to understand [analogy]. The author is breaking down a complex idea into smaller, easier pieces.

The main points are:
1. [First main point in simple language]
2. [Second main point in simple language]  
3. [Third main point in simple language]

Why this matters: This information helps you understand [practical application or relevance] that will be important for the rest of the document.

In everyday terms, this is similar to [relatable example or comparison].`,

  custom: `Based on your specific question about the selected text, here's a detailed response:

I've analyzed the text you selected and considered your particular question. The passage contains several elements that directly relate to your inquiry.

Here are the key points that address your question:
" [Relevant point 1]
" [Relevant point 2]
" [Relevant point 3]

Additional context that might be helpful:
The text suggests that [interpretation based on the question context]. This connects to broader themes in the document and provides insight into [relevant implications].

Would you like me to explore any specific aspect of this response in more detail?`
};

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function POST(request: NextRequest) {
  try {
    const body: AssistantRequest = await request.json();
    
    const { selectedText, context, actionType, customPrompt, pageNumber } = body;

    // Validate request
    if (actionType === 'custom' && customPrompt) {
      // For custom questions, we don't require selected text
      if (!customPrompt.trim()) {
        return NextResponse.json(
          { error: 'Custom prompt is required' },
          { status: 400 }
        );
      }
    } else {
      // For other actions, require selected text
      if (!selectedText || selectedText.trim().length < 3) {
        return NextResponse.json(
          { error: 'Selected text is too short' },
          { status: 400 }
        );
      }
    }

    if (!actionType) {
      return NextResponse.json(
        { error: 'Action type is required' },
        { status: 400 }
      );
    }

    // Simulate processing delay
    await delay(1000);

    // Get base response template
    let response = mockResponses[actionType] || mockResponses.explain;

    // Customize response based on action type and context
    if (actionType === 'custom' && customPrompt) {
      if (selectedText && selectedText.trim().length > 0) {
        // Custom question with selected text
        response = `Based on your question "${customPrompt}" about the selected text, here's my analysis:

The selected text: "${selectedText.substring(0, 100)}${selectedText.length > 100 ? '...' : ''}"

${mockResponses.custom}

Your specific question about "${customPrompt}" relates to several key aspects of this text that I can help clarify further.`;
      } else {
        // Custom question without selected text (general document question)
        response = `Based on your question "${customPrompt}" about the document, here's my analysis:

${mockResponses.custom}

Your question "${customPrompt}" appears to be about the overall document content. I can help you understand various aspects of the document, including its structure, main themes, methodology, or specific sections you'd like to explore further.

Would you like me to:
- Summarize the document's main points?
- Explain specific concepts or terminology?
- Analyze particular sections or findings?
- Help you understand the research methodology?

Please let me know what specific aspect you'd like me to focus on!`;
      }
    } else {
      // Add selected text context to response
      const textPreview = selectedText.length > 200 
        ? selectedText.substring(0, 200) + '...' 
        : selectedText;
      
      response = `Analyzing the selected text: "${textPreview}"
      
${response}`;

      // Add page context if available
      if (pageNumber) {
        response += `\n\n*This analysis is based on content from page ${pageNumber} of the document.*`;
      }
    }

    const assistantResponse: AssistantResponse = {
      response,
      actionType,
    };

    return NextResponse.json(assistantResponse);

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}