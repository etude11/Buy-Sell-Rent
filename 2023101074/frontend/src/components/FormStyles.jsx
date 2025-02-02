import { Paper, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

export const FormContainer = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(3),
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  maxWidth: '450px',
  width: '100%',
  margin: '0 auto',
  '& .MuiTextField-root': {
    margin: theme.spacing(1, 0),
  },
  '& .MuiButton-root': {
    margin: theme.spacing(2, 0),
  }
}));

export const FormWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2)
}));

export const PageContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: '1200px',
  margin: '0 auto',
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  '& > *': {
    width: '100%',
    maxWidth: '800px',
  }
}));
