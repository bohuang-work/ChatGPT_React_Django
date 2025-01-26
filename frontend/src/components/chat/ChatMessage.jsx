/**
 * External Dependencies
 * - MUI components and icons for UI elements
 * - Markdown processing libraries
 * - PropTypes for type checking
 */
import PropTypes from 'prop-types';
import { Box, Container } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { v4 as uuidv4 } from 'uuid';
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
 * @param {Function} props.onRegenerate - Callback to regenerate assistant messages
 */
const ChatMessage = ({ message, onRegenerate }) => {
  // Styles object for better organization
  const styles = {
    messageContainer: {
      mb: 0.5,
      p: 0,
      position: 'relative'
    },
    messageBox: {
      p: 3,
      bgcolor: 'white',
      borderBottom: '1px solid rgba(0,0,0,0.1)'
    },
    contentLayout: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 2,
      flexDirection: message.role === 'user' ? 'row-reverse' : 'row'
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
      borderRadius: message.role === 'user' ? 2 : 0
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
    // Code block component
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
              '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }
            }}
          >
            <ContentCopyIcon sx={{ fontSize: '1rem' }} />
          </IconButton>
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
            {language && (
              <div style={{ 
                position: 'absolute',
                top: '12px',
                right: '12px',
                color: '#666',
                fontSize: '0.9em' 
              }}>
                {language}
              </div>
            )}
            {children}
          </code>
        </div>
      );
    },
    // Pre component for code blocks
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
        <Container maxWidth="md">
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
                <LoadingIndicator />
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
            {message.role === 'assistant' && (
              <MessageActions 
                content={message.content}
                onCopy={handleCopy}
                onRegenerate={onRegenerate}
                isLoading={message.isLoading}
              />
            )}
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

/**
 * Loading indicator component
 */
const LoadingIndicator = () => (
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
);

/**
 * Message action buttons component
 */
const MessageActions = ({ content, onCopy, onRegenerate, isLoading }) => (
  <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
    <IconButton
      title="Copy message"
      onClick={() => onCopy(content)}
    >
      <FileCopyOutlinedIcon fontSize="small" />
    </IconButton>
    <IconButton
      title="Regenerate response"
      onClick={onRegenerate}
      disabled={isLoading}
    >
      <ReplayIcon fontSize="small" />
    </IconButton>
  </Box>
);

ChatMessage.propTypes = {
  message: PropTypes.shape({
    role: PropTypes.oneOf(['user', 'assistant']).isRequired,
    content: PropTypes.string.isRequired,
    isLoading: PropTypes.bool
  }).isRequired,
  onRegenerate: PropTypes.func.isRequired
};

export default ChatMessage; 