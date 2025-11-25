
// import { Container, TextField, Typography, Box, InputLabel, Select, MenuItem, FormControl, Button, CircularProgress } from '@mui/material'
// import './App.css'
// import { useState } from 'react'
// import axios from 'axios';

// function App() {
// const [emailContent, setEmailContent] = useState('');
// const [tone, setTone] = useState('');
// const [generatedReply, setGeneratedReply] = useState('');
// const [loading, setLoading] = useState(false);

// const handleSubmit = async () => {
//   setLoading(true);
//   try {
//     const response = await axios.post('http://localhost:8080/api/email/generate', {
//       emailContent,
//       tone
//     });
//     setGeneratedReply(typeof response.data === 'string' ? response.data : JSON.stringify(response.data));
//   } catch (error) {
//     console.error('Error generating email reply:', error);
//   } finally {
//     setLoading(false);
//   }
// };

//   return (
//      <Container maxWidth="md" sx={{ py: 4 }}>
//       <Typography variant='h3' component='h1' gutterBottom>
//         Email Reply Generator
//       </Typography>

//       <Box sx={{mx: 3}}>
//         <TextField
//         fullWidth
//         multiline
//         rows={6}
//         label="original Email Content"
//         variant="outlined"
//         value={emailContent || ''}
//         onChange={(e) => setEmailContent(e.target.value)}
//         sx={{mb: 2}}
//         />

//       <FormControl fullWidth sx={{mb: 2}}>
//         <InputLabel>Tone (Optional)</InputLabel>
//         <Select
//         value={tone || ''}
//         label="Tone (Optional)"
//         onChange={(e) => setTone(e.target.value)}
//         >
//         <MenuItem value="">None</MenuItem>
//         <MenuItem value="professional">Professional</MenuItem>
//         <MenuItem value="casual">Casual</MenuItem>
//         <MenuItem value="friendly">Friendly</MenuItem>
//         </Select>
//       </FormControl>

//       <Button variant="contained"
//       sx={{mb: 3}}
//       onClick={handleSubmit}
//       disabled={!emailContent || loading}>
//         {loading ? <CircularProgress size={24} /> : 'Generate Reply'}
//       </Button>
//     </Box>

//       <Box sx={{mx: 3}}>
//         <TextField
//         fullWidth
//         multiline
//         rows={6}
//         variant="outlined"
//         value={generatedReply || ''}
//         inputProps={{readonly: true}}
//         sx={{mb: 2}}
//         />
//         <Button
//         variant="outlined"
//         onClick={() => navigator.clipboard.write(generatedReply)}>  
//         Copy to Clipboard
//         </Button>
//       </Box>

//       </Container> 
//   )
// }

// export default App


import { Container, TextField, Typography, Box, InputLabel, Select, MenuItem, FormControl, Button, CircularProgress, Paper, Divider, Chip } from '@mui/material'
import './App.css'
import { useState } from 'react'
import axios from 'axios';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import SendIcon from '@mui/icons-material/Send';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

