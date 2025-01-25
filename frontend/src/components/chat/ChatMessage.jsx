import PropTypes from 'prop-types';
import { Box, Container } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CodeIcon from '@mui/icons-material/Code';
import ReplayIcon from '@mui/icons-material/Replay';
import IconButton from '../common/IconButton';
import { extractCodeBlocks } from '../../utils/formatters';

/**
 * Individual chat message component
 * @param {Object} props - Component props
 * @param {Object} props.message - Message data
 * @param {Function} props.onRegenerate - Regenerate handler
 */
const ChatMessage = ({ message, onRegenerate }) => {
  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      console.log('Content copied');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <Box sx={{ mb: 0.5, p: 0, position: 'relative' }}>
      <Box sx={{ p: 3, bgcolor: 'white', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
        <Container maxWidth="md">
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'flex-start', 
            gap: 2,
            flexDirection: message.role === 'user' ? 'row-reverse' : 'row'
          }}>
            {/* Avatar */}
            <Box sx={{ 
              width: 30,
              height: 30,
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: message.role === 'user' ? '#5c5c5c' : '#19c37d',
              color: 'white',
              flexShrink: 0
            }}>
              {message.role === 'user' 
                ? <PersonOutlineIcon sx={{ fontSize: 20 }} />
                : <SmartToyOutlinedIcon sx={{ fontSize: 20 }} />
              }
            </Box>

            {/* Content */}
            <Box sx={{ 
              flex: 1,
              bgcolor: message.role === 'user' ? '#f7f7f8' : 'white',
              p: message.role === 'user' ? 2 : 0,
              borderRadius: message.role === 'user' ? 2 : 0
            }}>
              {message.isLoading ? (
                <Box sx={{ p: 2 }}>
                  <Box component="span" sx={{
                    color: '#666',
                    fontSize: '24px',
                    lineHeight: 1,
                    animation: 'blink 1s infinite',
                    '@keyframes blink': {
                      '0%, 100%': { opacity: 0.2 },
                      '50%': { opacity: 0.8 }
                    }
                  }}>...</Box>
                </Box>
              ) : (
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={{
                    table: ({ isHeader, ...props }) => (
                      <table style={{ 
                        borderCollapse: 'collapse', 
                        width: '100%',
                        marginBottom: '1rem',
                        fontSize: '0.9em'
                      }} {...props} />
                    ),
                    th: ({ isHeader, ...props }) => (
                      <th style={{ 
                        border: '1px solid #ddd', 
                        padding: '12px 8px',
                        background: '#f5f5f5',
                        fontWeight: 600
                      }} {...props} />
                    ),
                    td: ({ isHeader, ...props }) => (
                      <td style={{ 
                        border: '1px solid #ddd', 
                        padding: '8px',
                        lineHeight: 1.4
                      }} {...props} />
                    ),
                    code: ({ node, inline, ...props }) => (
                      <code style={{
                        backgroundColor: inline ? 'transparent' : '#f5f5f5',
                        padding: inline ? '2px 4px' : '12px',
                        borderRadius: '4px',
                        fontSize: '0.9em',
                        display: inline ? 'inline' : 'block',
                        whiteSpace: 'pre-wrap'
                      }} {...props} />
                    ),
                    pre: ({ node, ...props }) => (
                      <pre style={{
                        backgroundColor: '#f5f5f5',
                        padding: '1em',
                        borderRadius: '4px',
                        overflow: 'auto',
                        margin: '1em 0'
                      }} {...props} />
                    )
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              )}
            </Box>

            {/* Actions */}
            {message.role === 'assistant' && (
              <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
                <IconButton
                  title="Copy message"
                  onClick={() => handleCopy(message.content)}
                >
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
                <IconButton
                  title="Copy code blocks"
                  onClick={() => handleCopy(extractCodeBlocks(message.content))}
                >
                  <CodeIcon fontSize="small" />
                </IconButton>
                <IconButton
                  title="Regenerate response"
                  onClick={onRegenerate}
                  disabled={message.isLoading}
                >
                  <ReplayIcon fontSize="small" />
                </IconButton>
              </Box>
            )}
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

ChatMessage.propTypes = {
  message: PropTypes.shape({
    role: PropTypes.oneOf(['user', 'assistant']).isRequired,
    content: PropTypes.string.isRequired,
    isLoading: PropTypes.bool
  }).isRequired,
  onRegenerate: PropTypes.func.isRequired
};

export default ChatMessage; 