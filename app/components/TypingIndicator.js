/*import { Box, CircularProgress, Typography } from '@mui/material';

const TypingIndicator = () => (
  <Box display="flex" alignItems="center" gap={1} p={1}>
    <CircularProgress size={30}  />
    <Typography variant="body2">PawsitiveCare is thinking...</Typography>
  </Box>
);

export default TypingIndicator;*/

import { Box, Typography } from '@mui/material';

const TypingIndicator = () => (
  <Box display="flex" alignItems="center" gap={1} p={1}>
    <Typography 
      variant="body2" 
      sx={{ 
        color: '#FF69B4', // Hot pink color
        fontFamily: 'Courier New, monospace', // Changed font
        fontWeight: 'bold', // Made text bold
        fontSize: '1.1rem', // Increased font size slightly
      }}
    >
      Kitty is thinking...
    </Typography>
  </Box>
);

export default TypingIndicator;