function App() {
  const [emailContent, setEmailContent] = useState('');
  const [tone, setTone] = useState('');
  const [generatedReply, setGeneratedReply] = useState('');
  const [loading, setLoading] = useState(false);
  
  // 🆕 New states for Improve feature
  const [improvementType, setImprovementType] = useState('general');
  const [improving, setImproving] = useState(false);

  // ✅ Existing Generate function
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8080/api/email/generate', {
        emailContent,
        tone
      });
      setGeneratedReply(typeof response.data === 'string' ? response.data : JSON.stringify(response.data));
    } catch (error) {
      console.error('Error generating email reply:', error);
      alert('Failed to generate reply. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // 🆕 New Improve function
  const handleImprove = async () => {
    if (!generatedReply) {
      alert('Please generate a reply first!');
      return;
    }

    setImproving(true);
    try {
      const response = await axios.post('http://localhost:8080/api/email/improve', {
        originalReply: generatedReply,
        improvementType
      });
      setGeneratedReply(typeof response.data === 'string' ? response.data : JSON.stringify(response.data));
    } catch (error) {
      console.error('Error improving email reply:', error);
      alert('Failed to improve reply. Please try again.');
    } finally {
      setImproving(false);
    }
  };

  // 🆕 Copy to clipboard function
  const handleCopy = () => {
    navigator.clipboard.writeText(generatedReply);
    alert('Copied to clipboard!');
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header */}
      <Typography variant='h3' component='h1' gutterBottom align="center" sx={{ mb: 4, fontWeight: 'bold' }}>
        ✨ AI Email Reply Generator
      </Typography>

      {/* 📧 Generate Section */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <SendIcon color="primary" />
          Generate Email Reply
        </Typography>

        <TextField
          fullWidth
          multiline
          rows={6}
          label="Original Email Content"
          variant="outlined"
          value={emailContent || ''}
          onChange={(e) => setEmailContent(e.target.value)}
          placeholder="Paste the email you want to reply to..."
          sx={{ mb: 2 }}
        />

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Tone</InputLabel>
          <Select
            value={tone || ''}
            label="Tone"
            onChange={(e) => setTone(e.target.value)}
          >
            <MenuItem value="">Default</MenuItem>
            <MenuItem value="professional">💼 Professional</MenuItem>
            <MenuItem value="casual">😎 Casual</MenuItem>
            <MenuItem value="friendly">😊 Friendly</MenuItem>
            <MenuItem value="short">⚡ Short & Direct</MenuItem>
          </Select>
        </FormControl>

        <Button 
          variant="contained" 
          size="large"
          fullWidth
          onClick={handleSubmit}
          disabled={!emailContent || loading}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
        >
          {loading ? 'Generating...' : 'Generate Reply'}
        </Button>
      </Paper>

      {/* 📝 Generated Reply & Improve Section */}
      {generatedReply && (
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <AutoFixHighIcon color="success" />
            Generated Reply
          </Typography>

          <TextField
            fullWidth
            multiline
            rows={8}
            variant="outlined"
            value={generatedReply || ''}
            onChange={(e) => setGeneratedReply(e.target.value)}
            sx={{ mb: 2, backgroundColor: '#f5f5f5' }}
          />

          <Divider sx={{ my: 2 }}>
            <Chip label="Improve Your Reply" color="success" />
          </Divider>

          {/* 🆕 Improve Controls */}
          <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
            <FormControl sx={{ flex: 1, minWidth: 200 }}>
              <InputLabel>Improvement Type</InputLabel>
              <Select
                value={improvementType}
                label="Improvement Type"
                onChange={(e) => setImprovementType(e.target.value)}
              >
                <MenuItem value="general">✨ General Improvement</MenuItem>
                <MenuItem value="grammar">📝 Fix Grammar</MenuItem>
                <MenuItem value="professional">💼 More Professional</MenuItem>
                <MenuItem value="concise">⚡ Make Concise</MenuItem>
                <MenuItem value="friendly">😊 More Friendly</MenuItem>
                <MenuItem value="clarity">🔍 Improve Clarity</MenuItem>
              </Select>
            </FormControl>

            <Button 
              variant="contained" 
              color="success"
              size="large"
              onClick={handleImprove}
              disabled={improving}
              startIcon={improving ? <CircularProgress size={20} color="inherit" /> : <AutoFixHighIcon />}
              sx={{ minWidth: 150 }}
            >
              {improving ? 'Improving...' : 'Improve'}
            </Button>
          </Box>

          {/* Copy Button */}
          <Button
            variant="outlined"
            fullWidth
            onClick={handleCopy}
            startIcon={<ContentCopyIcon />}
          >
            Copy to Clipboard
          </Button>
        </Paper>
      )}

      {/* 💡 Instructions (shown when no reply yet) */}
      {!generatedReply && (
        <Paper elevation={1} sx={{ p: 3, backgroundColor: '#f0f7ff', textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            📧 Paste an email above, select a tone, and click "Generate Reply" to get started!
          </Typography>
        </Paper>
      )}
    </Container>
  )
}

export default App
