import PropTypes from 'prop-types';

/**
 * TableCell Component
 * 
 * Renders a table cell (th or td) with consistent styling.
 * Used internally by MarkdownTable for both header and regular cells.
 *
 * @component
 * @param {Object} props
 * @param {React.ReactNode} props.children - Cell content
 * @param {boolean} [props.isHeader] - Whether this is a header cell (th)
 * @returns {JSX.Element} Styled table cell
 */
const TableCell = ({ children, isHeader }) => {
  const style = {
    border: '1px solid #ddd',
    padding: isHeader ? '12px 8px' : '8px',
    background: isHeader ? '#f5f5f5' : 'transparent',
    fontWeight: isHeader ? 600 : 'normal',
    textAlign: 'left',
    lineHeight: 1.4,
    verticalAlign: 'top'
  };

  return isHeader ? <th style={style}>{children}</th> : <td style={style}>{children}</td>;
};

/**
 * MarkdownTable Component
 * 
 * Renders a styled table for markdown content.
 * Provides consistent table styling across the application.
 *
 * Features:
 * - Full width layout
 * - Collapsed borders
 * - Consistent spacing
 * - Slightly smaller font size
 *
 * @component
 * @param {Object} props
 * @param {React.ReactNode} props.children - Table content (typically tr elements)
 * @returns {JSX.Element} Styled table element
 */
const MarkdownTable = ({ children }) => {
  const style = {
    borderCollapse: 'collapse',
    width: '100%',
    marginBottom: '1rem',
    fontSize: '0.9em'
  };

  return <table style={style}>{children}</table>;
};

TableCell.propTypes = {
  children: PropTypes.node,
  isHeader: PropTypes.bool
};

MarkdownTable.propTypes = {
  children: PropTypes.node
};

export { MarkdownTable, TableCell }; 