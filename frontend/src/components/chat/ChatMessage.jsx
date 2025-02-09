/**
 * External Dependencies
 * - MUI components and icons for UI elements
 * - Markdown processing libraries
 * - PropTypes for type checking
 */
import PropTypes from 'prop-types';
import { Box, Container, Typography } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { MarkdownTable, TableCell } from './MarkdownTable';

/**
 * MUI Icons
 * - PersonOutlineIcon: User avatar
 * - SmartToyOutlinedIcon: AI assistant avatar
 * - FileCopyOutlinedIcon: Copy whole message
 * - ContentCopyIcon: Copy code blocks
 * - ReplayIcon: Regenerate response
 */
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import FileCopyOutlinedIcon from '@mui/icons-material/FileCopyOutlined';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ReplayIcon from '@mui/icons-material/Replay';

/**
 * Internal Dependencies
 */
import IconButton from '../common/IconButton';

/**
 * ChatMessage Component
 * 
 * Renders a chat message with markdown support, code blocks, and action buttons.
 * Handles different layouts for user and assistant messages.
 * 
 * Features:
 * - Markdown rendering with table support
 * - Syntax highlighted code blocks with copy functionality
 * - Message copying and regeneration for assistant messages
 * - Loading state indication
 * - Different styling for user/assistant messages
 * 
 * @component
 * @param {Object} props
 * @param {Object} props.message - Message data
 * @param {('user'|'assistant')} props.message.role - Message sender role
 * @param {string} props.message.content - Message content (markdown supported)
 * @param {boolean} [props.message.isLoading] - Loading state indicator
 * @param {boolean} [props.message.error] - Error state indicator
 * @param {Function} props.onRegenerate - Callback to regenerate assistant messages
 */
const ChatMessage = ({ message, onRegenerate }) => {
  const isAssistant = message.role === 'assistant';
  const hasError = message.error;

  // Styles object for better organization
  const styles = {
    messageContainer: {
      width: '100%',
      borderBottom: '1px solid rgba(0,0,0,0.1)',
      bgcolor: 'white',
    },
    messageBox: {
      p: 3,
      width: '100%',
    },
    contentLayout: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 2,
      flexDirection: message.role === 'user' ? 'row-reverse' : 'row',
      width: '100%'
    },
    avatar: {
      width: 30,
      height: 30,
      borderRadius: '4px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      bgcolor: message.role === 'user' ? '#5c5c5c' : '#19c37d',
      color: 'white',
      flexShrink: 0
    },
    content: {
      flex: 1,
      bgcolor: message.role === 'user' ? '#f7f7f8' : 'white',
      p: message.role === 'user' ? 2 : 0,
      borderRadius: message.role === 'user' ? 2 : 0,
      maxWidth: 'calc(100% - 80px)',
      '& pre': {
        maxWidth: '100%',
        overflow: 'auto'
      },
      '& table': {
        maxWidth: '100%',
        overflow: 'auto'
      }
    },
    actions: {
      display: 'flex',
      gap: 1,
      ml: 2,
      flexShrink: 0
    }
  };

  /**
   * Handles copying text to clipboard
   * @param {string} text - Text to copy
   */
  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      // Silent fail for copy errors
    }
  };

  /**
   * Custom components for markdown rendering
   */
  const markdownComponents = {
    table: MarkdownTable,
    th: props => <TableCell isHeader {...props} />,
    td: TableCell,
    code: ({ node, inline, className, children, ...props }) => {
      if (inline) return <code className={className} {...props}>{children}</code>;

      const language = className ? className.replace('language-', '') : '';
      const codeString = String(children).replace(/\n$/, '');

      return (
        <div style={{ position: 'relative' }}>
          <IconButton
            title="Copy code"
            onClick={() => handleCopy(codeString)}
            sx={{
              position: 'absolute',
              left: '8px',
              top: '8px',
              bgcolor: 'rgba(255,255,255,0.8)',
              padding: '4px',
              '&:hover': { 
                bgcolor: 'rgba(255,255,255,0.9)',
                color: 'primary.main',
              }
            }}
          >
            <ContentCopyIcon sx={{ fontSize: '1rem' }} />
          </IconButton>
          {/* Language label */}
          {language && (
            <div style={{ 
              position: 'absolute',
              top: '12px',
              right: '12px',
              color: '#666',
              fontSize: '0.9em',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              fontWeight: 500
            }}>
              {language}
            </div>
          )}
          {/* Code content */}
          <code {...props} className={className} style={{
            backgroundColor: '#f5f5f5',
            padding: '16px',
            paddingTop: '40px',
            borderRadius: '4px',
            display: 'block',
            overflowX: 'auto',
            marginTop: '8px',
            marginBottom: '8px'
          }}>
            {children}
          </code>
        </div>
      );
    },
    pre: ({ ...props }) => (
      <pre style={{
        backgroundColor: '#f5f5f5',
        padding: '1em',
        borderRadius: '4px',
        overflow: 'auto',
        margin: '1em 0'
      }} {...props} />
    )
  };

  return (
    <Box sx={styles.messageContainer}>
      <Box sx={styles.messageBox}>
        <Container maxWidth="md" sx={{ px: { xs: 2, sm: 3 }, width: '100%' }}>
          <Box sx={styles.contentLayout}>
            {/* Avatar */}
            <Box sx={styles.avatar}>
              {message.role === 'user' 
                ? <PersonOutlineIcon sx={{ fontSize: 20 }} />
                : <SmartToyOutlinedIcon sx={{ fontSize: 20 }} />
              }
            </Box>

            {/* Message Content */}
            <Box sx={styles.content}>
              {message.isLoading ? (
                <Typography color="text.secondary">Thinking...</Typography>
              ) : hasError ? (
                <Typography color="error">Error generating response</Typography>
              ) : (
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={markdownComponents}
                >
                  {message.content || ''}
                </ReactMarkdown>
              )}
            </Box>

            {/* Action Buttons */}
            {message.role === 'assistant' && !message.isLoading && (
              <Box sx={styles.actions}>
                <IconButton
                  title="Copy message"
                  onClick={() => handleCopy(message.content)}
                >
                  <FileCopyOutlinedIcon fontSize="small" />
                </IconButton>
                <IconButton
                  title="Regenerate response"
                  onClick={onRegenerate}
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
    isLoading: PropTypes.bool,
    error: PropTypes.bool,
  }).isRequired,
  onRegenerate: PropTypes.func.isRequired
};

export default ChatMessage; 