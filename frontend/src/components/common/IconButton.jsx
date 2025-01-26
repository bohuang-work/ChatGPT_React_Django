import PropTypes from 'prop-types';
import { IconButton as MuiIconButton } from '@mui/material';

/**
 * Custom IconButton with tooltip
 * @param {Object} props - Component props
 * @param {string} props.title - Tooltip text
 * @param {Function} props.onClick - Click handler
 * @param {Object} props.sx - Custom styles
 * @param {boolean} props.disabled - Disabled state
 * @param {React.ReactNode} props.children - Button content (icon)
 */
const IconButton = ({ 
  children, 
  onClick, 
  title = '',  // Use default parameter
  disabled = false  // Use default parameter
}) => {
  return (
    <MuiIconButton
      onClick={onClick}
      title={title}
      disabled={disabled}
      sx={{
        color: '#666',
        '&:hover': {
          color: '#000',
          bgcolor: 'rgba(0,0,0,0.04)'
        }
      }}
    >
      {children}
    </MuiIconButton>
  );
};

IconButton.propTypes = {
  children: PropTypes.node.isRequired, // Must provide an icon
  onClick: PropTypes.func.isRequired, // Must provide a click handler
  title: PropTypes.string, // Optional tooltip text 
  disabled: PropTypes.bool // Optional disabled state
};

export default IconButton; 