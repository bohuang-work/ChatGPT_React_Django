/**
 * Extract code blocks from markdown content
 * @param {string} content - Markdown content
 * @returns {string} Extracted code blocks
 */
export const extractCodeBlocks = (content) => {
  const codeBlockRegex = /```(python|javascript|typescript|java|cpp|cs|ruby|go|rust|php|sql|html|css|bash|shell)?\s*([\s\S]*?)```/gi;
  const matches = [];
  let match;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    if (match[1] && match[1].toLowerCase() !== 'plaintext') {
      matches.push(match[2].trim());
    }
  }

  return matches.join('\n\n');
}; 